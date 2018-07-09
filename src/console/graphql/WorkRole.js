/** @flow */

import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type { WorkRoleEntityRow, WorkExperienceEntityRow } from '../rows';

export default {
  id(workRoleRow: WorkRoleEntityRow): string {
    return encodeId('WKR', workRoleRow.id);
  },
  display(workRoleRow: WorkRoleEntityRow): string {
    return workRoleRow.title || 'Worked';
  },
  title(workRoleRow: WorkRoleEntityRow): ?string {
    return workRoleRow.title;
  },
  endDate(workRoleRow: WorkRoleEntityRow): ?Date {
    return workRoleRow.end_date;
  },
  isCurrent(workRoleRow: WorkRoleEntityRow): ?boolean {
    return workRoleRow.is_current;
  },
  startDate(workRoleRow: WorkRoleEntityRow): ?Date {
    return workRoleRow.end_date;
  },
  workExperience(
    workRoleRow: WorkRoleEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<WorkExperienceEntityRow> {
    return loaders.workExperience.load(workRoleRow.work_experience_id);
  }
};
