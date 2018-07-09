/** @flow */

import { decodeIdOfType } from './identifiers';

import type { Loaders } from './loaders';
import type { DatabaseRow } from './rows';

export type DatabaseLookupFields = {
  id: ?string
};

/**
 * Resolves a database.
 */
export async function resolveDatabase(
  loaders: Loaders,
  lookupFields: ?DatabaseLookupFields
): Promise<?DatabaseRow> {
  if (lookupFields) {
    if (lookupFields.id) {
      const databaseUUID = decodeIdOfType('DBX', lookupFields.id);
      return loaders.database.load(databaseUUID);
    } else {
      return null;
    }
  } else {
    return loaders.defaultDatabase.load(0);
  }
}
