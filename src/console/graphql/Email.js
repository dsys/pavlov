/** @flow */

import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type {
  EmailEntityRow,
  OrganizationEntityRow,
  PersonEntityRow,
  ProductEntityRow
} from '../rows';

export default {
  id(emailRow: EmailEntityRow): string {
    return encodeId('EML', emailRow.id);
  },
  display(emailRow: EmailEntityRow): string {
    return emailRow.address;
  },
  address(emailRow: EmailEntityRow): string {
    return emailRow.address;
  },
  domain(emailRow: EmailEntityRow): ?string {
    return emailRow.domain;
  },
  async emailProvider(emailRow: EmailEntityRow): Promise<?ProductEntityRow> {
    // TODO
    return null;
  },
  isPrimary(emailRow: EmailEntityRow): ?boolean {
    return emailRow.is_primary;
  },
  type(emailRow: EmailEntityRow): ?string {
    return emailRow.type;
  },
  relatedPeople(
    emailRow: EmailEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<PersonEntityRow>> {
    return loaders.peopleByEmail.load(emailRow.id);
  },
  async relatedOrganizations(
    emailRow: EmailEntityRow
  ): Promise<Array<OrganizationEntityRow>> {
    // TODO
    return [];
  }
};
