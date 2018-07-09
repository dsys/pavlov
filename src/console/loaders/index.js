/** @flow */

import DataLoader from 'dataloader';
import createManyOrNoneLoader from './createManyOrNoneLoader';
import createOneOrNoneLoader from './createOneOrNoneLoader';
import q from '../db/queries';
import removeDashes from '../utils/removeDashes';
import { decodeIdOfType } from '../identifiers.js';

import type { QueryContext } from '../db/context';
import type { IdentifierType } from '../identifiers';
import type {
  ActorRow,
  DatabaseRow,
  DecisionRow,
  EducationExperienceEntityRow,
  EmailEntityRow,
  IPAddressEntityRow,
  ImageEntityRow,
  IndustryEntityRow,
  LanguageEntityRow,
  LocationEntityRow,
  OrganizationEntityRow,
  PersonEntityRow,
  PersonNameEntityRow,
  PhoneNumberEntityRow,
  ProductEntityRow,
  SocialProfileEntityRow,
  WebsiteEntityRow,
  WorkExperienceEntityRow,
  WorkRoleEntityRow,
  WorkflowRow,
  TargetRow,
  WorkflowSettingsRow
} from '../rows';

// prettier-ignore
export type Loaders = {|
  queryContext: QueryContext,
  actor: DataLoader<string, ?ActorRow>,
  allWorkflows: DataLoader<string, Array<WorkflowRow>>,
  decision: DataLoader<string, ?DecisionRow>,
  decisionsByTargetId: DataLoader<string, Array<DecisionRow>>,
  update: DataLoader<string, ?UpdateRow>,
  updatesByTargetId: DataLoader<string, Array<UpdateRow>>,
  defaultDatabase: DataLoader<number, ?DatabaseRow>,
  database: DataLoader<string, ?DatabaseRow>,
  educationExperiencesByPersonId: DataLoader<string, Array<EducationExperienceEntityRow>>,
  email: DataLoader<string, ?EmailEntityRow>,
  emailByAddress: DataLoader<string, ?EmailEntityRow>,
  emailsByOrganizationId: DataLoader<string, Array<EmailEntityRow>>,
  emailsByPersonId: DataLoader<string, Array<EmailEntityRow>>,
  image: DataLoader<string, ?ImageEntityRow>,
  imagesByOrganizationId: DataLoader<string, Array<ImageEntityRow>>,
  imagesByPersonId: DataLoader<string, Array<ImageEntityRow>>,
  imageBySha256: DataLoader<string, ?ImageEntityRow>,
  industriesByOrganizationId: DataLoader<string, Array<IndustryEntityRow>>,
  ipAddress: DataLoader<string, ?IPAddressEntityRow>,
  ipAddressByAddress: DataLoader<string, ?IPAddressEntityRow>,
  languagesByPersonId: DataLoader<string, Array<LanguageEntityRow>>,
  location: DataLoader<string, ?LocationEntityRow>,
  locations: DataLoader<string, Array<LocationEntityRow>>,
  locationsByOrganizationId: DataLoader<string, Array<LocationEntityRow>>,
  locationsByPersonId: DataLoader<string, Array<LocationEntityRow>>,
  organization: DataLoader<string, OrganizationEntityRow>,
  peopleByEmail: DataLoader<string, Array<PersonEntityRow>>,
  peopleByPhoneNumber: DataLoader<string, Array<PersonEntityRow>>,
  person: DataLoader<string, PersonEntityRow>,
  personNamesByPersonId: DataLoader<string, Array<PersonNameEntityRow>>,
  phoneNumber: DataLoader<string, ?PhoneNumberEntityRow>,
  phoneNumberByNumber: DataLoader<string, ?PhoneNumberEntityRow>,
  phoneNumbersByOrganizationId: DataLoader<string, Array<PhoneNumberEntityRow>>,
  phoneNumbersByPersonId: DataLoader<string, Array<PhoneNumberEntityRow>>,
  product: DataLoader<string, ProductEntityRow>,
  socialProfilesByOrganizationId: DataLoader<string, Array<SocialProfileEntityRow>>,
  socialProfilesByPersonId: DataLoader<string, Array<SocialProfileEntityRow>>,
  website: DataLoader<string, WebsiteEntityRow>,
  websitesByOrganizationId: DataLoader<string, Array<WebsiteEntityRow>>,
  websitesByPersonId: DataLoader<string, Array<WebsiteEntityRow>>,
  workExperience: DataLoader<string, WorkExperienceEntityRow>,
  workExperiencesByPersonId: DataLoader<string, Array<WorkExperienceEntityRow>>,
  workRolesByWorkExperienceId: DataLoader<string, Array<WorkRoleEntityRow>>,
  workflow: DataLoader<string, ?WorkflowRow>,
  workflowByName: DataLoader<string, ?WorkflowRow>,
  target: DataLoader<string, ?TargetRow>,
  targetsByImage: DataLoader<{ databaseId: string, workflowId: string, environment: string, imageId: string }, Array<TargetRow>>,
  workflowSettings: DataLoader<{ databaseId: string, workflowId: string, environment: string }, ?WorkflowSettingsRow>,
  searchTargets: DataLoader<{ databaseId: string, workflowId: string, environment: string, labels: Array<string>, ids: Array<string>, aliases: Array<string> }, Array<TargetRow>>,
  externalTask: DataLoader<string, ?ExternalTaskRow>,
  externalTaskType: DataLoader<string, ?ExternalTaskTypeRow>,
  externalTaskTypesByWorkflowId: DataLoader<string, Array<ExternalTaskTypeRow>>,
  externalTasksByTargetId: DataLoader<string, Array<ExternalTaskRow>>,
  externalTaskAuthTokenByExternalTask: DataLoader<string, ExternalTaskAuthToken>
|};

