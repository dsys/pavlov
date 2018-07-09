/** @flow */

import DataLoader from 'dataloader';

import type { QueryContext, QueryFile } from '../db/context';

export default function createOneOrNoneLoader<Input, Output>(
  queryContext: QueryContext,
  queryFile: QueryFile
): DataLoader<Input, ?Output> {
  return new DataLoader(inputs => {
    try {
      return Promise.all(
        inputs.map(input => queryContext.oneOrNone(queryFile, input))
      );
    } catch (err) {
      return Promise.reject(err);
    }
  });
}
