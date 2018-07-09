from .dataset import get_keys_by_vector, get_vector_by_index, iter_indexed_vectors
from .utils import hash_vec, calculate_distance
from annoy import AnnoyIndex
import json
import msgpack
import rocksdb

def save_metadata(index_dir, rank, count=None, trees=None, metric=None, version=None):
    metadata = {
        'rank': rank,
        'count': count,
        'trees': trees,
        'metric': metric,
        'version': version
    }
    json.dump(metadata, open(index_dir + '/metadata.json', 'w+'))
    return metadata

def build_index(index_dir, dataset, version, metric='euclidean', trees=10):
    print('building index for version', version)
    ann_index = None
    rank = None
    count = 0
    for i, key, vec in iter_indexed_vectors(dataset, version):
        l = len(vec)
        if ann_index is None:
            rank = l
            ann_index = AnnoyIndex(rank, metric=metric)
        elif rank != l:
            raise RuntimeError('vector sizes differ')
        ann_index.add_item(i, vec)
        count += 1

    if ann_index is None:
        return None, None

    ann_index.build(trees)
    ann_index.save(index_dir + '/index.ann')
    print('saving metadata for version', version)
    metadata = save_metadata(index_dir, rank, count=count, trees=trees, metric=metric, version=version)
    return metadata, ann_index

def load_index(index_dir):
    try:
        metadata = json.load(open(index_dir + '/metadata.json', 'r+'))
        if metadata.get('version', None) is None:
            return metadata, None
        ann_index = AnnoyIndex(metadata['rank'], metric=metadata['metric'])
        ann_index.load(index_dir + '/index.ann')
        return metadata, ann_index
    except FileNotFoundError:
        return None, None

def find_nns(dataset, metadata, ann_index, vec, n=8, max_dist=float('inf'), include_exact=True):
    if metadata is None:
        return []

    results = []
    if include_exact:
        keys_exact = get_keys_by_vector(dataset, vec)
        results = [{ 'key': key, 'dist': 0 } for key in keys_exact]

    if ann_index is not None:
        nn_idxs, _dists = ann_index.get_nns_by_vector(vec, n, include_distances=True)
        for i in nn_idxs:
            key, nn_vec = get_vector_by_index(dataset, metadata['version'], i)
            if key in keys_exact or nn_vec is None:
                continue
            dist = calculate_distance(vec, nn_vec, metadata['metric'])
            results.append({ 'key': key, 'dist': dist })

    return [r for r in results[0:n] if r['dist'] <= max_dist]
