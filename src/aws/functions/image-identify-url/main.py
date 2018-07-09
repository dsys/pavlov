import base64
import json
import os
import re
import requests
import shutil
import subprocess
import tempfile

def client_error(message):
  print('Client error:', message)
  return {
      'statusCode': 400,
      'headers': { 'Content-Type': 'application/json' },
      'body': json.dumps({ 'error': message })
      }

def server_error(message):
  print('Server error:', message)
  return {
      'statusCode': 500,
      'headers': { 'Content-Type': 'application/json' },
      'body': json.dumps({ 'error': message })
      }

def handle(event, context):
  image_file = None
  try:
    body = json.loads(event['body'])
    url = body['url']
    print('Fetching image {}'.format(url))
    res = requests.get(url, stream=True)

    image_file = tempfile.NamedTemporaryFile(delete=False)
    print('Writing image to {}'.format(image_file.name))
    shutil.copyfileobj(res.raw, image_file)
    image_file.close()

    print('Identifying image size')
    identify_out = subprocess.check_output(['identify', '-format', '%G', image_file.name])
    parts = re.split('[x\n]', identify_out.decode('utf-8'))
    if len(parts) < 2:
      return client_error('could not process image: invalid dimensions')

    width = int(parts[0])
    height = int(parts[1])
    data = { 'width': width, 'height': height }

    print('Validating image of size {}x{}'.format(width, height))
    subprocess.check_call(['convert', image_file.name, 'NULL:'])

    print('Done processing image')
    return {
        'statusCode': 200,
        'headers': { 'Content-Type': 'application/json' },
        'body': json.dumps({ 'data': data })
        }
  except subprocess.CalledProcessError as err:
    return client_error('could not process image: {}'.format(str(err)))
  finally:
    if image_file:
      os.unlink(image_file.name)
