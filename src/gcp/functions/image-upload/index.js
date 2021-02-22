/* eslint-disable no-console */

import cryptoAsync from '@ronomon/crypto-async';
import fetch from 'node-fetch';
import fileType from 'file-type';
import fs from 'fs';
import imageSize from 'image-size';
import mkdirp from 'mkdirp';
import sharp from 'sharp';
import os from 'os';
import path from 'path';
import { spawn } from 'child-process-promise';

const gcs = require('@google-cloud/storage')({
  projectId: 'pavlov-mono',
  keyFilename: 'key.json'
});

const DEBUG = false;

const IMAGES_BUCKET = gcs.bucket(
  __DEV__ ? 'pavlov-images-dev' : 'pavlov-images'
);

const IMAGE_ARTIFACTS_BUCKET = gcs.bucket(
  __DEV__ ? 'pavlov-image-artifacts-dev' : 'pavlov-image-artifacts'
);

const TEMPORARY_BUCKET = gcs.bucket(
  __DEV__ ? 'pavlov-temporary-dev' : 'pavlov-temporary'
);

const FETCH_MAX_SIZE = 32 * 1024 * 1024;
const FETCH_TIMEOUT = 16 * 1000;
const MAX_PIXELS = 150000000;

const LAMBDA_IDENTIFY_URL =
  'INSERT_LAMBDA_IDENTIFY_URL_HERE';
const LAMBDA_IDENTIFY_KEY = 'INSERT_LAMBDA_IDENTIFY_KEY_HERE';
const LAMBDA_TIMEOUT = 16 * 1000;

function detectMimeType(image) {
  const ft = fileType(image);
  return ft ? ft.mime : 'application/octet-stream';
}

async function callIdentifyAWSLambda(imagePath) {
  const tempURL = await uploadTemporaryFile(imagePath);
  const lambdaRes = await fetch(LAMBDA_IDENTIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': LAMBDA_IDENTIFY_KEY
    },
    body: JSON.stringify({ url: tempURL }),
    timeout: LAMBDA_TIMEOUT
  });

  if (lambdaRes.headers.get('content-type') === 'application/json') {
    const lambdaResBody = await lambdaRes.json();
    console.log('Received response from AWS Lambda:', lambdaResBody);
    if (lambdaResBody.data) {
      return lambdaResBody.data;
    } else {
      console.log('Received error from AWS Lambda:', lambdaResBody.error);
      throw new Error('could not process image');
    }
  } else {
    const lambdaError = await lambdaRes.text();
    console.log('Received error from AWS Lambda:', lambdaError);
    throw new Error('could not process image');
  }
}

async function detectSize(imagePath) {
  try {
    const size = await imageSize(imagePath);

    if (size.width * size.height > MAX_PIXELS) {
      const err = new Error('image too large');
      err.status = 400;
      throw err;
    }

    try {
      console.log(`Validating image of size ${size.width}x${size.height}`);
      await sharp(imagePath)
        .resize(1, 1)
        .crop(sharp.strategy.northwest)
        .toBuffer();
    } catch (err) {
      console.log(`Failing over to ImageMagick due to error: ${err.message}`);
      await spawn('convert', [imagePath, 'NULL:']);
    }

    return size;
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      console.log(`Failing over to AWS Lambda due to error: ${err.message}`);
      return callIdentifyAWSLambda(imagePath);
    }
  }
}

async function calculatePixelSHA256(buffer) {
  try {
    console.log(
      `Calculating SHA 256 of the pixel buffer of image (len: ${buffer.length})`
    );
    const pixelBuffer = await sharp(buffer)
      .raw()
      .toBuffer();

    return calculateSHA256(pixelBuffer);
  } catch (err) {
    console.log(
      `Failing over to calculating SHA 256 of the image buffer itself`
    );
    return calculateSHA256(buffer);
  }
}

function calculateSHA256(buffer) {
  return new Promise((resolve, reject) => {
    cryptoAsync.hash('sha256', buffer, (err, sha256Buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(sha256Buffer.toString('hex'));
      }
    });
  });
}

function writeFile(path, body) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, body, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function unlinkFile(path, body) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      // ignore err
      resolve();
    });
  });
}

async function uploadFile(bucket, gcsPath, filePath, contentType) {
  console.log(`Uploading ${filePath} to ${gcsPath}`);
  if (DEBUG) {
    return Promise.resolve();
  } else {
    await bucket.upload(filePath, {
      destination: gcsPath,
      validation: 'crc32c',
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000'
      }
    });
    console.log(`Finished uploading ${filePath} to ${gcsPath}`);
  }
}

