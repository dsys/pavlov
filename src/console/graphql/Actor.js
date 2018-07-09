/** @flow */

import { encodeId } from '../identifiers';
import { getActorDisplay } from '../actors';

import type { GraphQLContext } from './context';
import type {
  ActorRow,
  EmailEntityRow,
  IPAddressEntityRow,
  PersonEntityRow,
  PhoneNumberEntityRow
} from '../rows';

export default {
  id(actorRow: ActorRow): string {
    return encodeId('ACT', actorRow.id);
  },
  display(
    actorRow: ActorRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<string> {
    return getActorDisplay(loaders, actorRow);
  },
  lookupFields(actorRow: ActorRow): { [string]: string } {
    return actorRow.lookup_fields;
  },
  email(
    actorRow: ActorRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?EmailEntityRow> {
    return actorRow.email_id
      ? loaders.email.load(actorRow.email_id)
      : Promise.resolve(null);
  },
  ipAddress(
    actorRow: ActorRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?IPAddressEntityRow> {
    return actorRow.ip_address_id
      ? loaders.ipAddress.load(actorRow.ip_address_id)
      : Promise.resolve(null);
  },
  person(
    actorRow: ActorRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?PersonEntityRow> {
    return actorRow.person_id
      ? loaders.person.load(actorRow.person_id)
      : Promise.resolve(null);
  },
  phoneNumber(
    actorRow: ActorRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?PhoneNumberEntityRow> {
    return actorRow.phone_number_id
      ? loaders.phoneNumber.load(actorRow.phone_number_id)
      : Promise.resolve(null);
  }
};
