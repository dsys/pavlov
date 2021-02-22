/* eslint-disable no-console */

import fetch from 'node-fetch';
import fs from 'fs';
import mkdirp from 'mkdirp';
import sharpPhash from 'sharp-phash';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { spawn } from 'child-process-promise';
import { timeout as promiseTimeout } from 'promise-timeout';

const gcs = require('@google-cloud/storage')({
  projectId: 'pavlov-mono',
  keyFilename: 'key.json'
});

const DEBUG = false;
const CALCULATE_PHASH = true;

const SIZES = [64, 128, 256, 512];
const PHASH_SIZE = 32;
const LARGEST_SIZE = Math.max(...SIZES);
const SMALLER_SIZES = SIZES.filter(s => s !== LARGEST_SIZE);
const MAX_EVENT_AGE = 2 * 60 * 1000;

const IMAGES_BUCKET = gcs.bucket(
  __DEV__ ? 'pavlov-images-dev' : 'pavlov-images'
);
const ARTIFACTS_BUCKET = gcs.bucket(
  __DEV__ ? 'pavlov-image-artifacts-dev' : 'pavlov-image-artifacts'
);

const LAMBDA_RESIZE_URL =
  'INSERT_LAMBDA_URL_HERE';
const LAMBDA_RESIZE_KEY = 'INSERT_LAMBDA_KEY_HERE';
const LAMBDA_RESIZE_TIMEOUT = 16 * 1000;

function resizeImageWithSharp(originalPath, resizedPath, size) {
  return sharp(originalPath)
    .resize(size, size)
    .max()
    .withoutEnlargement()
    .toFormat('png')
    .toFile(resizedPath);
}

async function resizeImageWithSharpForPhash(originalPath, resizedPath) {
  try {
    return await sharp(originalPath)
      .trim()
      .resize(PHASH_SIZE, PHASH_SIZE)
      .ignoreAspectRatio()
      .background('#aaaaaa')
      .flatten()
      .toFormat('png')
      .toFile(resizedPath);
  } catch (err) {
    if (err.message.indexOf('trimming') === -1) {
      throw err;
    } else {
      console.log(`Error trimming image: ${err.message}`);
      return sharp(originalPath)
        .resize(PHASH_SIZE, PHASH_SIZE)
        .ignoreAspectRatio()
        .background('#aaaaaa')
        .flatten()
        .toFormat('png')
        .toFile(resizedPath);
    }
  }
}

function resizeImageWithImageMagick(originalPath, resizedPath, size) {
  return spawn('convert', [
    originalPath,
    '-thumbnail',
    `${size}x${size}>`,
    resizedPath
  ]);
}

async function resizeImageWithAWSLambda(rawGCSFile, tempLargestPath, size) {
  const rawURL = await rawGCSFile.getSignedUrl({
    action: 'read',
    expires: '03-17-2025'
  });

  const qs = `url=${encodeURIComponent(rawURL)}&size=${size}`;
  const lambdaURL = `${LAMBDA_RESIZE_URL}?${qs}`;
  const lambdaRes = await fetch(lambdaURL, {
    method: 'GET',
    headers: {
      Accept: 'application/octet-stream',
      'x-api-key': LAMBDA_RESIZE_KEY
    },
    timeout: LAMBDA_RESIZE_TIMEOUT
  });

  const lambdaContentType = lambdaRes.headers.get('content-type');
  if (
    lambdaContentType &&
    lambdaContentType.indexOf('application/octet-stream') !== -1
  ) {
    const lambdaBuffer = await lambdaRes.buffer();
    return writeFile(tempLargestPath, lambdaBuffer);
  } else {
    const lambdaError = await lambdaRes.text();
    throw new Error(lambdaError);
  }
}

