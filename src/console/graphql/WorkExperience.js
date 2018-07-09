/** @flow */

import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type {
  WorkExperienceEntityRow,
  WorkRoleEntityRow,
  OrganizationEntityRow,
  PersonEntityRow
} from '../rows';

export default {
  id(workExperienceRow: WorkExperienceEntityRow): string {
    return encodeId('WKX', workExperienceRow.id);
  },
  async display(
    workExperienceRow: WorkExperienceEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<string> {
    const orgRow = await loaders.organization.load(
      workExperienceRow.organization_id
    );
    return `Worked at ${orgRow.name}`;
  },
  organization(
    workExperienceRow: WorkExperienceEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<OrganizationEntityRow> {
    return loaders.organization.load(workExperienceRow.organization_id);
  },
  person(
    workExperienceRow: WorkExperienceEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<PersonEntityRow> {
    return loaders.person.load(workExperienceRow.person_id);
  },
  roles(
    workExperienceRow: WorkExperienceEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<WorkRoleEntityRow>> {
    return loaders.workRolesByWorkExperienceId.load(workExperienceRow.id);
  }
};
