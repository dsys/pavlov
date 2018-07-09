/** @flow */

import q from '../db/queries';

import type { QueryContext } from '../db/context';
import type {
  EducationExperienceEntitySpec,
  EmailEntitySpec,
  ImageEntitySpec,
  IPAddressEntitySpec,
  IndustryEntitySpec,
  LanguageEntitySpec,
  LocationEntitySpec,
  OrganizationEntitySpec,
  PersonEntitySpec,
  PersonNameEntitySpec,
  PhoneNumberEntitySpec,
  ProductEntitySpec,
  SocialProfileEntitySpec,
  WebsiteEntitySpec,
  WorkExperienceEntitySpec,
  WorkRoleEntitySpec
} from './specs';
import type {
  EducationExperienceEntityRow,
  EmailEntityRow,
  ImageEntityRow,
  IPAddressEntityRow,
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
  WorkRoleEntityRow
} from '../rows';

export async function insertPersonEntity(
  queryContext: QueryContext,
  personEntitySpec: PersonEntitySpec
): Promise<PersonEntityRow> {
  const personEntityRow = await queryContext.one(
    q.entities.people.insert,
    personEntitySpec
  );

  const relatedEntityPromises = [];

  for (const personNameEntitySpec of personEntitySpec.names) {
    relatedEntityPromises.push(
      insertPersonNameEntity(
        queryContext,
        personNameEntitySpec,
        personEntityRow
      )
    );
  }

  for (const emailEntitySpec of personEntitySpec.emails) {
    relatedEntityPromises.push(
      insertEmailEntityForPerson(queryContext, emailEntitySpec, personEntityRow)
    );
  }

  for (const imageEntitySpec of personEntitySpec.images) {
    relatedEntityPromises.push(
      insertImageEntityForPerson(queryContext, imageEntitySpec, personEntityRow)
    );
  }

  for (const websiteEntitySpec of personEntitySpec.websites) {
    relatedEntityPromises.push(
      insertWebsiteEntityForPerson(
        queryContext,
        websiteEntitySpec,
        personEntityRow
      )
    );
  }

  for (const languageEntitySpec of personEntitySpec.languages) {
    relatedEntityPromises.push(
      insertLanguageEntityForPerson(
        queryContext,
        languageEntitySpec,
        personEntityRow
      )
    );
  }

  for (const phoneNumberEntitySpec of personEntitySpec.phoneNumbers) {
    relatedEntityPromises.push(
      insertPhoneNumberEntityForPerson(
        queryContext,
        phoneNumberEntitySpec,
        personEntityRow
      )
    );
  }

  for (const socialProfileEntitySpec of personEntitySpec.socialProfiles) {
    relatedEntityPromises.push(
      insertSocialProfileEntityForPerson(
        queryContext,
        socialProfileEntitySpec,
        personEntityRow
      )
    );
  }

  for (const locationEntitySpec of personEntitySpec.locations) {
    relatedEntityPromises.push(
      insertLocationEntityForPerson(
        queryContext,
        locationEntitySpec,
        personEntityRow
      )
    );
  }

  for (const workExperienceEntitySpec of personEntitySpec.workExperiences) {
    relatedEntityPromises.push(
      insertWorkExperienceEntity(
        queryContext,
        workExperienceEntitySpec,
        personEntityRow
      )
    );
  }

  for (const educationExperienceEntitySpec of personEntitySpec.educationExperiences) {
    relatedEntityPromises.push(
      insertEducationExperienceEntity(
        queryContext,
        educationExperienceEntitySpec,
        personEntityRow
      )
    );
  }

  await Promise.all(relatedEntityPromises);

  return personEntityRow;
}

export async function insertOrganizationEntity(
  queryContext: QueryContext,
  orgEntitySpec: OrganizationEntitySpec
): Promise<OrganizationEntityRow> {
  const organizationEntityRow = await queryContext.one(
    q.entities.organizations.insert,
    orgEntitySpec
  );

  const relatedEntityPromises = [];

  for (const emailEntitySpec of orgEntitySpec.emails) {
    relatedEntityPromises.push(
      insertEmailEntityForOrganization(
        queryContext,
        emailEntitySpec,
        organizationEntityRow
      )
    );
  }

  for (const imageEntitySpec of orgEntitySpec.images) {
    relatedEntityPromises.push(
      insertImageEntityForOrganization(
        queryContext,
        imageEntitySpec,
        organizationEntityRow
      )
    );
  }

  for (const websiteEntitySpec of orgEntitySpec.websites) {
    relatedEntityPromises.push(
      insertWebsiteEntityForOrganization(
        queryContext,
        websiteEntitySpec,
        organizationEntityRow
      )
    );
  }

  for (const phoneNumberEntitySpec of orgEntitySpec.phoneNumbers) {
    relatedEntityPromises.push(
      insertPhoneNumberEntityForOrganization(
        queryContext,
        phoneNumberEntitySpec,
        organizationEntityRow
      )
    );
  }

  for (const socialProfileEntitySpec of orgEntitySpec.socialProfiles) {
    relatedEntityPromises.push(
      insertSocialProfileEntityForOrganization(
        queryContext,
        socialProfileEntitySpec,
        organizationEntityRow
      )
    );
  }

  for (const locationEntitySpec of orgEntitySpec.locations) {
    relatedEntityPromises.push(
      insertLocationEntityForOrganization(
        queryContext,
        locationEntitySpec,
        organizationEntityRow
      )
    );
  }

  for (const industryEntitySpec of orgEntitySpec.industries) {
    relatedEntityPromises.push(
      insertIndustryEntityForOrganization(
        queryContext,
        industryEntitySpec,
        organizationEntityRow
      )
    );
  }

  await Promise.all(relatedEntityPromises);

  return organizationEntityRow;
}