function createIdLoader<Row>(
  queryContext: QueryContext,
  type: IdentifierType,
  table: string,
  field: string = 'id'
): DataLoader<string, ?Row> {
  return new DataLoader(async ids => {
    const uuids = ids.map(id => decodeIdOfType(type, id));
    const list = uuids.map(d => `'${d}'`).join(', ');
    const rows = await queryContext.manyOrNone(
      `SELECT * FROM ${table} WHERE ${field} IN (${list})`
    );

    for (const r of rows) {
      r[field] = removeDashes(r[field]);
    }

    return uuids.map(u => rows.find(r => r[field] === u) || null);
  });
}

function createArrayIdLoader<Row>(
  queryContext: QueryContext,
  type: IdentifierType,
  table: string,
  field: string = 'id'
): DataLoader<string, Array<Row>> {
  return new DataLoader(async ids => {
    const uuids = ids.map(id => decodeIdOfType(type, id));
    const list = uuids.map(d => `'${d}'`).join(', ');
    const rows = await queryContext.manyOrNone(
      `SELECT * FROM ${table} WHERE ${field} IN (${list})`
    );

    for (const r of rows) {
      r[field] = removeDashes(r[field]);
    }

    return uuids.map(u => rows.filter(r => r[field] === u));
  });
}

export function createLoaders(queryContext: QueryContext): Loaders {
  return {
    queryContext,
    database: createIdLoader(queryContext, 'DBX', 'storage.databases'),
    workflow: createIdLoader(queryContext, 'WRK', 'storage.workflows'),
    target: createIdLoader(queryContext, 'TRG', 'storage.targets'),
    update: createIdLoader(queryContext, 'UPD', 'storage.updates'),
    decision: createIdLoader(queryContext, 'DEC', 'storage.decisions'),
    externalTask: createIdLoader(queryContext, 'EXT', 'storage.external_tasks'),
    actor: createIdLoader(queryContext, 'ACT', 'storage.actors'),
    person: createIdLoader(queryContext, 'PER', 'entity_graph.people'),
    email: createIdLoader(queryContext, 'EML', 'entity_graph.emails'),
    image: createIdLoader(queryContext, 'IMG', 'entity_graph.images'),
    workExperience: createIdLoader(
      queryContext,
      'WKX',
      'entity_graph.work_experiences'
    ),
    location: createIdLoader(queryContext, 'LOC', 'entity_graph.locations'),
    organization: createIdLoader(
      queryContext,
      'ORG',
      'entity_graph.organizations'
    ),
    product: createIdLoader(queryContext, 'PRD', 'entity_graph.products'),
    phoneNumber: createIdLoader(
      queryContext,
      'PHN',
      'entity_graph.phone_numbers'
    ),
    ipAddress: createIdLoader(queryContext, 'IPA', 'entity_graph.ip_addresses'),
    externalTasksByTargetId: createArrayIdLoader(
      queryContext,
      'TRG',
      'storage.external_tasks',
      'target_id'
    ),
    externalTaskAuthTokenByExternalTask: createIdLoader(
      queryContext,
      'EXT',
      'storage.external_task_auth_tokens',
      'external_task_id'
    ),
    ipAddressByAddress: createOneOrNoneLoader(
      queryContext,
      `SELECT * FROM entity_graph.ip_addresses WHERE ip_address = $1;`
    ),
    targetsByImage: createManyOrNoneLoader(
      queryContext,
      `SELECT * FROM storage.targets WHERE database_id = $(databaseId) AND workflow_id = $(workflowId) AND environment = $(environment) AND image_id = $(imageId);`
    ),
    defaultDatabase: createOneOrNoneLoader(
      queryContext,
      q.databases.selectDefault
    ),
    allWorkflows: createManyOrNoneLoader(queryContext, q.workflows.selectAll),
    peopleByEmail: createManyOrNoneLoader(
      queryContext,
      q.entities.people.selectByEmail
    ),
    peopleByPhoneNumber: createManyOrNoneLoader(
      queryContext,
      q.entities.people.selectByPhoneNumber
    ),
    personNamesByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.personNames.selectByPersonId
    ),
    emailsByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.emails.selectByPersonId
    ),
    emailByAddress: createOneOrNoneLoader(
      queryContext,
      q.entities.emails.selectByAddress
    ),
    imageBySha256: createOneOrNoneLoader(
      queryContext,
      q.entities.images.selectBySha256
    ),
    imagesByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.images.selectByPersonId
    ),
    socialProfilesByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.socialProfiles.selectByPersonId
    ),
    languagesByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.languages.selectByPersonId
    ),
    educationExperiencesByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.educationExperiences.selectByPersonId
    ),
    workExperiencesByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.workExperiences.selectByPersonId
    ),
    locations: createManyOrNoneLoader(
      queryContext,
      q.entities.locations.select
    ),
    locationsByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.locations.selectByPersonId
    ),
    phoneNumbersByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.phoneNumbers.selectByPersonId
    ),
    workflowByName: createOneOrNoneLoader(
      queryContext,
      q.workflows.selectByName
    ),
    searchTargets: createManyOrNoneLoader(queryContext, q.targets.search),
    website: createOneOrNoneLoader(queryContext, q.entities.websites.select),
    workflowSettings: createOneOrNoneLoader(
      queryContext,
      q.workflowSettings.upsert
    ),
    websitesByPersonId: createManyOrNoneLoader(
      queryContext,
      q.entities.websites.selectByPersonId
    ),
    workRolesByWorkExperienceId: createManyOrNoneLoader(
      queryContext,
      q.entities.workRoles.selectByWorkExperienceId
    ),
    imagesByOrganizationId: createManyOrNoneLoader(
      queryContext,
      q.entities.images.selectByOrganizationId
    ),
    emailsByOrganizationId: createManyOrNoneLoader(
      queryContext,
      q.entities.emails.selectByOrganizationId
    ),
    socialProfilesByOrganizationId: createManyOrNoneLoader(
      queryContext,
      q.entities.socialProfiles.selectByOrganizationId
    ),
    locationsByOrganizationId: createManyOrNoneLoader(
      queryContext,
      q.entities.locations.selectByOrganizationId
    ),
    phoneNumberByNumber: createOneOrNoneLoader(
      queryContext,
      q.entities.phoneNumbers.selectByNumber
    ),
    phoneNumbersByOrganizationId: createManyOrNoneLoader(
      queryContext,
      q.entities.phoneNumbers.selectByOrganizationId
    ),
    websitesByOrganizationId: createManyOrNoneLoader(
      queryContext,
      q.entities.websites.selectByOrganizationId
    ),
    industriesByOrganizationId: createManyOrNoneLoader(
      queryContext,
      q.entities.industries.selectByOrganizationId
    ),
    decisionsByTargetId: createManyOrNoneLoader(
      queryContext,
      q.decisions.selectByTargetId
    ),
    updatesByTargetId: createManyOrNoneLoader(
      queryContext,
      q.updates.selectByTargetId
    ),
    externalTaskType: createOneOrNoneLoader(
      queryContext,
      q.externalTaskTypes.select
    ),
    externalTaskTypesByWorkflowId: createManyOrNoneLoader(
      queryContext,
      q.externalTaskTypes.selectByWorkflowId
    ),
    workflowHistogram: createManyOrNoneLoader(
      queryContext,
      `SELECT date_trunc('day', updated_at) AS time, label, count(1) FROM storage.targets WHERE database_id = $(databaseId) AND workflow_id = $(workflowId) AND environment = $(environment) AND updated_at > now() - interval '$(days:value) days' GROUP BY label, date_trunc('day', updated_at);`
    )
  };
}
