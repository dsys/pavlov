/** @flow */

import _ from 'lodash';
import fetch from 'node-fetch';
import querystring from 'querystring';
import { aliasToSocialNetwork } from './socialNetwork';
import { dateOrNull } from './dates';
import { PIPL_BUSINESS_API_KEY } from '../config';
import { uploadImageURL } from '../images/upload';

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

const BASE_URL = 'https://api.pipl.com/search/';

export type PiplSearchParameters = {
  key: string,
  email: string
};

export type PiplResponse = {
  person?: PiplPerson
};

export type PiplPerson = {
  '@id': string,
  names?: Array<PiplName>,
  emails?: Array<PiplEmail>,
  usernames?: Array<PiplUsername>,
  phones?: Array<PiplPhone>,
  gender?: PiplGender,
  dob?: PiplDOB,
  languages?: Array<PiplLanguage>,
  ethnicities?: Array<PiplEthnicity>,
  origin_countries?: Array<PiplOriginCountry>,
  addresses?: Array<PiplAddress>,
  jobs?: Array<PiplJob>,
  educations?: Array<PiplEducation>,
  relationships?: Array<PiplRelationship>,
  user_ids?: Array<PiplUserID>,
  images?: Array<PiplImage>,
  urls?: Array<PiplURL>
};

export type PiplName = {
  '@type'?: string,
  first?: string,
  middle?: string,
  last?: string,
  prefix?: string,
  suffix?: string,
  raw?: string,
  display?: string
};

export type PiplEmail = {
  '@type'?: string,
  address?: string
};

export type PiplPhone = {
  '@type'?: string,
  country_code?: number,
  number?: number,
  extension?: number,
  display?: string,
  display_international?: string
};

export type PiplGender = { content: string };
export type PiplDateRange = { start: string, end: string };
export type PiplDOB = { date_range: PiplDateRange, display: string };
export type PiplEthnicity = { content: string };
export type PiplOriginCountry = { country: string };
export type PiplImage = { url: string };
export type PiplUserID = { content: string };
export type PiplUsername = { content: string };

export type PiplLanguage = {
  language?: string,
  region?: string,
  display?: string
};

export type PiplEducation = {
  degree?: string,
  school?: string,
  date_range?: PiplDateRange,
  display?: string
};

export type PiplURL = {
  '@domain'?: string,
  '@name'?: string,
  '@category'?: string,
  url?: string
};

export type PiplAddress = {
  '@type'?: string,
  country?: string,
  state?: string,
  city?: string,
  street?: string,
  house?: string,
  apartment?: string,
  zip_code?: string,
  po_box?: string,
  raw?: string,
  display?: string
};

export type PiplJob = {
  title?: string,
  organization?: string,
  industry?: string,
  date_range?: PiplDateRange,
  display?: string
};

export type PiplRelationship = {};

export async function normalizePiplPerson(
  t: PiplPerson
): Promise<PersonEntitySpec> {
  let socialProfiles = [];

  if (t.user_ids) {
    socialProfiles = socialProfiles.concat(t.user_ids.map(normalizePiplUserID));
  }

  if (t.usernames) {
    socialProfiles = socialProfiles.concat(
      t.usernames.map(normalizePiplUsername)
    );
  }

  return {
    interests: [],
    skills: [],
    names: t.names ? t.names.map(normalizePiplName) : [],
    dateOfBirth: t.dob ? normalizePiplDOB(t.dob) : null,
    educationExperiences: t.educations
      ? t.educations.map(normalizePiplEducation)
      : [],
    emails: t.emails ? t.emails.map(normalizePiplEmail) : [],
    gender: t.gender ? normalizePiplGender(t.gender) : null,
    images: t.images ? await normalizePiplImages(t.images) : [],
    languages: t.languages ? t.languages.map(normalizePiplLanguage) : [],
    phoneNumbers: t.phones ? t.phones.map(normalizePiplPhone) : [],
    websites: t.urls ? t.urls.map(normalizePiplURL) : [],
    locations: t.addresses ? t.addresses.map(normalizePiplAddress) : [],
    socialProfiles,
    workExperiences: t.jobs ? t.jobs.map(normalizePiplJob) : []
  };
}

export function normalizePiplName(n: PiplName): PersonNameEntitySpec {
  return {
    firstName: n.first,
    isPrimary: '@type' in n ? n['@type'] === 'present' : null,
    lastName: n.last,
    middleName: n.middle,
    prefix: n.prefix,
    suffix: n.suffix,
    title: null
  };
}

export function normalizePiplDOB(d: PiplDOB): Date {
  return new Date(d.date_range.start);
}

export function normalizePiplGender(g: PiplGender): string {
  return g.content;
}

