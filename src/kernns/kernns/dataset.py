from .utils import hash_vec
import csv
import msgpack
import os
import time
import rocksdb

def read_dataset_csv(path):
    reader = csv.DictReader(open(path, 'r+'))
    for r in reader:
        yield (r['k'], [float(s) for s in r['v'].split(' ')])

def load_dataset(index_dir):
    return rocksdb.DB(index_dir + '/vectors.db', rocksdb.Options(create_if_missing=True))

def add_vector(dataset, key, vec):
    batch = rocksdb.WriteBatch()
    db_key = ('k/' + key).encode('utf-8')
    old_vec = get_vector_by_key(dataset, key)
    if old_vec:
        old_db_hash = ('h/' + hash_vec(old_vec) + '/' + key).encode('utf-8')
        batch.delete(old_db_hash)
    db_vec = msgpack.packb(vec, use_bin_type=True)
    db_hash = ('h/' + hash_vec(vec) + '/' + key).encode('utf-8')
    batch.put(db_key, db_vec)
    batch.put(db_hash, db_key)
    dataset.write(batch)

def remove_vector(dataset, key):
    db_key = ('k/' + key).encode('utf-8')
    batch = rocksdb.WriteBatch()
    old_vec = get_vector_by_key(dataset, key)
    if old_vec:
        old_db_hash = ('h/' + hash_vec(old_vec) + '/' + key).encode('utf-8')
        batch.delete(old_db_hash)
    dataset.delete(db_key)
    dataset.write(batch)
    return True

def get_vector_by_key(dataset, key):
    db_key = ('k/' + key).encode('utf-8')
    if dataset.key_may_exist(db_key):
        db_vec = dataset.get(db_key)
        if db_vec:
            return msgpack.unpackb(db_vec)
        else:
            return None
    else:
        return None

def get_vector_by_index(dataset, version, i):
    db_i = 'i/{0}/{1:09d}'.format(version, i).encode('utf-8')
    db_key = dataset.get(db_i)
    key = db_key.decode('utf-8')[2:]
    return key, get_vector_by_key(dataset, key)

def get_vector_keys(dataset):
    it = dataset.iterkeys()
    it.seek(b'k/')
    keys = []
    for db_key in it:
        if not db_key.startswith(b'k/'):
            break
        key = db_key.decode('utf-8')[2:]
        keys.append(key)
    return keys

def get_keys_by_vector(dataset, vec):
    db_hash_prefix = ('h/' + hash_vec(vec)).encode('utf-8')
    it = dataset.iteritems()
    it.seek(db_hash_prefix)

    keys = []
    for db_hash, db_key in it:
        if not db_hash.startswith(db_hash_prefix):
            break
        key = db_key.decode('utf-8')[2:]
        keys.append(key)
    return keys

def reindex_vectors(dataset):
    version = str(round(time.time() * 1000))
    print('writing index for version', version)
    batch = rocksdb.WriteBatch()

    it = dataset.iteritems()
    it.seek(b'k/')
    for i, (db_key, db_vec) in enumerate(it):
        if not db_key.startswith(b'k/'):
            break
        key = db_key.decode('utf-8')[2:]
        vec = msgpack.unpackb(db_vec)
        db_i = 'i/{0}/{1:09d}'.format(version, i).encode('utf-8')
        batch.put(db_i, db_key)

    dataset.write(batch)
    return version

def clean_old_versions(dataset, latest_version):
    print('cleaning versions before', latest_version)
    start_k = b'i/'
    end_k = ('i/' + latest_version).encode('utf-8')
    batch = rocksdb.WriteBatch()
    it = dataset.iterkeys()
    it.seek(b'i/')
    for db_i in it:
        if not db_i.startswith(start_k) or db_i.startswith(end_k):
            break
        batch.delete(db_i)
    dataset.write(batch)

def iter_indexed_vectors(dataset, version):
    version_prefix = ('i/' + str(version)).encode('utf-8')
    it = dataset.iteritems()
    it.seek(version_prefix)
    for i, (db_i, db_key) in enumerate(it):
        if not db_i.startswith(version_prefix):
            break
        db_vec = dataset.get(db_key)
        if not db_vec:
            continue
        key = db_key.decode('utf-8')[2:]
        vec = msgpack.unpackb(db_vec)
        yield i, key, vec
