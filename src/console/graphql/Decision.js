/** @flow */

import moment from 'moment';
import { NotFoundError } from '../errors';
import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type { DecisionRow, TargetRow, ExternalTaskRow } from '../rows';

export default {
  id(decisionRow: DecisionRow): string {
    return encodeId('DEC', decisionRow.id);
  },
  display(decisionRow: DecisionRow): string {
    const friendlyTime = moment(decisionRow.created_at).format(
      'dddd, MMMM Do YYYY, h:mm:ss a'
    );

    if (decisionRow.user_id) {
      return `Manual decision made on ${friendlyTime}`;
    } else {
      return `Automated decision made on ${friendlyTime}`;
    }
  },
  label(decisionRow: DecisionRow): ?string {
    return decisionRow.label;
  },
  score(decisionRow: DecisionRow): ?number {
    return decisionRow.score;
  },
  reasons(decisionRow: DecisionRow): Array<string> {
    return decisionRow.reasons;
  },
  metadata(decisionRow: DecisionRow): any {
    return decisionRow.metadata;
  },
  async externalTask(
    decisionRow: DecisionRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?ExternalTaskRow> {
    if (!decisionRow.external_task_id) return null;
    return loaders.externalTask.load(decisionRow.external_task_id);
  },
  createdAt(decisionRow: DecisionRow): Date {
    return decisionRow.created_at;
  },
  async target(
    decisionRow: DecisionRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<TargetRow> {
    const targetRow = await loaders.target.load(decisionRow.target_id);
    if (targetRow) {
      return targetRow;
    } else {
      throw new NotFoundError('target not found');
    }
  }
};
