/** @flow */

import type { ElasticSearchClient } from '../elasticsearch/client';
import type { Identifiable } from '../identifiers';
import type { Environment } from './environment';

import moment from 'moment';
import { encodeId } from '../identifiers';

export async function fetchWorkflowHistogram({
  database,
  workflow,
  environment,
  esClient,
  days
}: {
  database: Identifiable,
  workflow: Identifiable,
  environment: Environment,
  esClient: ElasticSearchClient,
  days: number
}) {
  const max = moment().startOf('day');
  const min = max.clone().subtract(days, 'days');

  const maxStr = max.toISOString();
  const minStr = min.toISOString();

  const filter = [
    {
      term: {
        database: encodeId('DBX', database)
      }
    },
    { term: { workflow: encodeId('WRK', workflow) } },
    {
      term: {
        environment
      }
    },
    {
      range: {
        updated_at: {
          gte: minStr
        }
      }
    }
  ];

  const results = await esClient.search({
    index: 'targets',
    type: 'target',
    size: 0,
    body: {
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        histogram: {
          date_histogram: {
            field: 'updated_at',
            interval: 'day',
            extended_bounds: {
              min: minStr,
              max: maxStr
            }
          },
          aggs: {
            by_type: {
              terms: {
                field: 'label'
              }
            }
          }
        }
      }
    }
  });

  return results.aggregations.histogram.buckets.map(b => {
    const d: Object = { time: new Date(b.key_as_string) };
    for (const l of b.by_type.buckets) {
      d[l.key] = l.doc_count;
    }
    return d;
  });
}
