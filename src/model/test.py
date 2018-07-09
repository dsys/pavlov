from PIL import Image
from keras.models import model_from_json
from keras.preprocessing import image
from keras.applications.inception_resnet_v2 import InceptionResNetV2, preprocess_input
import os
import glob
import math
import numpy as np

max_size = 139
min_score = 0.01
background = (170, 170, 170)

model = model_from_json(open('model.json').read())
model.load_weights('weights.h5')
model.compile(loss='categorical_crossentropy', optimizer='adam')
labels = open('labels.txt', 'r').read().splitlines()

def chunk(iterable, chunk_size):
    """Generate sequences of `chunk_size` elements from `iterable`."""
    iterable = iter(iterable)
    while True:
        chunk = []
        try:
            for _ in range(chunk_size):
                chunk.append(next(iterable))
            yield chunk
        except StopIteration:
            if chunk:
                yield chunk
            break

def load_image(image_path):
    img = Image.open(image_path)
    img.thumbnail(size=(max_size, max_size))
    new_width, new_height = img.size

    x1 = int(math.floor((max_size - new_width) / 2))
    y1 = int(math.floor((max_size - new_height) / 2))

    img_with_bg = Image.new('RGB', (max_size, max_size), background)
    img_with_bg.paste(img, (x1, y1, x1 + new_width, y1 + new_height))
    return image.img_to_array(img_with_bg)

def predict(images):
    prediction = model.predict(np.stack(images))
    output = []
    for i in prediction:
        o = {}
        for j, k in enumerate(prediction[0]):
            if k >= min_score:
                o[labels[j]] = float(k)
        output.append(o)
    return output

for kf in glob.glob('data/raw/*'):
    klass = os.path.basename(kf)
    total = 0
    correct = 0
    wrong_klasses = set()
    for image_paths in chunk(glob.glob('data/raw/' + klass + '/*'), 139):
        images = []
        for image_path in image_paths:
            try:
                img = preprocess_input(load_image(image_path))
                images.append(img)
                total += 1
            except OSError:
                print("error processing", image_path)

        for output in predict(images):
            if klass in output and output[klass] >= 0.5:
                correct += 1
            wrong_klasses |= set(output.keys())
    wrong_klasses.discard(klass)
    print(klass + ': ' + str(correct) + '/' + str(total))
    print('  wrong classes: ', ', '.join(wrong_klasses))
    print()
