from scipy.spatial import distance
import hashlib
import json

def hash_vec(vec):
    h = hashlib.sha256(json.dumps(vec).encode('utf-8'))
    return h.hexdigest()

def calculate_distance(a, b, metric='euclidean'):
    if metric == 'euclidean':
        return distance.euclidean(a, b)
    elif metric == 'angular':
        return distance.cosine(a, b)
    elif metric == 'manhattan':
        return distance.cityblock(a, b)
    elif metric == 'hamming':
        return distance.hamming(a, b)
    else:
        raise ValueError('unknown distance metric')
