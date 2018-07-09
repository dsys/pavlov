/** @flow */

import { encodeId } from '../identifiers';

import type {
  WebsiteEntityRow,
  PersonEntityRow,
  OrganizationEntityRow
} from '../rows';

export default {
  id(websiteRow: WebsiteEntityRow): string {
    return encodeId('WEB', websiteRow.id);
  },
  display(websiteRow: WebsiteEntityRow): string {
    return websiteRow.name || websiteRow.url;
  },
  name(websiteRow: WebsiteEntityRow): ?string {
    return websiteRow.name;
  },
  url(websiteRow: WebsiteEntityRow): ?string {
    return websiteRow.url;
  },
  domain(websiteRow: WebsiteEntityRow): ?string {
    return websiteRow.domain;
  },
  type(websiteRow: WebsiteEntityRow): ?string {
    return websiteRow.type;
  },
  async relatedPeople(
    websiteRow: WebsiteEntityRow
  ): Promise<Array<PersonEntityRow>> {
    // TODO
    return [];
  },
  async relatedOrganizations(
    websiteRow: WebsiteEntityRow
  ): Promise<Array<OrganizationEntityRow>> {
    // TODO
    return [];
  }
};
