/**
 * Module that contains functions related to ElasticSearch clients.
 *
 * @flow
 */

import elasticsearch from 'elasticsearch';

export type ElasticSearchClient = any;

export const DEFAULT_CLIENT = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_URL || 'elasticsearch:9200'
});
