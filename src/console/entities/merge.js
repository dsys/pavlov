/** @flow */

import _ from 'lodash';
import type {
  EducationExperienceEntitySpec,
  EmailEntitySpec,
  ImageEntitySpec,
  LanguageEntitySpec,
  LocationEntitySpec,
  PersonEntitySpec,
  PersonNameEntitySpec,
  PhoneNumberEntitySpec,
  SocialProfileEntitySpec,
  WebsiteEntitySpec,
  WorkExperienceEntitySpec
} from './specs';

export function mergeScalars<T>(a: T, b: T): T {
  return a || b;
}

export function mergeArrays<T>(a: Array<T>, b: Array<T>): Array<T> {
  return _.union(a, b);
}

export function mergeEntitySpecArraysBy<T, U>(
  a: Array<T>,
  b: Array<T>,
  by: (v: T) => U
): Array<T> {
  return _.unionWith(a, b, (x, y) => _.isEqual(by(x), by(y)));
}

export function mergePersonNameEntitySpecArrays(
  a: Array<PersonNameEntitySpec>,
  b: Array<PersonNameEntitySpec>
): Array<PersonNameEntitySpec> {
  return mergeEntitySpecArraysBy(a, b, v => [
    v.firstName ? v.firstName.toLowerCase() : null,
    v.middleName ? v.middleName.toLowerCase() : null,
    v.lastName ? v.lastName.toLowerCase() : null
  ]);
}

export function mergeEmailEntitySpecArrays(
  a: Array<EmailEntitySpec>,
  b: Array<EmailEntitySpec>
): Array<EmailEntitySpec> {
  return mergeEntitySpecArraysBy(
    a,
    b,
    v => (v.address ? v.address.toLowerCase() : null)
  );
}

export function mergeImageEntitySpecArrays(
  a: Array<ImageEntitySpec>,
  b: Array<ImageEntitySpec>
): Array<ImageEntitySpec> {
  return mergeEntitySpecArraysBy(a, b, v => v.url);
}

export function mergeLanguageEntitySpecArrays(
  a: Array<LanguageEntitySpec>,
  b: Array<LanguageEntitySpec>
): Array<LanguageEntitySpec> {
  return mergeEntitySpecArraysBy(a, b, v => v.name);
}

export function mergeWebsiteEntitySpecArrays(
  a: Array<WebsiteEntitySpec>,
  b: Array<WebsiteEntitySpec>
): Array<WebsiteEntitySpec> {
  return mergeEntitySpecArraysBy(a, b, v => v.url);
}

export function mergePhoneNumberEntitySpecArrays(
  a: Array<PhoneNumberEntitySpec>,
  b: Array<PhoneNumberEntitySpec>
): Array<PhoneNumberEntitySpec> {
  return mergeEntitySpecArraysBy(a, b, v => v.number);
}

export function mergeSocialProfileEntitySpecArrays(
  a: Array<SocialProfileEntitySpec>,
  b: Array<SocialProfileEntitySpec>
): Array<SocialProfileEntitySpec> {
  return mergeEntitySpecArraysBy(a, b, v => [
    v.name ? v.name.toLowerCase() : null,
    v.network ? (v.network.name ? v.network.name.toLowerCase() : null) : null
  ]);
}

export function mergeLocationEntitySpecArrays(
  a: Array<LocationEntitySpec>,
  b: Array<LocationEntitySpec>
): Array<LocationEntitySpec> {
  return mergeEntitySpecArraysBy(a, b, v => v.name);
}

// TODO: Improve merging.
export function mergeWorkExperienceEntitySpecArrays(
  a: Array<WorkExperienceEntitySpec>,
  b: Array<WorkExperienceEntitySpec>
): Array<WorkExperienceEntitySpec> {
  return a.concat(b);
}

// TODO: Improve merging.
export function mergeEducationExperienceEntitySpecArrays(
  a: Array<EducationExperienceEntitySpec>,
  b: Array<EducationExperienceEntitySpec>
): Array<EducationExperienceEntitySpec> {
  return a.concat(b);
}

// TODO: Improve merging to recurse over entity spec subtypes and perform better de-duping.
export function mergePersonEntitySpecs(
  a: PersonEntitySpec,
  b: PersonEntitySpec
): PersonEntitySpec {
  return {
    dateOfBirth: mergeScalars(a.dateOfBirth, b.dateOfBirth),
    gender: mergeScalars(a.gender, b.gender),
    interests: mergeArrays(a.interests, b.interests),
    skills: mergeArrays(a.skills, b.interests),
    names: mergePersonNameEntitySpecArrays(a.names, b.names),
    emails: mergeEmailEntitySpecArrays(a.emails, b.emails),
    images: mergeImageEntitySpecArrays(a.images, b.images),
    languages: mergeLanguageEntitySpecArrays(a.languages, b.languages),
    websites: mergeWebsiteEntitySpecArrays(a.websites, b.websites),
    locations: mergeLocationEntitySpecArrays(a.locations, b.locations),
    phoneNumbers: mergePhoneNumberEntitySpecArrays(
      a.phoneNumbers,
      b.phoneNumbers
    ),
    socialProfiles: mergeSocialProfileEntitySpecArrays(
      a.socialProfiles,
      b.socialProfiles
    ),
    workExperiences: mergeWorkExperienceEntitySpecArrays(
      a.workExperiences,
      b.workExperiences
    ),
    educationExperiences: mergeEducationExperienceEntitySpecArrays(
      a.educationExperiences,
      b.educationExperiences
    )
  };
}
