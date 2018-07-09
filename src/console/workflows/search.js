/**
 * Module for searching targets.
 *
 * Our search back-end is powered by ElasticSearch.
 *
 * @flow
 */

import type { ElasticSearchClient } from '../elasticsearch/client';
import type { Identifiable } from '../identifiers';
import type { Loaders } from '../loaders';
import type { TargetRow } from '../rows';

import { encodeId } from '../identifiers';
import _ from 'lodash';

/**
 * A search query for targets.
 */
export type TargetSearchQuery = {
  limit: number,
  offset: string,
  database: Identifiable,
  workflow: Identifiable,
  environment: string,
  ids: Array<string>,
  labels: Array<string>,
  aliases: Array<string>
};

/**
 * A list of results from a target search. Contains a cursor for pagination.
 */
export type TargetSearchPage = {
  cursor: ?string,
  hasNextPage: boolean,
  items: Array<TargetRow>
};

/**
 * A target doc stored in ElasticSearch.
 */
export type TargetDoc = {
  database: string,
  workflow: string,
  environment: string,
  keys: Array<string>,
  label: string,
  score: ?number,
  reasons: Array<string>,
  aliases: Array<string>,
  created_at: Date,
  updated_at: Date
};

/**
 * Regular expression for parsing search terms.
 */
const SEARCH_TERM_REGEX = /^([a-z]+):(.+)$/;

/**
 * The ElasticSearch doc type of targets.
 */
const TARGETS_INDEX = 'targets';

/**
 * The ElasticSearch doc type of targets.
 */
const TARGET_DOC_TYPE = 'target';

/**
 * Parses a list of search terms into a target query.
 */
export function createTargetSearchQuery(
  limit: number,
  offset: string,
  database: Identifiable,
  workflow: Identifiable,
  environment: string,
  searchTerms: Array<string>
): TargetSearchQuery {
  const ids = [];
  const labels = [];
  const aliases = [];

  for (const st of searchTerms) {
    const match = st.match(SEARCH_TERM_REGEX);

    if (!match) {
      continue;
    }

    switch (match[1]) {
      case 'label':
        labels.push(match[2]);
        break;
      case 'id':
        ids.push(match[2]);
        break;
      case 'alias':
        aliases.push(match[2]);
        break;
      default:
      // ignore
    }
  }

  return {
    limit,
    offset,
    database,
    workflow,
    environment,
    ids,
    labels,
    aliases
  };
}

/**
 * Searches for targets which match a query.
 */
export async function searchTargets(
  loaders: Loaders,
  esClient: ElasticSearchClient,
  query: TargetSearchQuery
): Promise<TargetSearchPage> {
  const filter = [
    {
      term: {
        database: encodeId('DBX', query.database)
      }
    },
    { term: { workflow: encodeId('WRK', query.workflow) } },
    { term: { environment: query.environment } }
  ];

  if (query.ids.length > 0) {
    filter.push({ ids: { values: query.ids } });
  }

  if (query.labels.length > 0) {
    filter.push({ terms: { label: query.labels } });
  }

  if (query.aliases.length > 0) {
    filter.push({ terms: { aliases: query.aliases } });
  }

  const body: Object = {
    query: {
      bool: {
        filter
      }
    }
  };

  if (query.offset) {
    const s = parseInt(query.offset, 10);
    if (Number.isFinite(s)) body.search_after = [s];
  }

  const results = await esClient.search({
    index: TARGETS_INDEX,
    size: query.limit + 1,
    sort: 'updated_at:desc',
    body
  });

  const resultDocs = results.hits.hits;
  const pageDocs = resultDocs.slice(0, query.limit);
  const hasNextPage = resultDocs.length > pageDocs.length;
  const items = _.compact(
    await loaders.target.loadMany(pageDocs.map(d => d._id))
  );
  if (items.length === 0) {
    return { items: [], hasNextPage: false, cursor: null };
  }

  const nextCursor = pageDocs[pageDocs.length - 1].sort[0].toString();

  return {
    items,
    hasNextPage,
    cursor: nextCursor
  };
}

/**
 * Adds an array of target rows to the ElasticSearch index.
 */
export async function putTargets(
  esClient: ElasticSearchClient,
  targetRows: Array<TargetRow>
): Promise<*> {
  const body = [];
  for (const targetRow of targetRows) {
    body.push({
      index: {
        _index: TARGETS_INDEX,
        _type: TARGET_DOC_TYPE,
        _id: encodeId('TRG', targetRow.id)
      }
    });

    body.push({
      database: encodeId('DBX', targetRow.database_id),
      workflow: encodeId('WRK', targetRow.workflow_id),
      environment: targetRow.environment,
      keys: Object.keys(targetRow.key),
      label: targetRow.label,
      score: targetRow.score,
      reasons: targetRow.reasons,
      aliases: targetRow.aliases || [],
      created_at: targetRow.created_at.toISOString(),
      updated_at: targetRow.updated_at.toISOString()
    });
  }

  await esClient.bulk({
    body
  });

  return;
}
