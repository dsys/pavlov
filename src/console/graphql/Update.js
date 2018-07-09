/** @flow */

import moment from 'moment';
import { NotFoundError } from '../errors';
import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type { UpdateRow, TargetRow } from '../rows';

export default {
  id(updateRow: UpdateRow): string {
    return encodeId('UPD', updateRow.id);
  },
  display(updateRow: UpdateRow): string {
    const friendlyTime = moment(updateRow.created_at).format(
      'dddd, MMMM Do YYYY, h:mm:ss a'
    );

    if (updateRow.user_id) {
      return `Manual decision made on ${friendlyTime}`;
    } else {
      return `Automated decision made on ${friendlyTime}`;
    }
  },
  event(updateRow: UpdateRow): string {
    return updateRow.event;
  },
  args(updateRow: UpdateRow): Object {
    return updateRow.args;
  },
  label(updateRow: UpdateRow): ?string {
    return updateRow.label;
  },
  score(updateRow: UpdateRow): ?number {
    return updateRow.score;
  },
  reasons(updateRow: UpdateRow): Array<string> {
    return updateRow.reasons;
  },
  state(updateRow: UpdateRow): ?Object {
    return updateRow.state;
  },
  aliases(updateRow: UpdateRow): Array<string> {
    return updateRow.aliases || [];
  },
  webhookStatus(updateRow: UpdateRow): ?number {
    return updateRow.webhook_status;
  },
  webhookAt(updateRow: UpdateRow): ?Date {
    return updateRow.webhook_at;
  },
  createdAt(updateRow: UpdateRow): Date {
    return updateRow.created_at;
  },
  async target(
    updateRow: UpdateRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<TargetRow> {
    const targetRow = await loaders.target.load(updateRow.target_id);
    if (targetRow) {
      return targetRow;
    } else {
      throw new NotFoundError('target not found');
    }
  }
};
