/** @flow */

export type DatabaseRow = {|
  id: string,
  name: string,
  created_at: Date,
  updated_at: Date
|};

export type WorkflowRow = {|
  id: string,
  name: string,
  function_url: string,
  function_data_query: string,
  update_data_query: string,
  possible_labels: Array<string>,
  inbox_labels: Array<string>,
  drawer_labels: Array<string>,
  icon: string,
  icon_image_id: ?string,
  created_at: Date,
  updated_at: Date
|};

export type TargetRow = {|
  id: string,
  workflow_id: string,
  database_id: string,
  actor_id: ?string,
  image_id: ?string,
  ip_address_id: ?string,
  display: ?string,
  label: string,
  score: ?number,
  reasons: Array<string>,
  state: ?Object,
  aliases: ?Array<string>,
  environment: string,
  key: Object,
  created_at: Date,
  updated_at: Date
|};

export type WorkflowSettingsRow = {|
  id: string,
  workflow_id: string,
  database_id: string,
  environment: string,
  run_token: string,
  update_webhook_url: ?string,
  update_webhook_secret: string,
  created_at: Date,
  updated_at: Date
|};

export type DecisionRow = {|
  id: string,
  database_id: string,
  target_id: string,
  label: string,
  score: number,
  reasons: Array<string>,
  metadata: any,
  external_task_id: ?string,
  user_id: ?string,
  created_at: Date
|};

export type ExternalTaskTypeRow = {|
  id: string,
  workflow_id: string,
  service: string,
  title: string,
  description: string,
  instructions: string,
  example_groups: Array<Object>,
  create_labels: Array<string>,
  decision_labels: Array<string>,
  reward: string,
  keywords: Array<string>,
  assignment_duration: number,
  autoapproval_delay: number,
  lifetime: number,
  max_assignments: number,
  created_at: Date,
  updated_at: Date
|};

export type ExternalTaskRow = {|
  id: string,
  database_id: string,
  type_id: string,
  target_id: string,
  created_at: Date,
  updated_at: Date
|};

export type UpdateRow = {|
  id: string,
  target_id: string,
  database_id: string,
  event: string,
  args: Object,
  label: string,
  score: ?number,
  reasons: Array<string>,
  state: ?Object,
  aliases: ?Array<string>,
  webhook_status: ?number,
  webhook_at: ?Date,
  created_at: Date
|};

export type ActorRow = {|
  id: string,
  lookup_fields: { [string]: string },
  email_id: ?string,
  ip_address_id: ?string,
  person_id: ?string,
  phone_number_id: ?string,
  database_id: string
|};

export type PersonEntityRow = {|
  id: string,
  date_of_birth: ?Date,
  gender: ?string,
  interests: Array<string>,
  skills: Array<string>,
  created_at: Date,
  updated_at: Date
|};

export type PersonNameEntityRow = {|
  id: string,
  first_name: ?string,
  is_primary: ?boolean,
  last_name: ?string,
  middle_name: ?string,
  person_id: string,
  prefix: ?string,
  suffix: ?string,
  title: ?string,
  created_at: Date,
  updated_at: Date
|};

export type EmailEntityRow = {|
  id: string,
  address: string,
  domain: ?string,
  email_provider_id: ?string,
  is_primary: ?boolean,
  type: ?string,
  created_at: Date,
  updated_at: Date
|};

export type ImageEntityRow = {|
  id: string,
  sha256: string,
  content_length: number,
  content_type: string,
  width: number,
  height: number,
  created_at: Date,
  updated_at: Date
|};

export type IPAddressEntityRow = {|
  id: string,
  ip_address: string,
  website_id: ?string,
  location_id: ?string,
  organization_id: ?string,
  isp_id: ?string,
  created_at: Date,
  updated_at: Date
|};

export type SocialProfileEntityRow = {|
  id: string,
  aliases: Array<string>,
  bio: ?string,
  followers: ?number,
  is_active: ?boolean,
  network_id: ?string,
  url: ?string,
  created_at: Date,
  updated_at: Date
|};

export type LanguageEntityRow = {|
  id: string,
  name: string,
  created_at: Date,
  updated_at: Date
|};

export type IndustryEntityRow = {|
  id: string,
  name: string,
  created_at: Date,
  updated_at: Date
|};

export type PhoneNumberEntityRow = {|
  id: string,
  area_code: ?string,
  country_code: ?string,
  extension: ?string,
  number: string,
  type: ?string,
  created_at: Date,
  updated_at: Date
|};

export type WebsiteEntityRow = {|
  id: string,
  name: ?string,
  domain: ?string,
  type: ?string,
  url: string,
  created_at: Date,
  updated_at: Date
|};

export type LocationEntityRow = {|
  id: string,
  name: ?string,
  continent: ?string,
  country: ?string,
  is_primary: ?boolean,
  latitude: ?string,
  longitude: ?string,
  po_box: ?string,
  postal_code: ?string,
  region: ?string,
  state: ?string,
  street_address: ?string,
  timezone: ?string,
  type: ?string,
  created_at: Date,
  updated_at: Date
|};

export type ProductEntityRow = {|
  id: string,
  name: string,
  website_id: ?string,
  created_at: Date,
  updated_at: Date
|};

export type OrganizationEntityRow = {|
  id: string,
  name: string,
  dbas: Array<string>,
  alexa_global_rank: ?number,
  alexa_us_rank: ?number,
  description: ?string,
  employee_count: ?string,
  founding_date: ?Date,
  legal_name: ?string,
  market_cap: ?number,
  raised: ?number,
  created_at: Date,
  updated_at: Date
|};

export type EducationExperienceEntityRow = {|
  id: string,
  degrees: Array<string>,
  end_date: ?Date,
  is_current: ?boolean,
  majors: Array<string>,
  minors: Array<string>,
  organization_id: string,
  person_id: string,
  start_date: ?Date,
  created_at: Date,
  updated_at: Date
|};

export type WorkExperienceEntityRow = {|
  id: string,
  organization_id: string,
  person_id: string,
  created_at: Date,
  updated_at: Date
|};

export type WorkRoleEntityRow = {|
  id: string,
  title: string,
  end_date: ?Date,
  is_current: ?boolean,
  start_date: ?Date,
  work_experience_id: string,
  created_at: Date,
  updated_at: Date
|};