export function normalizePiplEmail(e: PiplEmail): EmailEntitySpec {
  return {
    address: e.address,
    domain: null,
    emailProvider: null,
    isPrimary: null,
    type: e['@type']
  };
}

export function normalizePiplEducation(
  e: PiplEducation
): EducationExperienceEntitySpec {
  return {
    degrees: e.degree ? [e.degree] : [],
    endDate: e.date_range ? dateOrNull(e.date_range.end) : null,
    isCurrent: null,
    majors: [],
    minors: [],
    startDate: e.date_range ? dateOrNull(e.date_range.start) : null,
    organization: {
      name: e.school || 'A School',
      alexaGlobalRank: null,
      alexaUSRank: null,
      dbas: [],
      description: null,
      emails: [],
      employeeCount: null,
      foundingDate: null,
      images: [],
      industries: [],
      legalName: null,
      locations: [],
      marketCap: null,
      phoneNumbers: [],
      products: [],
      raised: null,
      socialProfiles: [],
      websites: []
    }
  };
}

export async function normalizePiplImages(
  is: Array<PiplImage>
): Promise<Array<ImageEntitySpec>> {
  const stored = await Promise.all(is.map(i => uploadImageURL(i.url)));
  return _.compact(stored);
}

export function normalizePiplLanguage(l: PiplLanguage): LanguageEntitySpec {
  return {
    name: l.language
  };
}

export function normalizePiplPhone(p: PiplPhone): PhoneNumberEntitySpec {
  return {
    areaCode: null,
    countryCode: p.country_code ? p.country_code.toString() : null,
    extension: p.extension ? p.extension.toString() : null,
    number: p.number ? p.number.toString() : null,
    type: p['@type']
  };
}

export function normalizePiplURL(u: PiplURL): WebsiteEntitySpec {
  return {
    name: u['@name'],
    domain: u['@domain'],
    type: u['@category'],
    url: u.url || u['@domain'] || ''
  };
}

export function normalizePiplAddress(l: PiplAddress): LocationEntitySpec {
  return {
    name: l.display,
    continent: null,
    country: l.country,
    isPrimary: null,
    latitude: null,
    locality: null,
    longitude: null,
    poBox: l.po_box,
    postalCode: l.zip_code,
    region: null,
    state: l.state,
    streetAddress: l.street,
    timezone: null,
    type: l['@type']
  };
}

export function normalizePiplUserID(u: PiplUserID): SocialProfileEntitySpec {
  const { alias, socialNetwork } = parseSocialProfile(u.content);

  return {
    aliases: [alias],
    bio: null,
    followers: null,
    isActive: null,
    network: socialNetwork ? { name: socialNetwork, website: null } : null,
    url: null
  };
}

export function normalizePiplUsername(
  u: PiplUsername
): SocialProfileEntitySpec {
  const { alias, socialNetwork } = parseSocialProfile(u.content);

  return {
    aliases: [alias],
    bio: null,
    followers: null,
    isActive: null,
    network: socialNetwork ? { name: socialNetwork, website: null } : null,
    url: null
  };
}

export function normalizePiplJob(j: PiplJob): WorkExperienceEntitySpec {
  return {
    organization: {
      name: j.organization || 'A School',
      alexaGlobalRank: null,
      alexaUSRank: null,
      dbas: [],
      description: null,
      emails: [],
      employeeCount: null,
      foundingDate: null,
      images: [],
      industries: [],
      legalName: null,
      locations: [],
      marketCap: null,
      phoneNumbers: [],
      products: [],
      raised: null,
      socialProfiles: [],
      websites: []
    },
    roles: [
      {
        title: j.title,
        endDate: j.date_range ? dateOrNull(j.date_range.start) : null,
        startDate: j.date_range ? dateOrNull(j.date_range.end) : null,
        isCurrent: null
      }
    ]
  };
}

export async function enrichEmail(email: string): Promise<?PersonEntitySpec> {
  const params: PiplSearchParameters = {
    key: PIPL_BUSINESS_API_KEY,
    email
  };

  const q = querystring.stringify(params);
  const url = `${BASE_URL}?${q}`;

  const res = await fetch(url);
  const resBody: PiplResponse = await res.json();
  const piplPerson = resBody.person;
  if (piplPerson) {
    return normalizePiplPerson(piplPerson);
  } else {
    return null;
  }
}

function parseSocialProfile(
  s: string
): { alias: string, socialNetwork: ?string } {
  const parts = s.split('@');
  const alias = parts[0];
  if (parts.length > 1) {
    return { alias, socialNetwork: aliasToSocialNetwork(parts[1]) || parts[1] };
  } else {
    return { alias, socialNetwork: null };
  }
}