export function insertPersonNameEntity(
  queryContext: QueryContext,
  personNameEntitySpec: PersonNameEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<PersonNameEntityRow> {
  return queryContext.one(q.entities.personNames.insert, {
    ...personNameEntitySpec,
    personId: personEntityRow.id
  });
}

export function insertEmailEntity(
  queryContext: QueryContext,
  emailEntitySpec: EmailEntitySpec
): Promise<EmailEntityRow> {
  return queryContext.one(q.entities.emails.insert, {
    ...emailEntitySpec,
    emailProviderId: null // TODO
  });
}

export async function insertEmailEntityForPerson(
  queryContext: QueryContext,
  emailEntitySpec: EmailEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<EmailEntityRow> {
  const emailEntityRow = await insertEmailEntity(queryContext, emailEntitySpec);

  await queryContext.one(q.entities.emails.insertJoinPeople, {
    emailId: emailEntityRow.id,
    personId: personEntityRow.id
  });

  return emailEntityRow;
}

export async function insertEmailEntityForOrganization(
  queryContext: QueryContext,
  emailEntitySpec: EmailEntitySpec,
  organizationEntityRow: OrganizationEntityRow
): Promise<EmailEntityRow> {
  const emailEntityRow = await insertEmailEntity(queryContext, emailEntitySpec);

  await queryContext.one(q.entities.emails.insertJoinOrganizations, {
    emailId: emailEntityRow.id,
    organizationId: organizationEntityRow.id
  });

  return emailEntityRow;
}

export async function insertImageEntity(
  queryContext: QueryContext,
  imageEntitySpec: ImageEntitySpec
): Promise<?ImageEntityRow> {
  return queryContext.one(q.entities.images.insert, imageEntitySpec);
}

export async function insertImageEntityForPerson(
  queryContext: QueryContext,
  imageEntitySpec: ImageEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<ImageEntityRow> {
  const imageEntityRow = await insertImageEntity(queryContext, imageEntitySpec);

  await queryContext.one(q.entities.images.insertJoinPeople, {
    imageId: imageEntityRow.id,
    personId: personEntityRow.id
  });

  return imageEntityRow;
}

export async function insertImageEntityForOrganization(
  queryContext: QueryContext,
  imageEntitySpec: ImageEntitySpec,
  organizationEntityRow: OrganizationEntityRow
): Promise<ImageEntityRow> {
  const imageEntityRow = await insertImageEntity(queryContext, imageEntitySpec);

  await queryContext.one(q.entities.images.insertJoinOrganizations, {
    imageId: imageEntityRow.id,
    organizationId: organizationEntityRow.id
  });

  return imageEntityRow;
}

export async function insertIPAddressEntity(
  queryContext: QueryContext,
  ipAddressEntitySpec: IPAddressEntitySpec
): Promise<IPAddressEntityRow> {
  if (ipAddressEntitySpec.website) {
    const website = await insertWebsiteEntity(
      queryContext,
      ipAddressEntitySpec.website
    );
    ipAddressEntitySpec.website = website.id;
  }

  if (ipAddressEntitySpec.location) {
    const location = await insertLocationEntity(
      queryContext,
      ipAddressEntitySpec.location
    );
    ipAddressEntitySpec.location = location.id;
  }

  if (ipAddressEntitySpec.organization) {
    const organization = await insertOrganizationEntity(
      queryContext,
      ipAddressEntitySpec.organization
    );
    ipAddressEntitySpec.organization = organization.id;
  }

  if (ipAddressEntitySpec.asOrg) {
    const asOrg = await insertOrganizationEntity(
      queryContext,
      ipAddressEntitySpec.asOrg
    );
    ipAddressEntitySpec.asOrg = asOrg.id;
  }

  if (ipAddressEntitySpec.isp) {
    const isp = await insertOrganizationEntity(
      queryContext,
      ipAddressEntitySpec.isp
    );
    ipAddressEntitySpec.isp = isp.id;
  }

  const ipAddressEntityRow = await queryContext.one(
    q.entities.ipAddress.insert,
    ipAddressEntitySpec
  );

  return ipAddressEntityRow;
}

export function insertWebsiteEntity(
  queryContext: QueryContext,
  websiteEntitySpec: WebsiteEntitySpec
): Promise<WebsiteEntityRow> {
  return queryContext.one(q.entities.websites.insert, websiteEntitySpec);
}

export async function insertWebsiteEntityForPerson(
  queryContext: QueryContext,
  websiteEntitySpec: WebsiteEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<WebsiteEntityRow> {
  const websiteEntityRow = await insertWebsiteEntity(
    queryContext,
    websiteEntitySpec
  );

  await queryContext.one(q.entities.websites.insertJoinPeople, {
    personId: personEntityRow.id,
    websiteId: websiteEntityRow.id
  });

  return websiteEntityRow;
}

export async function insertWebsiteEntityForOrganization(
  queryContext: QueryContext,
  websiteEntitySpec: WebsiteEntitySpec,
  organizationEntityRow: OrganizationEntityRow
): Promise<WebsiteEntityRow> {
  const websiteEntityRow = await insertWebsiteEntity(
    queryContext,
    websiteEntitySpec
  );

  await queryContext.one(q.entities.websites.insertJoinOrganizations, {
    organizationId: organizationEntityRow.id,
    websiteId: websiteEntityRow.id
  });

  return websiteEntityRow;
}

export function insertLanguageEntity(
  queryContext: QueryContext,
  languageEntitySpec: LanguageEntitySpec
): Promise<LanguageEntityRow> {
  return queryContext.one(q.entities.languages.insert, languageEntitySpec);
}

export async function insertLanguageEntityForPerson(
  queryContext: QueryContext,
  languageEntitySpec: LanguageEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<LanguageEntityRow> {
  const languageEntityRow = await insertLanguageEntity(
    queryContext,
    languageEntitySpec
  );

  await queryContext.one(q.entities.languages.insertJoinPeople, {
    personId: personEntityRow.id,
    languageId: languageEntityRow.id
  });

  return languageEntityRow;
}

export function insertPhoneNumberEntity(
  queryContext: QueryContext,
  phoneNumberEntitySpec: PhoneNumberEntitySpec
): Promise<PhoneNumberEntityRow> {
  return queryContext.one(
    q.entities.phoneNumbers.insert,
    phoneNumberEntitySpec
  );
}

export async function insertPhoneNumberEntityForPerson(
  queryContext: QueryContext,
  phoneNumberEntitySpec: PhoneNumberEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<PhoneNumberEntityRow> {
  const phoneNumberEntityRow = await insertPhoneNumberEntity(
    queryContext,
    phoneNumberEntitySpec
  );

  await queryContext.one(q.entities.phoneNumbers.insertJoinPeople, {
    personId: personEntityRow.id,
    phoneNumberId: phoneNumberEntityRow.id
  });

  return phoneNumberEntityRow;
}

export async function insertPhoneNumberEntityForOrganization(
  queryContext: QueryContext,
  phoneNumberEntitySpec: PhoneNumberEntitySpec,
  organizationEntityRow: OrganizationEntityRow
): Promise<PhoneNumberEntityRow> {
  const phoneNumberEntityRow = await insertPhoneNumberEntity(
    queryContext,
    phoneNumberEntitySpec
  );

  await queryContext.one(q.entities.phoneNumbers.insertJoinOrganizations, {
    organizationId: organizationEntityRow.id,
    phoneNumberId: phoneNumberEntityRow.id
  });

  return phoneNumberEntityRow;
}

export async function insertSocialProfileEntity(
  queryContext: QueryContext,
  socialProfileEntitySpec: SocialProfileEntitySpec
): Promise<SocialProfileEntityRow> {
  const productEntityRow = socialProfileEntitySpec.network
    ? await insertProductEntity(queryContext, socialProfileEntitySpec.network)
    : null;

  return queryContext.one(q.entities.socialProfiles.insert, {
    ...socialProfileEntitySpec,
    networkId: productEntityRow ? productEntityRow.id : null
  });
}

export async function insertSocialProfileEntityForPerson(
  queryContext: QueryContext,
  socialProfileEntitySpec: SocialProfileEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<SocialProfileEntityRow> {
  const socialProfileEntityRow = await insertSocialProfileEntity(
    queryContext,
    socialProfileEntitySpec
  );

  await queryContext.one(q.entities.socialProfiles.insertJoinPeople, {
    personId: personEntityRow.id,
    socialProfileId: socialProfileEntityRow.id
  });

  return socialProfileEntityRow;
}

export async function insertSocialProfileEntityForOrganization(
  queryContext: QueryContext,
  socialProfileEntitySpec: SocialProfileEntitySpec,
  organizationEntityRow: OrganizationEntityRow
): Promise<SocialProfileEntityRow> {
  const socialProfileEntityRow = await insertSocialProfileEntity(
    queryContext,
    socialProfileEntitySpec
  );

  await queryContext.one(q.entities.socialProfiles.insertJoinOrganizations, {
    organizationId: organizationEntityRow.id,
    socialProfileId: socialProfileEntityRow.id
  });

  return socialProfileEntityRow;
}

export function insertLocationEntity(
  queryContext: QueryContext,
  locationEntitySpec: LocationEntitySpec
): Promise<LocationEntityRow> {
  return queryContext.one(q.entities.locations.insert, locationEntitySpec);
}

export async function insertLocationEntityForPerson(
  queryContext: QueryContext,
  locationEntitySpec: LocationEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<LocationEntityRow> {
  const locationEntityRow = await insertLocationEntity(
    queryContext,
    locationEntitySpec
  );

  await queryContext.one(q.entities.locations.insertJoinPeople, {
    locationId: locationEntityRow.id,
    personId: personEntityRow.id
  });

  return locationEntityRow;
}

export async function insertLocationEntityForOrganization(
  queryContext: QueryContext,
  locationEntitySpec: LocationEntitySpec,
  organizationEntityRow: OrganizationEntityRow
): Promise<LocationEntityRow> {
  const locationEntityRow = await insertLocationEntity(
    queryContext,
    locationEntitySpec
  );

  await queryContext.one(q.entities.locations.insertJoinOrganizations, {
    locationId: locationEntityRow.id,
    organizationId: organizationEntityRow.id
  });

  return locationEntityRow;
}

export async function insertWorkExperienceEntity(
  queryContext: QueryContext,
  workExperienceEntitySpec: WorkExperienceEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<WorkExperienceEntityRow> {
  const organizationEntityRow = await insertOrganizationEntity(
    queryContext,
    workExperienceEntitySpec.organization
  );

  const workExperienceEntityRow = await queryContext.one(
    q.entities.workExperiences.insert,
    {
      ...workExperienceEntitySpec,
      organizationId: organizationEntityRow.id,
      personId: personEntityRow.id
    }
  );

  for (const workRoleEntitySpec of workExperienceEntitySpec.roles) {
    await insertWorkRoleEntity(
      queryContext,
      workRoleEntitySpec,
      workExperienceEntityRow
    );
  }

  return workExperienceEntityRow;
}

export function insertWorkRoleEntity(
  queryContext: QueryContext,
  workRoleEntitySpec: WorkRoleEntitySpec,
  workExperienceEntityRow: WorkExperienceEntityRow
): Promise<WorkRoleEntityRow> {
  return queryContext.one(q.entities.workRoles.insert, {
    ...workRoleEntitySpec,
    workExperienceId: workExperienceEntityRow.id
  });
}

export async function insertEducationExperienceEntity(
  queryContext: QueryContext,
  educationExperienceEntitySpec: EducationExperienceEntitySpec,
  personEntityRow: PersonEntityRow
): Promise<EducationExperienceEntityRow> {
  const organizationEntityRow = await insertOrganizationEntity(
    queryContext,
    educationExperienceEntitySpec.organization
  );

  return queryContext.one(q.entities.educationExperiences.insert, {
    ...educationExperienceEntitySpec,
    personId: personEntityRow.id,
    organizationId: organizationEntityRow.id
  });
}

export function insertIndustryEntity(
  queryContext: QueryContext,
  industryEntitySpec: IndustryEntitySpec
): Promise<IndustryEntityRow> {
  return queryContext.one(q.entities.industries.insert, industryEntitySpec);
}

export async function insertIndustryEntityForOrganization(
  queryContext: QueryContext,
  industryEntitySpec: IndustryEntitySpec,
  organizationEntityRow: OrganizationEntityRow
): Promise<IndustryEntityRow> {
  const industryEntityRow = await insertIndustryEntity(
    queryContext,
    industryEntitySpec
  );

  await queryContext.one(q.entities.industries.insertJoinOrganizations, {
    organizationId: organizationEntityRow.id,
    industryId: industryEntityRow.id
  });

  return industryEntityRow;
}

export function insertProductEntity(
  queryContext: QueryContext,
  productEntitySpec: ProductEntitySpec
): Promise<ProductEntityRow> {
  return queryContext.one(q.entities.products.insert, productEntitySpec);
}
