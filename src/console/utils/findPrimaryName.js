/** @flow */

import _ from 'lodash';

import type { PersonNameEntityRow } from '../rows';

export default function findPrimaryName(
  names: Array<PersonNameEntityRow>
): ?PersonNameEntityRow {
  const primaryName = _.find(names, pn => pn.is_primary);
  if (primaryName) {
    return primaryName;
  } else if (names.length > 0) {
    return names[0];
  } else {
    return null;
  }
}
