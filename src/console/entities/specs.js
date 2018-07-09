/** @flow */

export type EntitySpec =
  | PersonEntitySpec
  | EducationExperienceEntitySpec
  | OrganizationEntitySpec
  | EmailEntitySpec
  | PersonNameEntitySpec
  | ProductEntitySpec
  | PhoneNumberEntitySpec
  | ImageEntitySpec
  | IPAddressEntitySpec
  | LanguageEntitySpec
  | WorkExperienceEntitySpec
  | LocationEntitySpec
  | WebsiteEntitySpec
  | IndustryEntitySpec
  | SocialProfileEntitySpec
  | WorkRoleEntitySpec;

export type PersonEntitySpec = {|
  dateOfBirth: ?Date,
  educationExperiences: Array<EducationExperienceEntitySpec>,
  emails: Array<EmailEntitySpec>,
  gender: ?string,
  images: Array<ImageEntitySpec>,
  interests: Array<string>,
  languages: Array<LanguageEntitySpec>,
  locations: Array<LocationEntitySpec>,
  names: Array<PersonNameEntitySpec>,
  phoneNumbers: Array<PhoneNumberEntitySpec>,
  skills: Array<string>,
  socialProfiles: Array<SocialProfileEntitySpec>,
  websites: Array<WebsiteEntitySpec>,
  workExperiences: Array<WorkExperienceEntitySpec>
|};

export type EducationExperienceEntitySpec = {|
  degrees: Array<string>,
  endDate: ?Date,
  isCurrent: ?boolean,
  majors: Array<string>,
  minors: Array<string>,
  startDate: ?Date,
  organization: OrganizationEntitySpec
|};

export type OrganizationEntitySpec = {|
  name: string,
  alexaGlobalRank: ?number,
  alexaUSRank: ?number,
  dbas: Array<string>,
  description: ?string,
  emails: Array<EmailEntitySpec>,
  employeeCount: ?string,
  foundingDate: ?Date,
  images: Array<ImageEntitySpec>,
  industries: Array<IndustryEntitySpec>,
  legalName: ?string,
  locations: Array<LocationEntitySpec>,
  marketCap: ?number,
  phoneNumbers: Array<PhoneNumberEntitySpec>,
  products: Array<ProductEntitySpec>,
  raised: ?number,
  socialProfiles: Array<SocialProfileEntitySpec>,
  websites: Array<WebsiteEntitySpec>
|};

export type EmailEntitySpec = {|
  address: ?string,
  domain: ?string,
  emailProvider: ?ProductEntitySpec,
  isPrimary: ?boolean,
  type: ?string
|};

export type PersonNameEntitySpec = {|
  firstName: ?string,
  isPrimary: ?boolean,
  lastName: ?string,
  middleName: ?string,
  prefix: ?string,
  suffix: ?string,
  title: ?string
|};

export type ProductEntitySpec = {|
  name: ?string,
  website: ?WebsiteEntitySpec
|};

export type PhoneNumberEntitySpec = {|
  areaCode: ?string,
  countryCode: ?string,
  extension: ?string,
  number: ?string,
  type: ?string
|};

export type ImageEntitySpec = {|
  sha256: string,
  contentType: string,
  contentLength: number,
  width: number,
  height: number
|};

export type IPAddressEntitySpec = {|
  name: ?string,
  ipAddress: ?string,
  website: ?WebsiteEntitySpec,
  location: ?LocationEntitySpec,
  organization: ?OrganizationEntitySpec,
  asNumber: ?number,
  asOrg: ?OrganizationEntitySpec,
  isp: ?OrganizationEntitySpec
|};

export type LanguageEntitySpec = {|
  name: ?string
|};

export type LocationEntitySpec = {|
  name: ?string,
  continent: ?string,
  country: ?string,
  isPrimary: ?boolean,
  latitude: ?string,
  locality: ?string,
  longitude: ?string,
  poBox: ?string,
  postalCode: ?string,
  region: ?string,
  state: ?string,
  streetAddress: ?string,
  timezone: ?string,
  type: ?string
|};

export type WebsiteEntitySpec = {|
  name: ?string,
  domain: ?string,
  type: ?string,
  url: string
|};

export type IndustryEntitySpec = {|
  name: ?string
|};

export type SocialProfileEntitySpec = {|
  aliases: Array<string>,
  bio: ?string,
  followers: ?number,
  isActive: ?boolean,
  network: ?ProductEntitySpec,
  url: ?string
|};

export type WorkExperienceEntitySpec = {|
  organization: OrganizationEntitySpec,
  roles: Array<WorkRoleEntitySpec>
|};

export type WorkRoleEntitySpec = {|
  title: ?string,
  endDate: ?Date,
  isCurrent: ?boolean,
  startDate: ?Date
|};
