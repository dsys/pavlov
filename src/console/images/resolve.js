/** @flow **/

import type { DatabaseRow, ImageEntityRow } from '../rows';
import type { Loaders } from '../loaders';
import type { UploadedFile } from '../router/upload';

import { adminPG } from '../db/postgres';
import { decodeIdOfType } from '../identifiers';
import { addPhashToIndex } from './phash.js';
import { insertImageEntity } from '../entities/insert';
import { uploadImageBuffer, uploadImageURL } from './upload';

/**
 * The fields by which an image can be resolved.
 */
export type ImageLookupFields = {
  id?: string,
  sha256?: string,
  file?: string,
  url?: string
};

/**
 * Resolves an image entity given lookup fields.
 */
export async function resolveImage(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  lookupFields: ImageLookupFields,
  uploadedFiles: Array<UploadedFile>
): Promise<?ImageEntityRow> {
  let imageEntitySpec = null;

  if (lookupFields.id) {
    const imageUUID = decodeIdOfType('IMG', lookupFields.id);
    return loaders.image.load(imageUUID);
  } else if (lookupFields.sha256) {
    return loaders.imageBySha256.load(lookupFields.sha256);
  } else if (lookupFields.url) {
    imageEntitySpec = await uploadImageURL(lookupFields.url);
  } else if (lookupFields.file) {
    const file = uploadedFiles.find(f => f.fieldname === lookupFields.file);
    if (!file) return null;
    imageEntitySpec = await uploadImageBuffer(file.buffer);
  } else {
    return null;
  }

  const imageRow = await insertImageEntity(adminPG, imageEntitySpec);
  if (!imageRow) return null;

  addPhashToIndex(loaders, databaseRow, imageRow);

  return imageRow;
}
