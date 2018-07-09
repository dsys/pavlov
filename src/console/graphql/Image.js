/** @flow */

import type { SimilarImage } from '../images/phash';
import type { ImageEntityRow, TargetRow } from '../rows';
import type { GraphQLContext } from './context';

import { encodeId, decodeIdOfType } from '../identifiers';
import { getRawImageURL, waitForResizedImageURL } from '../images/urls';
import { searchSimilarImages } from '../images/phash';

export default {
  id(imageRow: ImageEntityRow): string {
    return encodeId('IMG', imageRow.id);
  },
  display(imageRow: ImageEntityRow): string {
    return `${imageRow.content_type} (${imageRow.content_length} bytes)`;
  },
  contentLength(imageRow: ImageEntityRow): number {
    return imageRow.content_length;
  },
  contentType(imageRow: ImageEntityRow): string {
    return imageRow.content_type;
  },
  sha256(imageRow: ImageEntityRow): string {
    return imageRow.sha256;
  },
  width(imageRow: ImageEntityRow): number {
    return imageRow.width;
  },
  height(imageRow: ImageEntityRow): number {
    return imageRow.height;
  },
  rawURL(imageRow: ImageEntityRow): Promise<string> {
    return getRawImageURL(imageRow.sha256);
  },
  square512URL(imageRow: ImageEntityRow): Promise<string> {
    return waitForResizedImageURL(imageRow.sha256, 512);
  },
  square64URL(imageRow: ImageEntityRow): Promise<string> {
    return waitForResizedImageURL(imageRow.sha256, 64);
  },
  async similarImages(
    imageRow: ImageEntityRow,
    { databaseId }: { databaseId?: ?string },
    { loaders }: GraphQLContext
  ): Promise<Array<SimilarImage>> {
    let databaseRow = null;
    if (databaseId) {
      const databaseUUID = decodeIdOfType('DBX', databaseId);
      databaseRow = await loaders.database.load(databaseUUID);
    } else {
      databaseRow = await loaders.defaultDatabase.load(0);
    }

    if (!databaseRow) return [];

    return searchSimilarImages(loaders, databaseRow, imageRow);
  },
  async similarImagesWithLabel(
    imageRow: ImageEntityRow,
    { databaseId, label }: { databaseId?: ?string, label: string },
    { loaders }: GraphQLContext
  ): Promise<Array<SimilarImage>> {
    let databaseRow = null;
    if (databaseId) {
      const databaseUUID = decodeIdOfType('DBX', databaseId);
      databaseRow = await loaders.database.load(databaseUUID);
    } else {
      databaseRow = await loaders.defaultDatabase.load(0);
    }

    if (!databaseRow) return [];

    if (!label) throw new Error();

    return searchSimilarImages(loaders, databaseRow, imageRow, label);
  },
  async targets(
    imageRow: ImageEntityRow,
    {
      databaseId,
      workflowId,
      environment
    }: { databaseId: ?string, workflowId: string, environment: string },
    { loaders }: GraphQLContext
  ): Promise<Array<TargetRow>> {
    let databaseRow = null;
    if (databaseId) {
      const databaseUUID = decodeIdOfType('DBX', databaseId);
      databaseRow = await loaders.database.load(databaseUUID);
    } else {
      databaseRow = await loaders.defaultDatabase.load(0);
    }

    if (!databaseRow) return [];

    const workflowUUID = decodeIdOfType('WRK', workflowId);

    return loaders.targetsByImage.load({
      databaseId: databaseRow.id,
      workflowId: workflowUUID,
      environment,
      imageId: imageRow.id
    });
  }
};
