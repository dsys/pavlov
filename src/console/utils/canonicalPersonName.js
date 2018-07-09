/** @flow */

import _ from 'lodash';

import type { PersonNameEntityRow } from '../rows';

export default function canonicalPersonName(
  personNameRow: PersonNameEntityRow
): string {
  return _.compact([
    personNameRow.prefix,
    personNameRow.title,
    personNameRow.first_name,
    personNameRow.middle_name,
    personNameRow.last_name,
    personNameRow.suffix
  ]).join(' ');
}
