/** @flow */

import type { ExternalTaskRow, ImageEntityRow } from '../rows';
import type { GraphQLContext } from './context';

import { HTTPS_BASE_URL } from '../config';
import { signExternalTaskAuthToken } from '../auth';
import { createExternalTaskAuthToken } from '../workflows';
import { encodeId } from '../identifiers';
import { imageSearch } from '../external/google-search';

export default {
  id(externalTaskRow: ExternalTaskRow): string {
    return encodeId('EXT', externalTaskRow.id);
  },
  async instructions(
    externalTaskRow: ExternalTaskRow,
    args: {},
    { adminLoaders }: GraphQLContext
  ): Promise<string> {
    const externalTaskTypeRow = await adminLoaders.externalTaskType.load(
      externalTaskRow.type_id
    );
    return externalTaskTypeRow ? externalTaskTypeRow.instructions : '';
  },
  async exampleGroups(
    externalTaskRow: ExternalTaskRow,
    args: {},
    { adminLoaders }: GraphQLContext
  ): Promise<Array<{ name: string, markdown: string }>> {
    const externalTaskTypeRow = await adminLoaders.externalTaskType.load(
      externalTaskRow.type_id
    );
    return externalTaskTypeRow ? externalTaskTypeRow.example_groups : [];
  },
  async type(
    externalTaskRow: ExternalTaskRow,
    args: {},
    { adminLoaders }: GraphQLContext
  ): Promise<string> {
    const externalTaskTypeRow = await adminLoaders.externalTaskType.load(
      externalTaskRow.type_id
    );
    return externalTaskTypeRow ? externalTaskTypeRow.title : null;
  },
  async decisionLabels(
    externalTaskRow: ExternalTaskRow,
    args: {},
    { adminLoaders }: GraphQLContext
  ): Promise<Array<string>> {
    const externalTaskTypeRow = await adminLoaders.externalTaskType.load(
      externalTaskRow.type_id
    );
    return externalTaskTypeRow ? externalTaskTypeRow.decision_labels : [];
  },
  async image(
    externalTaskRow: ExternalTaskRow,
    args: {},
    { adminLoaders }: GraphQLContext
  ): Promise<?ImageEntityRow> {
    const targetRow = await adminLoaders.target.load(externalTaskRow.target_id);
    if (!targetRow || !targetRow.image_id) return null;
    return adminLoaders.image.load(targetRow.image_id);
  },
  async googleSimilarImages(
    externalTaskRow: ExternalTaskRow,
    args: {},
    { adminLoaders }: GraphQLContext
  ): Promise<Array<string>> {
    const targetRow = await adminLoaders.target.load(externalTaskRow.target_id);
    if (
      !targetRow ||
      (!targetRow.state.gcvTag && !targetRow.state.moderationTag)
    )
      return [];
    const searchTerm = targetRow.state.gcvTag
      ? targetRow.state.gcvTag.label
      : targetRow.state.moderationTag.label;
    return imageSearch(searchTerm);
  },
  async taskURL(
    externalTaskRow: ExternalTaskRow,
    args: {},
    { adminLoaders }: GraphQLContext
  ): Promise<?string> {
    let externalTaskAuthToken = await adminLoaders.externalTaskAuthTokenByExternalTask.load(
      externalTaskRow.id
    );
    if (!externalTaskAuthToken) {
      externalTaskAuthToken = await createExternalTaskAuthToken(
        adminLoaders,
        externalTaskRow
      );
    }
    const signedAuthToken = await signExternalTaskAuthToken(
      externalTaskAuthToken
    );
    return `${HTTPS_BASE_URL}/ext/mturk/${externalTaskRow.id}?authToken=${signedAuthToken}`;
  }
};
