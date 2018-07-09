from flask import Flask, jsonify, request
from kernns.dataset import read_dataset_csv, load_dataset, add_vector, remove_vector, get_vector_by_key, reindex_vectors, get_vector_keys, clean_old_versions
from kernns.index import load_index, build_index, find_nns, save_metadata
import argparse
import os
import threading
import time

def train(index_dir, dataset, trees, metric):
    dataset_iter = read_dataset_csv(dataset)
    model = train_model(index_dir, dataset_iter, metric=metric, trees=trees)
    print(model[0])

def test(index_dir, dataset):
    dataset_iter = read_dataset(dataset)
    model = load_model(index_dir)

    total = 0
    correct = 0

    for (k, v) in dataset_iter:
        data = find_nns(model, v, 1)
        total += 1
        if data[0]['key'] == k or data[0]['key'].split('/')[0] == k.split('/')[0]:
            correct += 1

    print('Total: {}, Correct: {}, Accuracy: {}'.format(total, correct, correct / total))

def server(indices_dir, port, rebuild, default_metric, default_trees):
    indices = {}
    def load_cached_index(index_name):
        index_dir = indices_dir + '/' + index_name
        if index_name in indices:
            return indices[index_name]

        try:
            os.makedirs(indices_dir + '/' + index_name)
        except FileExistsError:
            pass

        dataset = load_dataset(index_dir)
        metadata, ann_index = load_index(index_dir)
        index = (dataset, metadata, ann_index)
        indices[index_name] = index
        return index

    changes_count = {}

    def rebuild_index(index_name, metric=None, trees=None):
        current_changes = changes_count[index_name]
        dataset, metadata, ann_index = load_cached_index(index_name)
        if metric is None:
            metric = metadata['metric'] or default_metric
        if trees is None:
            trees = metadata['trees'] or default_trees
        version = reindex_vectors(dataset)
        index_dir = indices_dir + '/' + index_name
        new_metadata, new_ann_index = build_index(index_dir, dataset, version, metric=metric, trees=trees)
        new_index = (dataset, new_metadata, new_ann_index)
        indices[index_name] = new_index
        clean_old_versions(dataset, version)
        changes_count[index_name] -= current_changes

    if rebuild:
        start_time = time.time()
        def rebuild_changed_indices():
            while True:
                for index_name in changes_count:
                    if changes_count[index_name] > 0:
                        print('rebuilding index', index_name)
                        rebuild_index(index_name)
                        print('finished rebuilding index', index_name)
                time.sleep(rebuild - ((time.time() - start_time) % rebuild))
        thread = threading.Thread(target=rebuild_changed_indices)
        thread.daemon = True
        thread.start()

    app = Flask(__name__)

    @app.route('/<index_name>', methods=['GET'])
    def handle_count(index_name):
        dataset, metadata, ann_index = load_cached_index(index_name)
        if metadata is None:
            return jsonify({
                'data': {
                    'rank': None,
                    'trees': None,
                    'metric': None,
                    'changes': changes_count[index_name],
                    'indexed': 0,
                    'version': None
                }
            })
        else:
            return jsonify({
                'data': {
                    'rank': metadata['rank'],
                    'trees': metadata.get('trees', None),
                    'metric': metadata.get('metric', None),
                    'changes': changes_count.get(index_name, 0),
                    'indexed': metadata.get('count', 0),
                    'version': metadata.get('version', None)
                }
            })

    @app.route('/<index_name>/vectors', methods=['GET'])
    def handle_vectors(index_name):
        dataset, metadata, ann_index = load_cached_index(index_name)
        keys = get_vector_keys(dataset)
        return jsonify({ 'data': { 'count': len(keys), 'keys': keys } })

    @app.route('/<index_name>/vectors/<key>', methods=['GET', 'PUT', 'DELETE'])
    def handle_vector(index_name, key):
        dataset, metadata, ann_index = load_cached_index(index_name)
        if request.method == 'GET':
            vec = get_vector_by_key(dataset, key)
            if vec:
                return jsonify({ 'data': vec })
            else:
                return jsonify({ 'data': None }), 404
        elif request.method == 'PUT':
            try:
                vec = [float(x) for x in request.json['vec'].split(' ')]

                if metadata is None:
                    index_dir = indices_dir + '/' + index_name
                    new_metadata = save_metadata(index_dir, len(vec))
                    indices[index_name] = (dataset, new_metadata, ann_index)
                elif metadata['rank'] and len(vec) != metadata['rank']:
                    message = 'vector size is not ' + str(metadata['rank'])
                    return jsonify({ 'errors': [{ 'message': message }] })

                add_vector(dataset, key, vec)
                changes_count[index_name] = changes_count.get(index_name, 0) + 1
                return jsonify({ 'data': True })
            except ValueError as err:
                return jsonify({ 'errors': [{ 'message': 'invalid value: ' + str(err) }] })
        else:
            success = remove_vector(dataset, key)
            changes_count[index_name] = changes_count.get(index_name, 0) + 1
            return jsonify({ 'data': success })

    @app.route('/<index_name>/build', methods=['POST'])
    def handle_build(index_name):
        dataset, metadata, ann_index = load_cached_index(index_name)

        if request.json:
            metric = str(request.json.get('metric', default_metric))
            trees = int(request.json.get('trees', default_trees))
        else:
            metric = default_metric
            trees = default_trees

        rebuild_index(index_name, metric, trees)
        return jsonify({ 'data': True })

    @app.route('/<index_name>/search', methods=['POST'])
    def handle_search(index_name):
        dataset, metadata, ann_index = load_cached_index(index_name)
        try:
            vec = [float(x) for x in request.json['vec'].split(' ')]
            k = request.json.get('k', 8)
            include_exact = request.json.get('exact', True)
            max_dist = float(request.json.get('max', 'inf'))
        except KeyError as err:
            return jsonify({
                'errors': [{ 'message': 'missing arg: ' + str(err) }]
            }), 400
        except (TypeError, ValueError) as err:
            return jsonify({
                'errors': [{ 'message': 'invalid value: ' + str(err) }]
            }), 400

        try:
            data = find_nns(dataset, metadata, ann_index, vec, k, max_dist, include_exact)
            return jsonify({ 'data': data })
        except IndexError:
            return jsonify({ 'errors': [{ 'message': 'vector size differs' }] }), 400

    app.run(host='0.0.0.0', port=port)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest='subparser')
    train_parser = subparsers.add_parser('train')
    train_parser.add_argument('index_dir', metavar='INDEX_DIR', help='path to the index')
    train_parser.add_argument('dataset_csv', metavar='DATASET_CSV', help='path to the input dataset')
    train_parser.add_argument('--trees', default=10, type=int, help='the number of trees to use')
    train_parser.add_argument('--metric', default='euclidean', help='the metric used to calculate distance')

    test_parser = subparsers.add_parser('test')
    test_parser.add_argument('index_dir', metavar='INDEX_DIR', help='path to the index')
    test_parser.add_argument('dataset_csv', metavar='DATASET_CSV', help='port to listen on')

    server_parser = subparsers.add_parser('server')
    server_parser.add_argument('indices_dir', metavar='INDICES_DIR', help='path to a director containing indices')
    server_parser.add_argument('--default-metric', type=str, default='hamming', help='the default metric for new indices')
    server_parser.add_argument('--default-trees', type=int, default=40, help='the default number of trees for new indices')
    server_parser.add_argument('--port', type=int, help='port to listen on')
    server_parser.add_argument('--rebuild', type=int, default=5, help='rebuild every N seconds')

    kwargs = vars(parser.parse_args())
    globals()[kwargs.pop('subparser')](**kwargs)
