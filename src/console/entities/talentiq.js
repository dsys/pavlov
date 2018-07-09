/** @flow */

import _ from 'lodash';
import fetch from 'node-fetch';
import querystring from 'querystring';
import { dateOrNull } from './dates';
import { uploadImageURL } from '../images/upload';
import { parseFullName } from 'parse-full-name';
import { urlToSocialNetwork } from './socialNetwork';
import { TALENTIQ_API_KEY } from '../config';
import type {
  EducationExperienceEntitySpec,
  EmailEntitySpec,
  ImageEntitySpec,
  LocationEntitySpec,
  OrganizationEntitySpec,
  PersonEntitySpec,
  PersonNameEntitySpec,
  PhoneNumberEntitySpec,
  SocialProfileEntitySpec,
  WebsiteEntitySpec,
  WorkExperienceEntitySpec
} from './specs';

const BASE_URL = 'https://api.talentiq.co/v3/person';

export type TalentIQSearchParameters = {
  api_key: string,
  email: string
};

export type TalentIQResponse = {
  likelihood: number,
  data: TalentIQPerson
};

export type TalentIQEducation = {
  is_current: ?boolean,
  degree: ?string,
  end_date: ?string,
  locations: Array<TalentIQLocation>,
  majors: Array<string>,
  degrees: Array<string>,
  minors: Array<string>,
  school: TalentIQSchool,
  start_date: ?string
};

export type TalentIQSchool = {
  location: ?string,
  name: ?string,
  type: ?string,
  profiles: Array<string>
};

export type TalentIQCompany = {
  industry: ?string,
  location: ?string,
  name: ?string,
  size: ?string,
  website: ?string,
  profiles: Array<string>
};

export type TalentIQPerson = {
  education: Array<TalentIQEducation>,
  emails: Array<TalentIQEmail>,
  industries: Array<TalentIQIndustry>,
  experience: Array<TalentIQExperience>,
  interests: Array<TalentIQInterest>,
  locations: Array<TalentIQLocation>,
  names: Array<TalentIQName>,
  phone_numbers: Array<TalentIQPhoneNumber>,
  photos: Array<TalentIQPhoto>,
  profiles: Array<TalentIQProfile>,
  skills: Array<TalentIQSkill>,
  websites: Array<TalentIQWebsite>
};

export type TalentIQEmail = {
  address: string,
  is_primary: ?boolean,
  type: ?string,
  domain: ?string,
  local: ?string
};

export type TalentIQIndustry = {
  is_primary: ?boolean,
  name: string
};

export type TalentIQExperienceTitle = {
  functions: Array<?string>,
  levels: Array<?string>,
  name: ?string
};

export type TalentIQExperience = {
  is_current: ?boolean,
  company: TalentIQCompany,
  end_date: ?string,
  locations: Array<TalentIQLocation>,
  start_date: ?string,
  title: TalentIQExperienceTitle
};

export type TalentIQInterest = {
  name: string
};

export type TalentIQLocation = {
  continent: ?string,
  country: ?string,
  geo: ?string,
  type: ?string,
  is_primary: ?boolean,
  locality: ?string,
  name: ?string,
  po_box: ?string,
  postal_code: ?string,
  region: ?string,
  street_address: ?string
};

export type TalentIQName = {
  clean: ?string,
  first_name: ?string,
  is_primary: ?boolean,
  last_name: ?string,
  middle_name: ?string,
  name: ?string,
  pedigree: ?string,
  suffix: ?string,
  title: ?string
};

export type TalentIQPhoneNumber = {
  E164: ?string,
  area_code: ?string,
  country_code: ?string,
  extension: ?string,
  is_primary: ?boolean,
  national_number: ?string,
  number: string,
  type: ?string
};

export type TalentIQPhoto = {
  source: ?string,
  url: string
};

export type TalentIQProfile = {
  aliases: Array<string>,
  ids: Array<string>,
  clean: ?string,
  is_active: ?boolean,
  network: ?string,
  url: ?string,
  username: ?string
};

export type TalentIQSkill = {
  name: string
};

export type TalentIQWebsite = {
  is_primary: ?boolean,
  type: ?string,
  url: string,
  domain: string
};

function normalizeTalentIQLocation(l: TalentIQLocation): LocationEntitySpec {
  // TODO: Implement geo
  return {
    continent: l.continent,
    country: l.country,
    type: l.type,
    locality: l.locality,
    name: l.name,
    poBox: l.po_box,
    timezone: null,
    state: null,
    longitude: null,
    latitude: null,
    isPrimary: null,
    postalCode: l.postal_code,
    region: l.region,
    streetAddress: l.street_address
  };
}

export function normalizeTalentIQName(n: TalentIQName): PersonNameEntitySpec {
  if (n.clean) {
    const parsed = parseFullName(n.clean);
    return {
      firstName: parsed.first,
      isPrimary: n.is_primary,
      lastName: parsed.last,
      middleName: parsed.middle,
      prefix: parsed.title,
      suffix: parsed.suffix,
      title: null
    };
  } else {
    return {
      firstName: n.first_name,
      isPrimary: n.is_primary,
      lastName: n.last_name,
      middleName: n.middle_name,
      prefix: n.title,
      suffix: n.suffix,
      title: null
    };
  }
}

export function normalizeTalentIQEmail(e: TalentIQEmail): EmailEntitySpec {
  // TODO: Implement emailProvider
  return {
    address: e.address,
    domain: e.domain,
    emailProvider: null,
    isPrimary: e.is_primary,
    type: null
  };
}

