/** @flow */

import canonicalPersonName from '../utils/canonicalPersonName';
import findPrimaryName from '../utils/findPrimaryName';
import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type {
  EducationExperienceEntityRow,
  EmailEntityRow,
  ImageEntityRow,
  LanguageEntityRow,
  LocationEntityRow,
  PersonEntityRow,
  PersonNameEntityRow,
  PhoneNumberEntityRow,
  SocialProfileEntityRow,
  WebsiteEntityRow,
  WorkExperienceEntityRow
} from '../rows';

export default {
  id(personRow: PersonEntityRow): string {
    return encodeId('PER', personRow.id);
  },
  async display(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<string> {
    const personNames = await loaders.personNamesByPersonId.load(personRow.id);
    const primaryName = findPrimaryName(personNames);
    return primaryName ? canonicalPersonName(primaryName) : 'Anonymous';
  },
  names(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<PersonNameEntityRow>> {
    return loaders.personNamesByPersonId.load(personRow.id);
  },
  async primaryName(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?PersonNameEntityRow> {
    const personNames = await loaders.personNamesByPersonId.load(personRow.id);
    return findPrimaryName(personNames);
  },
  dateOfBirth(personRow: PersonEntityRow): ?Date {
    return personRow.date_of_birth;
  },
  gender(personRow: PersonEntityRow): ?string {
    return personRow.gender;
  },
  interests(personRow: PersonEntityRow): Array<string> {
    return personRow.interests;
  },
  skills(personRow: PersonEntityRow): Array<string> {
    return personRow.skills;
  },
  relatedPeople(personRow: PersonEntityRow): Array<PersonEntityRow> {
    // TODO: Implement me!
    return [];
  },
  emails(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<EmailEntityRow>> {
    return loaders.emailsByPersonId.load(personRow.id);
  },
  images(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<ImageEntityRow>> {
    return loaders.imagesByPersonId.load(personRow.id);
  },
  socialProfiles(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<SocialProfileEntityRow>> {
    return loaders.socialProfilesByPersonId.load(personRow.id);
  },
  languages(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<LanguageEntityRow>> {
    return loaders.languagesByPersonId.load(personRow.id);
  },
  websites(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<WebsiteEntityRow>> {
    return loaders.websitesByPersonId.load(personRow.id);
  },
  locations(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<LocationEntityRow>> {
    return loaders.locationsByPersonId.load(personRow.id);
  },
  phoneNumbers(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<PhoneNumberEntityRow>> {
    return loaders.phoneNumbersByPersonId.load(personRow.id);
  },
  educationExperiences(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<EducationExperienceEntityRow>> {
    return loaders.educationExperiencesByPersonId.load(personRow.id);
  },
  workExperiences(
    personRow: PersonEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<Array<WorkExperienceEntityRow>> {
    return loaders.workExperiencesByPersonId.load(personRow.id);
  }
};
