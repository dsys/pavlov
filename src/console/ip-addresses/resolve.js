/** @flow */

import type { IPAddressEntityRow } from '../rows';
import type { Loaders } from '../loaders';

import { adminPG } from '../db/postgres';
import { enrichIP } from '../entities/enrich';
import { insertIPAddressEntity } from '../entities/insert';

/** Fields with which IP addresses can be resolved. */
export type IPAddressLookupFields = {
  id: string,
  address: string
};

/** Resolves an IP address to an IP address node. */
export async function resolveIPAddress(
  loaders: Loaders,
  { id, address }: IPAddressLookupFields
): Promise<?IPAddressEntityRow> {
  let ipAddress = null;
  if (id) {
    ipAddress = await loaders.ipAddress.load(id);
  } else if (address) {
    ipAddress = await loaders.ipAddressByAddress.load(address);
  }

  if (!ipAddress && address) {
    const spec = await enrichIP(address);
    if (spec) {
      ipAddress = await insertIPAddressEntity(adminPG, spec);
    }
  }

  return ipAddress;
}
