/** @flow */

import type { DatabaseRow, ImageEntityRow } from '../rows';
import type { Loaders } from '../loaders';

import _ from 'lodash';
import fetch from 'node-fetch';
import log from '../log';
import { GCP_IMAGE_ARTIFACTS_BUCKET } from '../config';
import { encodeId } from '../identifiers';
import { waitForFile, downloadJSONFile } from '../storage';

/**
 * A similar image to a reference image.
*/
export type SimilarImage = {
  image: ImageEntityRow,
  similarity: number
};

/**
 * The number of bits in the perceptual hash.
 */
const PHASH_LENGTH = 64;

/**
 * The URL of the fast-hamm service in which perceptual hashes are stored.
 */
const FAST_HAMM_URL = process.env.FAST_HAMM_URL || 'http://fast-hamm:5000';

/**
 * The maximum distance to return for similar images.
 */
const MAX_PHASH_DISTANCE = 5;

/**
 * Fetches an image's perceptual hash from storage and normalizes, or returns null if it cannot be fetched.
 */
export async function fetchImagePhash(
  imageRow: ImageEntityRow
): Promise<?string> {
  const imageId = encodeId('IMG', imageRow.id);
  const phashFilename = `${imageRow.sha256}/phash.json`;
  const exists = await waitForFile(GCP_IMAGE_ARTIFACTS_BUCKET, phashFilename);
  if (!exists) {
    log.error({ imageId }, 'could not fetch perceptual hash');
    return null;
  }

  const storedPhash = await downloadJSONFile(
    GCP_IMAGE_ARTIFACTS_BUCKET,
    phashFilename
  );

  if (
    !Array.isArray(storedPhash) ||
    storedPhash.length !== PHASH_LENGTH ||
    !_.every(storedPhash, x => x === 0 || x === 1)
  ) {
    log.error({ imageId, storedPhash }, 'invalid perceptual hash');
    return null;
  }

  return storedPhash.join('');
}

/**
 * Puts an image's phash vector in the fast-hamm index.
 */
export async function putImagePhashVector(
  index: string,
  key: string,
  vec: string
) {
  const url = `${FAST_HAMM_URL}/${index}/${key}`;
  const body = JSON.stringify({ vec });
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body
  });
  const resBody = await res.json();

  log.info({ index, key }, `put image phash in ${index}/${key}`);

  return resBody.data;
}

export async function deleteImagePhashVector(
  index: string,
  key: string,
  vec: string
) {
  const url = `${FAST_HAMM_URL}/${index}/${key}`;
  const body = JSON.stringify({ vec });
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body
  });
  const resBody = await res.json();

  log.info({ index, key }, `deleted image phash in ${index}/${key}`);

  return resBody.data;
}

/**
 * Puts an image's perceptual in a database index for later searching.
 */
export async function addPhashToIndex(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  imageRow: ImageEntityRow
): Promise<?string> {
  try {
    const databaseId = encodeId('DBX', databaseRow);
    const index = databaseId;
    const key = encodeId('IMG', imageRow);

    const normalizedPhash = await fetchImagePhash(imageRow);
    if (!normalizedPhash) return null;

    await putImagePhashVector(index, key, normalizedPhash);

    return normalizedPhash;
  } catch (err) {
    log.error(err);
    return null;
  }
}

/**
 * Puts an image's perceptual in a database index for later searching.
 */
export async function addLabeledPhashToIndex(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  imageRow: ImageEntityRow,
  label: string
): Promise<?string> {
  try {
    const databaseId = encodeId('DBX', databaseRow);
    const index = `${databaseId}_${label}`;
    const key = encodeId('IMG', imageRow);

    const normalizedPhash = await fetchImagePhash(imageRow);
    if (!normalizedPhash) return null;

    await putImagePhashVector(index, key, normalizedPhash);

    return normalizedPhash;
  } catch (err) {
    log.error(err);
    return null;
  }
}

export async function removeLabeledPhashFromIndex(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  imageRow: ImageEntityRow,
  label: string
): Promise<?string> {
  try {
    const databaseId = encodeId('DBX', databaseRow);
    const index = `${databaseId}_${label}`;
    const key = encodeId('IMG', imageRow);

    const normalizedPhash = await fetchImagePhash(imageRow);
    if (!normalizedPhash) return null;

    await deleteImagePhashVector(index, key, normalizedPhash);

    return normalizedPhash;
  } catch (err) {
    log.error(err);
    return null;
  }
}

/**
 * Searches for a similar looking images to the provided image.
 */
export async function searchSimilarImages(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  imageRow: ImageEntityRow,
  searchLabel: string
): Promise<Array<SimilarImage>> {
  const normalizedPhash = await fetchImagePhash(imageRow);
  if (!normalizedPhash) return [];

  const databaseId = encodeId('DBX', databaseRow);
  const imageId = encodeId('IMG', imageRow);
  const body = JSON.stringify({
    vec: normalizedPhash,
    max: MAX_PHASH_DISTANCE
  });

  let index = databaseId;
  if (searchLabel) {
    index = `${databaseId}_${searchLabel}`;
  }

  log.info(
    `Image Search in index ${index} for key ${normalizedPhash} with distance of ${MAX_PHASH_DISTANCE}`
  );

  const res = await fetch(`${FAST_HAMM_URL}/${index}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });

  const resBody = await res.json();
  const similarImageIds = resBody.data
    .map(s => s.key)
    .filter(k => k !== imageId);
  const similarImageRows = await loaders.image.loadMany(similarImageIds);

  return resBody.data
    .map((s, i) => ({
      image: similarImageRows[i],
      similarity: 1 - s.dist / MAX_PHASH_DISTANCE
    }))
    .filter(s => s.image);
}
