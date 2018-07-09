/** @flow */

import DataLoader from 'dataloader';

import type { QueryContext, QueryFile } from '../db/context';

export default function createManyOrNoneLoader<Input, Output>(
  queryContext: QueryContext,
  queryFile: QueryFile
): DataLoader<Input, Array<Output>> {
  return new DataLoader(inputs => {
    try {
      return Promise.all(
        inputs.map(input => queryContext.manyOrNone(queryFile, input))
      );
    } catch (err) {
      return Promise.reject(err);
    }
  });
}
