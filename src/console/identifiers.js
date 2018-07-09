/** @flow */

import removeDashes from './utils/removeDashes';
import base62 from './utils/base62';
import { InvalidIdentifierError } from './errors';

export const UUID_REGEX = /^[a-fA-F0-9]+$/;
export const TYPES = {
  ACT: 'Actor',
  ATH: 'Auth Token',
  DEC: 'Decision',
  DBX: 'Database',
  EDX: 'Education Experience',
  EML: 'Email',
  ETA: 'External Task Auth Token',
  ETT: 'External Task Type',
  EXT: 'External Task',
  IMG: 'Image',
  IND: 'Industry',
  IPA: 'IP Address',
  LNG: 'Language',
  LOC: 'Location',
  ORG: 'Organization',
  PER: 'Person',
  PHN: 'Phone Number',
  PNM: 'Person Name',
  PRD: 'Product',
  SEC: 'Secret',
  SOC: 'Social Profile',
  TRG: 'Target',
  UPD: 'Update',
  USR: 'User',
  WEB: 'Website',
  WKR: 'Work Role',
  WKX: 'Work Experience',
  WRK: 'Workflow'
};

export type IdentifierType = $Keys<typeof TYPES>;
export type Identifiable = string | { id: string };

export function encodeId(type: IdentifierType, uuid: Identifiable): string {
  const normalizedUUID = removeDashes(
    typeof uuid === 'string' ? uuid : uuid.id
  );

  if (normalizedUUID.length !== 32) {
    throw new InvalidIdentifierError();
  }

  const base62UUID = base62
    .encode(Buffer.from(normalizedUUID, 'hex'))
    .padStart(22, '0');

  return type + base62UUID;
}

export function decodeId(id: string): [?IdentifierType, string] {
  const norm = removeDashes(id);
  if (norm.length === 32) {
    return [null, norm];
  } else if (norm.length === 25) {
    const type = norm.substring(0, 3);
    const rest = norm.substring(3);
    const uuid = Buffer.from(base62.decode(rest))
      .toString('hex')
      .padStart(32, '0');

    const trimmedUUID = uuid.substring(uuid.length - 32);
    return [(type: any), trimmedUUID];
  } else {
    throw new InvalidIdentifierError(norm);
  }
}

export function decodeIdOfType(type: IdentifierType, id: string): string {
  const [decodedType, decodedUUID] = decodeId(id);
  if (decodedType && decodedType !== type) {
    throw new InvalidIdentifierError(type);
  }
  return decodedUUID;
}
