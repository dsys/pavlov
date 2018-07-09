/** @flow */

import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type {
  EmailEntityRow,
  ImageEntityRow,
  IndustryEntityRow,
  LocationEntityRow,
  OrganizationEntityRow,
  PersonEntityRow,
  PhoneNumberEntityRow,
  SocialProfileEntityRow,
  WebsiteEntityRow
} from '../rows';

export default {
  id(organizationRow: OrganizationEntityRow): string {
    return encodeId('ORG', organizationRow.id);
  },
  display(organizationRow: OrganizationEntityRow): string {
    return organizationRow.name;
  },
  name(organizationRow: OrganizationEntityRow): string {
    return organizationRow.name;
  },
  DBAs(organizationRow: OrganizationEntityRow): Array<string> {
    return organizationRow.dbas;
  },
  alexaGlobalRank(organizationRow: OrganizationEntityRow): ?number {
    return organizationRow.alexa_global_rank;
  },
  alexaUSRank(organizationRow: OrganizationEntityRow): ?number {
    return organizationRow.alexa_us_rank;
  },
  description(organizationRow: OrganizationEntityRow): ?string {
    return organizationRow.description;
  },
  employeeCount(organizationRow: OrganizationEntityRow): ?string {
    return organizationRow.employee_count;
  },
  foundingDate(organizationRow: OrganizationEntityRow): ?Date {
    return organizationRow.founding_date;
  },
  legalName(organizationRow: OrganizationEntityRow): ?string {
    return organizationRow.legal_name;
  },
  marketCap(organizationRow: OrganizationEntityRow): ?number {
    return organizationRow.market_cap;
  },
  raised(organizationRow: OrganizationEntityRow): ?number {
    return organizationRow.raised;
  },
  emails(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<EmailEntityRow>> {
    return loaders.emailsByOrganizationId.load(organizationRow.id);
  },
  images(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<ImageEntityRow>> {
    return loaders.imagesByOrganizationId.load(organizationRow.id);
  },
  socialProfiles(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<SocialProfileEntityRow>> {
    return loaders.socialProfilesByOrganizationId.load(organizationRow.id);
  },
  websites(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<WebsiteEntityRow>> {
    return loaders.websitesByOrganizationId.load(organizationRow.id);
  },
  locations(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<LocationEntityRow>> {
    return loaders.locationsByOrganizationId.load(organizationRow.id);
  },
  industries(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<IndustryEntityRow>> {
    return loaders.industriesByOrganizationId.load(organizationRow.id);
  },
  phoneNumbers(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<PhoneNumberEntityRow>> {
    return loaders.phoneNumbersByOrganizationId.load(organizationRow.id);
  },
  async relatedPeople(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<PersonEntityRow>> {
    // TODO: Implement me!
    return [];
  },
  async relatedOrganizations(
    organizationRow: OrganizationEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<OrganizationEntityRow>> {
    // TODO: Implement me!
    return [];
  }
};
