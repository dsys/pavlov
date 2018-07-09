/** @flow */

import type {
  LocationEntityRow,
  PersonEntityRow,
  OrganizationEntityRow
} from '../rows';

import { encodeId } from '../identifiers';
import { getLocationDisplay } from '../locations/display';

export default {
  id(locationRow: LocationEntityRow): string {
    return encodeId('LOC', locationRow.id);
  },
  display(locationRow: LocationEntityRow): string {
    return getLocationDisplay(locationRow);
  },
  name(locationRow: LocationEntityRow): ?string {
    return locationRow.name;
  },
  continent(locationRow: LocationEntityRow): ?string {
    return locationRow.continent;
  },
  country(locationRow: LocationEntityRow): ?string {
    return locationRow.country;
  },
  isPrimary(locationRow: LocationEntityRow): ?boolean {
    return locationRow.is_primary;
  },
  latitude(locationRow: LocationEntityRow): ?string {
    return locationRow.latitude;
  },
  longitude(locationRow: LocationEntityRow): ?string {
    return locationRow.longitude;
  },
  poBox(locationRow: LocationEntityRow): ?string {
    return locationRow.po_box;
  },
  postalCode(locationRow: LocationEntityRow): ?string {
    return locationRow.postal_code;
  },
  region(locationRow: LocationEntityRow): ?string {
    return locationRow.region;
  },
  state(locationRow: LocationEntityRow): ?string {
    return locationRow.state;
  },
  streetAddress(locationRow: LocationEntityRow): ?string {
    return locationRow.street_address;
  },
  timezone(locationRow: LocationEntityRow): ?string {
    return locationRow.timezone;
  },
  type(locationRow: LocationEntityRow): ?string {
    return locationRow.type;
  },
  async relatedPeople(
    locationRow: LocationEntityRow
  ): Promise<Array<PersonEntityRow>> {
    // TODO
    return [];
  },
  async relatedOrganizations(
    locationRow: LocationEntityRow
  ): Promise<Array<OrganizationEntityRow>> {
    // TODO
    return [];
  }
};