export function normalizeTalentIQSchool(
  s: TalentIQSchool
): OrganizationEntitySpec {
  return {
    dbas: [],
    alexaGlobalRank: null,
    alexaUSRank: null,
    description: s.type,
    emails: [],
    employeeCount: null,
    foundingDate: null,
    images: [],
    industries: [],
    legalName: null,
    locations: [
      {
        name: s.location,
        continent: null,
        country: null,
        isPrimary: null,
        latitude: null,
        locality: null,
        longitude: null,
        poBox: null,
        postalCode: null,
        region: null,
        state: null,
        streetAddress: null,
        timezone: null,
        type: null
      }
    ],
    marketCap: null,
    name: s.name || 'A School',
    phoneNumbers: [],
    products: [],
    raised: null,
    socialProfiles: s.profiles.map(p => ({
      aliases: [p],
      bio: null,
      followers: null,
      isActive: null,
      network: null,
      url: null
    })),
    websites: []
  };
}

export function normalizeTalentIQWebsite(
  w: TalentIQWebsite
): WebsiteEntitySpec {
  return {
    name: null,
    domain: w.domain,
    type: w.type,
    url: w.url
  };
}

export function normalizeTalentIQEducation(
  e: TalentIQEducation
): EducationExperienceEntitySpec {
  // TODO: Implement locations
  return {
    isCurrent: e.is_current,
    degrees: e.degrees || (e.degree ? [e.degree] : []),
    endDate: e.end_date ? new Date(e.end_date) : null,
    startDate: e.start_date ? new Date(e.start_date) : null,
    majors: e.majors,
    minors: e.minors,
    organization: normalizeTalentIQSchool(e.school)
  };
}

export function normalizeTalentIQInterest(i: TalentIQInterest): string {
  return i.name;
}

export async function normalizeTalentIQPhotos(
  ps: Array<TalentIQPhoto>
): Promise<Array<ImageEntitySpec>> {
  const stored = await Promise.all(ps.map(p => uploadImageURL(p.url)));
  return _.compact(stored);
}

export function normalizeTalentIQPhoneNumber(
  p: TalentIQPhoneNumber
): PhoneNumberEntitySpec {
  // TODO: Implement is_primary, national_number
  return {
    areaCode: p.area_code,
    countryCode: p.country_code,
    extension: p.extension,
    number: p.number,
    type: p.type
  };
}

export function normalizeTalentIQProfile(
  s: TalentIQProfile
): SocialProfileEntitySpec {
  const socialNetwork = s.url ? urlToSocialNetwork(s.url) : s.network;

  return {
    aliases: _.concat([s.username], s.aliases || [], s.ids || []),
    bio: null,
    followers: null,
    isActive: s.is_active,
    url: s.url,
    network: socialNetwork
      ? {
          name: socialNetwork,
          website: null
        }
      : null
  };
}

export function normalizeTalentIQCompany(
  c: TalentIQCompany
): OrganizationEntitySpec {
  return {
    name: c.name || 'A Company',
    alexaGlobalRank: null,
    alexaUSRank: null,
    dbas: [],
    description: null,
    emails: [],
    employeeCount: c.size,
    foundingDate: null,
    images: [],
    industries: [
      {
        name: c.industry
      }
    ],
    legalName: c.name,
    locations: [
      {
        name: c.location,
        continent: null,
        country: null,
        isPrimary: null,
        latitude: null,
        locality: null,
        longitude: null,
        poBox: null,
        postalCode: null,
        region: null,
        state: null,
        streetAddress: null,
        timezone: null,
        type: null
      }
    ],
    marketCap: null,
    phoneNumbers: [],
    products: [],
    raised: null,
    socialProfiles: [],
    websites: c.website
      ? [
          {
            name: null,
            domain: null,
            type: null,
            url: c.website
          }
        ]
      : []
  };
}

export function normalizeTalentIQExperience(
  e: TalentIQExperience
): WorkExperienceEntitySpec {
  return {
    roles: [
      {
        title: e.title && e.title.name,
        isCurrent: e.is_current,
        endDate: dateOrNull(e.end_date),
        startDate: dateOrNull(e.start_date)
      }
    ],
    organization: normalizeTalentIQCompany(e.company)
  };
}

export async function normalizeTalentIQPerson(
  t: TalentIQPerson
): Promise<PersonEntitySpec> {
  // TODO: Implement industries
  return {
    languages: [],
    gender: null,
    dateOfBirth: null,
    emails: t.emails.map(normalizeTalentIQEmail),
    interests: t.interests.map(normalizeTalentIQInterest),
    images: t.photos.length > 0 ? await normalizeTalentIQPhotos(t.photos) : [],
    websites: t.websites.map(normalizeTalentIQWebsite),
    skills: t.skills.map(s => s.name),
    educationExperiences: t.education.map(normalizeTalentIQEducation),
    workExperiences: t.experience.map(normalizeTalentIQExperience),
    locations: t.locations.map(normalizeTalentIQLocation),
    names: t.names.map(normalizeTalentIQName),
    phoneNumbers: t.phone_numbers.map(normalizeTalentIQPhoneNumber),
    socialProfiles: t.profiles.map(normalizeTalentIQProfile)
  };
}

export async function enrichEmail(email: string): Promise<?PersonEntitySpec> {
  const params: TalentIQSearchParameters = {
    api_key: TALENTIQ_API_KEY,
    email: email
  };

  const q = querystring.stringify(params);
  const url = `${BASE_URL}?${q}`;

  const res = await fetch(url);
  const resBody: TalentIQResponse = await res.json();
  const talentiqLikelihood = resBody.likelihood;
  const talentiqPerson = resBody.data;
  if (talentiqLikelihood && talentiqPerson) {
    return normalizeTalentIQPerson(talentiqPerson);
  } else {
    return null;
  }
}