async function calculatePerceptualHash(imgPath) {
  const str = await sharpPhash(imgPath);
  return str.split('').map(s => parseInt(s, 10));
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

function downloadFile(gcsFile, filePath) {
  console.log(`Downloading image to ${filePath}`);
  return promiseTimeout(gcsFile.download({ destination: filePath }), 10 * 1000);
}

function uploadFile(gcsPath, filePath) {
  console.log(`Uploading ${filePath} to ${gcsPath}`);
  if (DEBUG) {
    return Promise.resolve();
  } else {
    return promiseTimeout(
      ARTIFACTS_BUCKET.upload(filePath, {
        destination: gcsPath,
        validation: 'crc32c'
      }),
      10 * 1000
    );
  }
}

async function processEvent(data, context, callback) {
  const rawGCSPath = data.name;
  const rawGCSDir = path.dirname(rawGCSPath);

  if (path.basename(rawGCSPath) !== 'raw') {
    console.log(`Ignoring non-raw image ${rawGCSPath}`);
    return null;
  }

  const eventAge = Date.now() - Date.parse(context.timestamp);
  if (eventAge > MAX_EVENT_AGE) {

    console.error(`Giving up processing image ${rawGCSPath}`);
    return null;
  }

  console.log(`Processing raw image ${rawGCSPath}`);

  const rawGCSFile = IMAGES_BUCKET.file(rawGCSPath);
  const largestGCSPath = path.join(rawGCSDir, `square${LARGEST_SIZE}`);
  const smallerGCSPaths = SMALLER_SIZES.map(s =>
    path.join(rawGCSDir, `square${s}`)
  );
  const phashGCSPath = path.join(rawGCSDir, 'phash.json');

  const tempDir = path.join(os.tmpdir(), rawGCSDir);
  const tempRawPath = path.join(tempDir, 'raw');
  const tempLargestPath = path.join(tempDir, `square${LARGEST_SIZE}.png`);
  const tempSmallerPaths = SMALLER_SIZES.map(s =>
    path.join(tempDir, `square${s}.png`)
  );
  const tempPhashImagePath = path.join(tempDir, 'phash.png');
  const tempPhashJSONPath = path.join(tempDir, 'phash.json');

  try {
    await mkdirp(tempDir);
    await downloadFile(rawGCSFile, tempRawPath);

    try {
      console.log(`Resizing largest image (${LARGEST_SIZE})`);
      await resizeImageWithSharp(tempRawPath, tempLargestPath, LARGEST_SIZE);
    } catch (err) {
      try {
        console.log(`Failing over to ImageMagick due to error: ${err.message}`);
        await resizeImageWithImageMagick(
          tempRawPath,
          tempLargestPath,
          LARGEST_SIZE
        );
      } catch (err) {
        console.log(`Failing over to AWS Lambda due to error: ${err.message}`);
        await resizeImageWithAWSLambda(
          rawGCSFile,
          tempLargestPath,
          LARGEST_SIZE
        );
      }
    }

    console.log(`Resizing smaller images (${SMALLER_SIZES.join(', ')})`);

    const resizes = [];
    for (let i = 0; i < SMALLER_SIZES.length; i++) {
      const size = SMALLER_SIZES[i];
      const resizedPath = tempSmallerPaths[i];
      resizes.push(resizeImageWithSharp(tempLargestPath, resizedPath, size));
    }

    await Promise.all(resizes);

    if (CALCULATE_PHASH) {
      console.log(`Calculating perceptual hash of ${tempPhashImagePath}`);
      await resizeImageWithSharpForPhash(tempLargestPath, tempPhashImagePath);
      const phash = await calculatePerceptualHash(tempPhashImagePath);
      await writeFile(tempPhashJSONPath, JSON.stringify(phash));
    }

    const uploads = [uploadFile(largestGCSPath, tempLargestPath)];
    for (let i = 0; i < SMALLER_SIZES.length; i++) {
      uploads.push(uploadFile(smallerGCSPaths[i], tempSmallerPaths[i]));
    }

    if (CALCULATE_PHASH) {
      uploads.push(uploadFile(phashGCSPath, tempPhashJSONPath));
    }

    await Promise.all(uploads);

    console.log(`Processing complete for ${rawGCSPath}`);
  } finally {
    try {
      console.log(`Cleaning up temp directory ${tempDir}`);

      fs.unlinkSync(tempRawPath);
      fs.unlinkSync(tempLargestPath);

      for (const p of tempSmallerPaths) {
        fs.unlinkSync(p);
      }

      if (CALCULATE_PHASH) {
        fs.unlinkSync(tempPhashImagePath);
        fs.unlinkSync(tempPhashJSONPath);
      }

      fs.rmdirSync(tempDir);
      callback();
    } catch (err) {
      console.error(err);
      callback(err);
    }
  }
}

exports.run = (data, context, callback) => {
  console.log(`Started processing event for ${data.name}`);
  return processEvent(data, context, callback);
};
