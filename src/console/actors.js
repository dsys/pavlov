/** @flow */

import canonicalPersonName from './utils/canonicalPersonName';
import findPrimaryName from './utils/findPrimaryName';
import q from './db/queries';
import { adminPG } from './db/postgres';
import { decodeIdOfType } from './identifiers';
import { enrichEmail, enrichIP } from './entities/enrich';
import {
  insertPersonEntity,
  insertEmailEntity,
  insertIPAddressEntity,
  insertPhoneNumberEntity
} from './entities/insert';

import type { Loaders } from './loaders';
import type { QueryContext } from './db/context';
import type {
  ActorRow,
  DatabaseRow,
  EmailEntityRow,
  IPAddressEntityRow,
  PersonEntityRow,
  PhoneNumberEntityRow
} from './rows';

export type ActorLookupFields = {
  id: ?string,
  email: ?string,
  ipAddress: ?string,
  name: ?string,
  phoneNumber: ?string
};

export type ActorSpec = {|
  lookupFields: ActorLookupFields,
  emailId: ?string,
  ipAddressId: ?string,
  personId: ?string,
  phoneNumberId: ?string,
  databaseId: string
|};

export async function getActorDisplay(
  loaders: Loaders,
  actorRow: ActorRow
): Promise<string> {
  if (actorRow.person_id) {
    const personRow = await loaders.person.load(actorRow.person_id);
    const personNames = await loaders.personNamesByPersonId.load(personRow.id);
    const primaryName = findPrimaryName(personNames);
    return primaryName ? canonicalPersonName(primaryName) : 'Anonymous';
  } else if (actorRow.email_id) {
    const emailRow = await loaders.email.load(actorRow.email_id);
    return emailRow ? emailRow.address : 'Anonymous';
  } else if (actorRow.phone_number_id) {
    const phoneNumberRow = await loaders.phoneNumber.load(
      actorRow.phone_number_id
    );
    return phoneNumberRow ? phoneNumberRow.number : 'Anonymous';
  } else if (actorRow.ip_address_id) {
    const ipAddressRow = await loaders.ipAddress.load(actorRow.ip_address_id);
    return ipAddressRow ? ipAddressRow.ip_address : 'Anonymous';
  } else {
    return 'Anonymous';
  }
}

export async function insertActor(
  queryContext: QueryContext,
  actorSpec: ActorSpec
): Promise<ActorRow> {
  return queryContext.one(q.actors.insert, actorSpec);
}

export async function resolveActor(
  loaders: Loaders,
  lookupFields: ActorLookupFields,
  databaseRow: DatabaseRow
): Promise<?ActorRow> {
  if (lookupFields.id) {
    const actorUUID = decodeIdOfType('ACT', lookupFields.id);
    return loaders.actor.load(actorUUID);
  }

  let emailRow = null;
  let phoneNumberRow = null;
  let ipAddressRow = null;
  let relatedPeopleRows = [];

  if (lookupFields.email) {
    const result = await resolveActorEmail(loaders, lookupFields.email);

    emailRow = result.emailRow;
    relatedPeopleRows = relatedPeopleRows.concat(result.relatedPeopleRows);
  }

  if (lookupFields.phoneNumber) {
    const result = await resolveActorPhoneNumber(
      loaders,
      lookupFields.phoneNumber
    );

    phoneNumberRow = result.phoneNumberRow;
    relatedPeopleRows = relatedPeopleRows.concat(result.relatedPeopleRows);
  }

  if (lookupFields.ipAddress) {
    ipAddressRow = await resolveActorIPAddress(loaders, lookupFields.ipAddress);
  }

  // TODO: Use a more accurate resolution mechanism, such as by incorporating the name provided.
  const personRow = relatedPeopleRows.length > 0 ? relatedPeopleRows[0] : null;

  const actorSpec = {
    lookupFields,
    personId: personRow ? personRow.id : null,
    emailId: emailRow ? emailRow.id : null,
    ipAddressId: ipAddressRow ? ipAddressRow.id : null,
    phoneNumberId: phoneNumberRow ? phoneNumberRow.id : null,
    databaseId: databaseRow.id
  };

  return adminPG.tx(async queryContext => insertActor(queryContext, actorSpec));
}

export async function resolveActorEmail(
  loaders: Loaders,
  email: string
): Promise<{
  emailRow: EmailEntityRow,
  relatedPeopleRows: Array<PersonEntityRow>
}> {
  let emailRow = await loaders.emailByAddress.load(email);

  if (emailRow) {
    const relatedPeopleRows = await loaders.peopleByEmail.load(emailRow.id);
    return { emailRow, relatedPeopleRows };
  } else {
    const personEntitySpec = await enrichEmail(email);

    if (personEntitySpec) {
      return adminPG.tx(async queryContext => {
        const relatedPeopleRows = await insertPersonEntity(
          queryContext,
          personEntitySpec
        );
        emailRow = await loaders.emailByAddress.load(email);
        return { emailRow, relatedPeopleRows };
      });
    } else {
      emailRow = await insertEmailEntity(adminPG, {
        address: email,
        domain: null,
        emailProvider: null,
        isPrimary: null,
        type: null
      });

      return { emailRow, relatedPeopleRows: [] };
    }
  }
}

export async function resolveActorPhoneNumber(
  loaders: Loaders,
  phoneNumber: string
): Promise<{
  phoneNumberRow: PhoneNumberEntityRow,
  relatedPeopleRows: Array<PersonEntityRow>
}> {
  let phoneNumberRow = await loaders.phoneNumberByNumber.load(phoneNumber);

  if (phoneNumberRow) {
    const relatedPeopleRows = await loaders.peopleByPhoneNumber.load(
      phoneNumberRow.id
    );

    return { phoneNumberRow, relatedPeopleRows };
  } else {
    phoneNumberRow = await insertPhoneNumberEntity(adminPG, {
      areaCode: null,
      countryCode: null,
      extension: null,
      number: phoneNumber,
      type: null
    });

    return { phoneNumberRow, relatedPeopleRows: [] };
  }
}

export async function resolveActorIPAddress(
  loaders: Loaders,
  ipAddress: string
): Promise<IPAddressEntityRow> {
  const ipAddressRow = await loaders.ipAddressByIP.load(ipAddress);
  if (ipAddressRow) {
    return ipAddressRow;
  }

  const ipEntitySpec = await enrichIP(ipAddress);
  if (ipEntitySpec) {
    return insertIPAddressEntity(adminPG, ipEntitySpec);
  } else {
    return insertIPAddressEntity(adminPG, {
      ipAddress,
      website: null,
      location: null,
      organization: null,
      asNumber: null,
      asOrg: null,
      isp: null
    });
  }
}
