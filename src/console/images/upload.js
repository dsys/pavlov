/** @flow */

import type { ImageEntitySpec } from '../entities/specs';

import fetch from 'node-fetch';
import retry from 'async-retry';
import log from '../log';
import { ImageProcessingError } from '../errors';

/** The Google Cloud Function to send image upload requests to. */
export const IMAGE_UPLOAD_FUNCTION = __DEV__
  ? 'image-upload-dev'
  : 'image-upload';

/** The URL of the Google Cloud Function to send image upload requests to. */
export const IMAGE_UPLOAD_URL = `https://us-central1-pavlov-mono.cloudfunctions.net/${IMAGE_UPLOAD_FUNCTION}`;

/** The number of seconds to wait for an image upload response */
export const IMAGE_UPLOAD_TIMEOUT = 30 * 1000;

export const IMAGE_UPLOAD_RETRIES = 3;
export const IMAGE_UPLOAD_RETRY_FACTOR = 2;
export const IMAGE_UPLOAD_RETRY_TIMEOUT = 2 * 1000;

async function retryUpload(callToRetry) {
  return retry(callToRetry, {
    retries: IMAGE_UPLOAD_RETRIES,
    factor: IMAGE_UPLOAD_RETRY_FACTOR,
    minTimeout: IMAGE_UPLOAD_RETRY_TIMEOUT,
    onRetry: err => log.warn(err, 'retrying upload')
  });
}

/**
 * Stores a raw image buffer.
 */
export async function uploadImageBuffer(
  buffer: Buffer
): Promise<ImageEntitySpec> {
  const resBody = await retryUpload(async bail => {
    const res = await fetch(IMAGE_UPLOAD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: buffer,
      timeout: IMAGE_UPLOAD_TIMEOUT
    });
    if (!res.ok) {
      throw new ImageProcessingError(`error uploading image ${res.status}`);
    }
    const resBody = await res.json();
    if (resBody.error) {
      throw new ImageProcessingError(
        `error storing image from file upload (len: ${buffer.length}): ${resBody.error}`
      );
    }
    return resBody;
  });

  const sha256 = resBody.data.sha256;

  log.info(
    { size: buffer.length, sha256 },
    `stored image from file upload (len: ${buffer.length}, sha256: ${sha256})`
  );

  return resBody.data;
}

/**
 * Fetches and store the image from a URL.
 */
export async function uploadImageURL(url: string): Promise<ImageEntitySpec> {
  const resBody = await retryUpload(async bail => {
    const res = await fetch(IMAGE_UPLOAD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      timeout: IMAGE_UPLOAD_TIMEOUT
    });
    if (!res.ok) {
      throw new ImageProcessingError(`error uploading image ${res.status}`);
    }
    const resBody = await res.json();
    if (resBody.error) {
      log.info(
        { url, err: resBody.error },
        `error storing image from ${url}: ${resBody.error}`
      );
      throw new ImageProcessingError(resBody.error);
    }
    return resBody;
  });

  const { sha256, contentLength } = resBody.data;

  log.info(
    { url, sha256, contentLength },
    `stored image from ${url} (len: ${contentLength}, sha256: ${sha256})`
  );

  return resBody.data;
}
