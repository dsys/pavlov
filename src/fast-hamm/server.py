from flask import Flask, jsonify, request
import argparse
import msgpack
import numpy as np
import os
import rocksdb

parser = argparse.ArgumentParser()
parser.add_argument('database', metavar='DATABASE', help='path to the database')
parser.add_argument('--port', type=int, default=5000, help='path to the database')
args = parser.parse_args()

db_opts = rocksdb.Options()
db_opts.create_if_missing = True
db_opts.max_open_files = 300000
db_opts.write_buffer_size = 67108864
db_opts.max_write_buffer_number = 3
db_opts.target_file_size_base = 67108864
db_opts.table_factory = rocksdb.BlockBasedTableFactory(
    filter_policy=rocksdb.BloomFilterPolicy(10),
    block_cache=rocksdb.LRUCache(2 * (1024 ** 3)),
    block_cache_compressed=rocksdb.LRUCache(500 * (1024 ** 2)))

db = rocksdb.DB(args.database, db_opts)

app = Flask(__name__)

@app.route('/_ping', methods=['GET'])
def handle_ping():
    return jsonify({ 'data': 'pong' })

@app.route('/<index>', methods=['GET', 'POST', 'DELETE'])
def handle_index(index):
    db_start_key = (index + '/').encode('utf-8')
    if request.method == 'GET':
        it = db.iterkeys()
        it.seek(db_start_key)
        count = 0
        if request.args.get('list', False):
            keys = []
            for db_key in it:
                if not db_key.startswith(db_start_key): break
                count += 1
                _index, key = db_key.decode('utf-8').split('/')
                keys.append(key)
            return jsonify({ 'count': count, 'keys': keys })
        else:
            for db_key in it:
                if not db_key.startswith(db_start_key): break
                count += 1
            return jsonify({ 'count': count })
    elif request.method == 'POST':
        try:
            results = []
            vec = np.array([int(x) for x in list(request.json['vec'])])
            rank = len(vec)
            max_dist = int(request.json.get('max', 10))
            it = db.iteritems()
            it.seek(db_start_key)
            for db_key, db_val in it:
                if not db_key.startswith(db_start_key): break
                other_vec = np.array(msgpack.unpackb(db_val))
                if rank != len(other_vec):
                    continue
                dist = np.count_nonzero(vec != other_vec)
                if dist <= max_dist:
                    _index, key = db_key.decode('utf-8').split('/')
                    results.append({ 'key': key, 'dist': dist })
            return jsonify({ 'data': results })
        except KeyError as err:
            return jsonify({
                'errors': [{ 'message': 'missing arg: ' + str(err) }]
            }), 400
        except (TypeError, ValueError) as err:
            return jsonify({
                'errors': [{ 'message': 'invalid value: ' + str(err) }]
            }), 400
    else:
        it = db.iterkeys()
        it.seek(db_start_key)
        count = 0
        batch = rocksdb.WriteBatch()
        for db_key in it:
            if not db_key.startswith(db_start_key): break
            batch.delete(db_key)
            count += 1
        db.write(batch)
        return jsonify({ 'data': count })

@app.route('/<index>/<key>', methods=['GET', 'PUT', 'DELETE'])
def handle_vector(index, key):
    db_key = (index + '/' + key).encode('utf-8')
    if request.method == 'GET':
        db_val = db.get(db_key)
        if db_val is None:
            return jsonify({ 'errors': [{ 'message': 'not found' }] }), 404
        val = ''.join(str(x) for x in msgpack.unpackb(db_val))
        return jsonify({ 'data': val })
    elif request.method == 'PUT':
        if request.json is None:
            return jsonify({ 'errors': [{ 'message': 'body required' }] }), 400
        try:
            vec = [int(x) for x in list(request.json['vec'])]
            db_val = msgpack.packb(vec)
            db.put(db_key, db_val)
            return jsonify({ 'data': True })
        except ValueError as err:
            return jsonify({ 'errors': [{ 'message': 'invalid value: ' + str(err) }] }), 400
    else:
        db.delete(db_key)
        return jsonify({ 'data': True })

app.run(host='0.0.0.0', port=args.port)
