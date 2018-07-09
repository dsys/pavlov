/** @flow */

import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type {
  IPAddressEntityRow,
  LocationEntityRow,
  OrganizationEntityRow,
  WebsiteEntityRow
} from '../rows';

export default {
  id(ipAddressRow: IPAddressEntityRow): string {
    return encodeId('IPA', ipAddressRow.id);
  },
  display(ipAddressRow: IPAddressEntityRow): string {
    return ipAddressRow.ip_address;
  },
  address(ipAddressRow: IPAddressEntityRow): string {
    return ipAddressRow.ip_address;
  },
  websites(
    ipAddressRow: IPAddressEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<WebsiteEntityRow>> {
    return ipAddressRow.website_id
      ? loaders.website.loadMany([ipAddressRow.website_id])
      : Promise.resolve([]);
  },
  location(
    ipAddressRow: IPAddressEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?LocationEntityRow> {
    return ipAddressRow.location_id
      ? loaders.location.load(ipAddressRow.location_id)
      : Promise.resolve(null);
  },
  isp(
    ipAddressRow: IPAddressEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?OrganizationEntityRow> {
    return ipAddressRow.isp_id
      ? loaders.organization.load(ipAddressRow.isp_id)
      : Promise.resolve(null);
  }
};
