/** @flow */

import Storage from '@google-cloud/storage';
import log from './log';
import ms from 'ms';
import moment from 'moment';
import promiseRetry from 'promise-retry';
import { WaitError } from './errors';
import { GCP_PROJECT_ID, GCP_SIGNED_URL_EXPIRES } from './config';

const storageClient = Storage({
  projectId: GCP_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const WAIT_RETRIES = 5;
const WAIT_RETRY_FACTOR = 2;
const WAIT_RETRY_TIMEOUT = 2 * 1000;

/**
 * Downloads a file
 */
export function downloadJSONFile(bucket: string, name: string): Promise<mixed> {
  const stream = storageClient
    .bucket(bucket)
    .file(name)
    .createReadStream();

  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('error', err => reject(err));
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('finish', () => resolve(JSON.parse(chunks.join())));
  });
}

/**
 * Calculates the expires string based on a relative offset.
 */
export function getExpiresISOString(
  now: Date,
  relativeExpires: string
): string {
  const expiresMilliseconds =
    moment(now)
      .startOf('day')
      .toDate()
      .getTime() + ms(relativeExpires);
  return new Date(expiresMilliseconds).toISOString();
}

/**
 * Checks if the file exists on Google Cloud Storage.
 */
export async function fileExists(
  bucket: string,
  name: string
): Promise<boolean> {
  const file = storageClient.bucket(bucket).file(name);
  const data = await file.exists();
  return data[0];
}

/**
 * Waits for a file to become available on Google Cloud Storage.
 */
export function waitForFile(bucket: string, name: string): Promise<boolean> {
  const file = storageClient.bucket(bucket).file(name);

  return promiseRetry(
    async retry => {
      const data = await file.exists();
      const exists = data[0];
      if (exists) {
        return true;
      } else {
        return retry(new WaitError());
      }
    },
    {
      retries: WAIT_RETRIES,
      factor: WAIT_RETRY_FACTOR,
      minTimeout: WAIT_RETRY_TIMEOUT
    }
  )
    .then(() => true)
    .catch(() => {
      log.warn({ bucket, name }, 'timed out waiting for file');
      return false;
    });
}

/**
 * Generates a short-lived signed URL for the stored file.
 */
export async function generateSignedURL(
  bucket: string,
  filename: string,
  expires: string = getExpiresISOString(new Date(), GCP_SIGNED_URL_EXPIRES)
): Promise<string> {
  const file = storageClient.bucket(bucket).file(filename);
  const urls = await file.getSignedUrl({ action: 'read', expires });
  return urls[0];
}
