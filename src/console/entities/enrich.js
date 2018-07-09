/** @flow */

import * as pipl from './pipl';
import * as talentiq from './talentiq';
import * as maxmind from './maxmind';
import { mergePersonEntitySpecs } from './merge';

import type { PersonEntitySpec, IPAddressEntitySpec } from './specs';

/**
 * Performs enrichment on an email address.
 *
 * Right now, our vendors include:
 *
 * - People Data Labs (formerly TalentIQ)
 * - Pipl
 *
 * @param ipAddress the IP address to search by
 * @returns the updated 
 */
export async function enrichEmail(email: string): Promise<?PersonEntitySpec> {
  const talentiqEntitySpec = await talentiq.enrichEmail(email);
  const piplEntitySpec = await pipl.enrichEmail(email);

  if (talentiqEntitySpec && piplEntitySpec) {
    return mergePersonEntitySpecs(talentiqEntitySpec, piplEntitySpec);
  } else if (talentiqEntitySpec) {
    return talentiqEntitySpec;
  } else if (piplEntitySpec) {
    return piplEntitySpec;
  } else {
    return null;
  }
}

/**
 * Performs enrichment on an IP address.
 *
 * Right now, our only vendor is Maxmind, but more may be added in the future.
 *
 * @param ipAddress the IP address to search by
 * @returns the updated 
 */
export function enrichIP(ipAddress: string): Promise<?IPAddressEntitySpec> {
  return maxmind.enrichIP(ipAddress);
}
