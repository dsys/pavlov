/** @flow */

import type { LocationEntityRow } from '../rows';

/** Returns the human-readable version of the location. */
export function getLocationDisplay(location: LocationEntityRow): string {
  const parts = [];
  if (location.name) parts.push(location.name);
  if (location.street_address) parts.push(location.street_address);
  if (location.locality) parts.push(location.locality);
  if (location.state) parts.push(location.state);
  if (location.region) parts.push(location.region);
  if (location.country) parts.push(location.country);
  if (parts.length === 0) parts.push(location.continent);
  return parts.join(', ');
}
