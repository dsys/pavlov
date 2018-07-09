/** @flow */

import { GCP_IMAGES_BUCKET, GCP_IMAGE_ARTIFACTS_BUCKET } from '../config';
import { generateSignedURL, waitForFile } from '../storage';

/**
 * Returns a URL for the raw version of an image.
 */
export function getRawImageURL(sha256: string): Promise<string> {
  return generateSignedURL(GCP_IMAGES_BUCKET, `${sha256}/raw`);
}

/**
 * Returns a URL for the resized version of an image.
 */
export async function getResizedImageURL(
  sha256: string,
  size: number
): Promise<string> {
  const name = `${sha256}/square${size}`;
  return generateSignedURL(GCP_IMAGE_ARTIFACTS_BUCKET, name);
}

/**
 * Waits for an image to be processed and returns the URL for a resized version of it.
 */
export async function waitForResizedImageURL(
  sha256: string,
  size: number
): Promise<string> {
  const name = `${sha256}/square${size}`;
  const fileFound = await waitForFile(GCP_IMAGE_ARTIFACTS_BUCKET, name);
  if (!fileFound) {
    throw new Error(`Image file not found: ${name}`);
  }
  return generateSignedURL(GCP_IMAGE_ARTIFACTS_BUCKET, name);
}
