/** @flow */

import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type {
  EducationExperienceEntityRow,
  OrganizationEntityRow,
  PersonEntityRow
} from '../rows';

export default {
  id(educationExperienceRow: EducationExperienceEntityRow): string {
    return encodeId('EDX', educationExperienceRow.id);
  },
  async display(
    educationExperienceRow: EducationExperienceEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<string> {
    const orgRow = await loaders.organization.load(
      educationExperienceRow.organization_id
    );
    return `Studied at ${orgRow.name}`;
  },
  degrees(educationExperienceRow: EducationExperienceEntityRow): Array<string> {
    return educationExperienceRow.degrees;
  },
  isCurrent(educationExperienceRow: EducationExperienceEntityRow): ?boolean {
    return educationExperienceRow.is_current;
  },
  majors(educationExperienceRow: EducationExperienceEntityRow): Array<string> {
    return educationExperienceRow.majors;
  },
  minors(educationExperienceRow: EducationExperienceEntityRow): Array<string> {
    return educationExperienceRow.minors;
  },
  endDate(educationExperienceRow: EducationExperienceEntityRow): ?Date {
    return educationExperienceRow.end_date;
  },
  startDate(educationExperienceRow: EducationExperienceEntityRow): ?Date {
    return educationExperienceRow.start_date;
  },
  organization(
    educationExperienceRow: EducationExperienceEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<OrganizationEntityRow> {
    return loaders.organization.load(educationExperienceRow.organization_id);
  },
  person(
    educationExperienceRow: EducationExperienceEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<PersonEntityRow> {
    return loaders.person.load(educationExperienceRow.person_id);
  }
};
