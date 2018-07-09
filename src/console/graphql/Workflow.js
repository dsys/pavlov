/** @flow */

import { DEFAULT_CLIENT as ES_CLIENT } from '../elasticsearch/client';
import { encodeId } from '../identifiers';
import { fetchWorkflowHistogram } from '../workflows/histogram';
import { getResizedImageURL } from '../images/urls';

import type { Environment } from '../workflows/environment';
import type { GraphQLContext } from './context';
import type { WorkflowRow, WorkflowSettingsRow } from '../rows';

const DEFAULT_LABELS = ['ERROR', 'PENDING'];
const HISTOGRAM_DAYS = 30;

function getPossibleLabels(workflowRow: WorkflowRow): Array<string> {
  return workflowRow.possible_labels.concat(DEFAULT_LABELS);
}

export default {
  id(workflowRow: WorkflowRow): string {
    return encodeId('WRK', workflowRow.id);
  },
  name(
    workflowRow: WorkflowRow,
    args: {},
    { loaders }: GraphQLContext
  ): string {
    return workflowRow.name;
  },
  suggestedSearchTerms(workflowRow: WorkflowRow): Array<string> {
    return getPossibleLabels(workflowRow).map(l => `label:${l}`);
  },
  possibleLabels(workflowRow: WorkflowRow): Array<string> {
    return getPossibleLabels(workflowRow);
  },
  drawerLabels(workflowRow: WorkflowRow): Array<string> {
    return workflowRow.drawer_labels;
  },
  thumbnailIcon(workflowRow: WorkflowRow): string {
    return workflowRow.icon;
  },
  async thumbnailURL(
    workflowRow: WorkflowRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?string> {
    if (!workflowRow.icon_image_id) return null;

    const imageRow = await loaders.image.load(workflowRow.icon_image_id);
    if (!imageRow) return null;
    return getResizedImageURL(imageRow.sha256, 64);
  },
  async histogramData(
    workflowRow: WorkflowRow,
    { environment }: { environment: Environment },
    { loaders, adminLoaders }: GraphQLContext
  ): Promise<Array<Object>> {
    // TODO: Support more than just the default database.
    const databaseRow = await loaders.defaultDatabase.load(0);
    if (!databaseRow) return [];
    return fetchWorkflowHistogram({
      database: databaseRow,
      workflow: workflowRow,
      environment,
      esClient: ES_CLIENT,
      days: HISTOGRAM_DAYS
    });
  },
  async settings(
    workflowRow: WorkflowRow,
    { environment }: { environment: Environment },
    { loaders }: GraphQLContext
  ): Promise<?WorkflowSettingsRow> {
    // TODO: Support more than just the default database.
    const databaseRow = await loaders.defaultDatabase.load(0);
    if (!databaseRow) return null;

    return loaders.workflowSettings.load({
      workflowId: workflowRow.id,
      databaseId: databaseRow.id,
      environment
    });
  }
};