async function downloadJSONFile(bucket, gcsPath) {
  console.log(`Downloading JSON file ${gcsPath}`);
  const gcsData = await bucket.file(gcsPath).download(gcsPath);
  return JSON.parse(gcsData[0]);
}

async function fileExists(bucket, gcsPath) {
  const gcsData = await bucket.file(gcsPath).exists();
  return gcsData[0];
}

async function uploadTemporaryFile(filePath) {
  console.log(`Uploading temporary file ${filePath} to ${filePath}`);
  await TEMPORARY_BUCKET.upload(filePath, {
    destination: filePath,
    validation: 'crc32c'
  });

  const temporaryGCSFile = TEMPORARY_BUCKET.file(filePath);
  const gcsData = await temporaryGCSFile.getSignedUrl({
    action: 'read',
    expires: '03-17-2025'
  });

  return gcsData[0];
}

async function processImage(imageBuffer) {
  const contentLength = imageBuffer.length;
  const contentType = detectMimeType(imageBuffer);
  const sha256 = await calculatePixelSHA256(imageBuffer);

  const tempDir = path.join(os.tmpdir(), sha256);
  const tempImagePath = path.join(tempDir, 'raw');
  const tempMetadataPath = path.join(tempDir, 'metadata.json');
  const gcsImagePath = `${sha256}/raw`;
  const gcsMetadataPath = `${sha256}/metadata.json`;

  try {
    const exists = await fileExists(IMAGE_ARTIFACTS_BUCKET, gcsMetadataPath);
    if (exists && !DEBUG) {
      console.log('Using cached metadata for existing image');
      return downloadJSONFile(IMAGE_ARTIFACTS_BUCKET, gcsMetadataPath);
    }
  } catch (err) {
    console.log(`Error loading cached metadata: ${err.message}`);
  }

  try {
    console.log(`Writing image to ${tempImagePath}`);
    await mkdirp(tempDir);
    console.log(`created directory ${tempDir}`);
    await writeFile(tempImagePath, imageBuffer);

    console.log(`Detecting size of ${tempImagePath}`);
    const { width, height } = await detectSize(tempImagePath);

    const metadata = {
      sha256,
      contentType,
      contentLength,
      width,
      height
    };

    await writeFile(tempMetadataPath, JSON.stringify(metadata));

    await Promise.all([
      uploadFile(IMAGES_BUCKET, gcsImagePath, tempImagePath, contentType),
      uploadFile(
        IMAGE_ARTIFACTS_BUCKET,
        gcsMetadataPath,
        tempMetadataPath,
        'application/json'
      )
    ]);

    return metadata;
  } finally {
    console.log(`Cleaning up temp directory ${tempDir}`);
    await Promise.all([
      unlinkFile(tempImagePath),
      unlinkFile(tempMetadataPath)
    ]);
  }
}

async function fetchImage(url) {
  console.log(`Fetching image from ${url}`);
  const imageRes = await fetch(url, {
    method: 'GET',
    size: FETCH_MAX_SIZE,
    timeout: FETCH_TIMEOUT
  });

  if (!imageRes.ok) {
    const err = new Error('could not fetch image');
    err.status = 400;
    throw err;
  }

  return imageRes.buffer();
}

async function handleRequest(req) {
  switch (req.get('content-type')) {
    case 'application/octet-stream':
      if (req.body && req.body.length > 0) {
        console.log('Received image via file upload');
        return processImage(req.body);
      } else {
        const err = new Error('image not provided');
        err.status = 400;
        throw err;
      }

    case 'application/json':
      if (req.body.url) {
        const imageBuffer = await fetchImage(req.body.url);
        if (imageBuffer && imageBuffer.length > 0) {
          return processImage(imageBuffer);
        } else {
          const err = new Error('image not provided');
          err.status = 400;
          throw err;
        }
      } else {
        const err = new Error('image URL not provided');
        err.status = 400;
        throw err;
      }

    default: {
      const err = new Error('invalid request');
      err.status = 400;
      throw err;
    }
  }
}

exports.run = (req, res) => {
  handleRequest(req)
    .then(data => res.json({ data }))
    .catch(err => {
      const status = err.status || 500;
      res.status(status).send({ error: err.message });
    });
};
