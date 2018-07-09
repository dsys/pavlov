/** @flow */

import canonicalPersonName from '../utils/canonicalPersonName';
import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type { PersonEntityRow, PersonNameEntityRow } from '../rows';

export default {
  id(personNameRow: PersonNameEntityRow): string {
    return encodeId('PNM', personNameRow.id);
  },
  display(personNameRow: PersonNameEntityRow): string {
    return canonicalPersonName(personNameRow);
  },
  firstName(personNameRow: PersonNameEntityRow): ?string {
    return personNameRow.first_name;
  },
  isPrimary(personNameRow: PersonNameEntityRow): ?boolean {
    return personNameRow.is_primary;
  },
  lastName(personNameRow: PersonNameEntityRow): ?string {
    return personNameRow.last_name;
  },
  middleName(personNameRow: PersonNameEntityRow): ?string {
    return personNameRow.middle_name;
  },
  person(
    personNameRow: PersonNameEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<PersonEntityRow> {
    return loaders.person.load(personNameRow.person_id);
  },
  prefix(personNameRow: PersonNameEntityRow): ?string {
    return personNameRow.prefix;
  },
  suffix(personNameRow: PersonNameEntityRow): ?string {
    return personNameRow.suffix;
  },
  title(personNameRow: PersonNameEntityRow): ?string {
    return personNameRow.title;
  }
};
