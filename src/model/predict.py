from PIL import Image
from tempfile import NamedTemporaryFile
import base64
import json
import io
import math
import os
import argparse
import subprocess
import sys

parser = argparse.ArgumentParser(description='Perform a prediction on an image using a Google Cloud ML image model.j')
parser.add_argument('model', help='the name of the remote model to test, or a file path if --local is provided')
parser.add_argument('image', type=argparse.FileType('rb'), help='path to the image to use for prediction')
parser.add_argument('-l', '--local', action='store_true', help='flag for local testing of models')
parser.add_argument('-s', '--size', type=int, default=139, help='the size to resize the image to')
parser.add_argument('-b', '--background', type=int, default=170, help='the color of gray to use for the background')
parser.add_argument('-v', '--version', help='the version of the model to use')

args = parser.parse_args()

img = Image.open(args.image)
img.thumbnail(size=(args.size, args.size))
new_width, new_height = img.size

x1 = int(math.floor((args.size - new_width) / 2))
y1 = int(math.floor((args.size - new_height) / 2))

img_with_bg = Image.new('RGB', (args.size, args.size), (args.background, args.background, args.background))
img_with_bg.paste(img, (x1, y1, x1 + new_width, y1 + new_height))

img_bytes = io.BytesIO()
img_with_bg.save(img_bytes, format='PNG')
img_b64 = base64.b64encode(img_bytes.getvalue()).decode('utf-8')

with NamedTemporaryFile(mode='w') as f:
    json_instances = {'input_bytes': {'b64': img_b64}}
    json.dump(json_instances, f)
    f.flush()

    if args.local:
        subprocess.run([
            'gcloud', 'ml-engine', 'local', 'predict',
            '--model-dir', args.model,
            '--json-instances', f.name
            ])
    else:
        if args.version:
            subprocess.run([
                'gcloud', 'ml-engine', 'predict',
                '--model', args.model,
                '--version', args.version,
                '--json-instances', f.name
                ])
        else:
            subprocess.run([
                'gcloud', 'ml-engine', 'predict',
                '--model', args.model,
                '--json-instances', f.name
                ])
