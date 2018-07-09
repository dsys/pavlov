/** @flow */

import { encodeId } from '../identifiers';

import type {
  PhoneNumberEntityRow,
  PersonEntityRow,
  OrganizationEntityRow
} from '../rows';

export default {
  id(phoneNumberRow: PhoneNumberEntityRow): string {
    return encodeId('PHN', phoneNumberRow.id);
  },
  display(phoneNumberRow: PhoneNumberEntityRow): string {
    return phoneNumberRow.number;
  },
  areaCode(phoneNumberRow: PhoneNumberEntityRow): ?string {
    return phoneNumberRow.area_code;
  },
  countryCode(phoneNumberRow: PhoneNumberEntityRow): ?string {
    return phoneNumberRow.country_code;
  },
  extension(phoneNumberRow: PhoneNumberEntityRow): ?string {
    return phoneNumberRow.extension;
  },
  number(phoneNumberRow: PhoneNumberEntityRow): ?string {
    return phoneNumberRow.number;
  },
  type(phoneNumberRow: PhoneNumberEntityRow): ?string {
    return phoneNumberRow.type;
  },
  async relatedPeople(
    phoneNumberRow: PhoneNumberEntityRow
  ): Promise<Array<PersonEntityRow>> {
    // TODO
    return [];
  },
  async relatedOrganizations(
    phoneNumberRow: PhoneNumberEntityRow
  ): Promise<Array<OrganizationEntityRow>> {
    // TODO
    return [];
  }
};
