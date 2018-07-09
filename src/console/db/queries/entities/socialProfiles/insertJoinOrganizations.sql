INSERT INTO
  entity_graph.organizations_social_profiles (
    organization_id,
    social_profile_id
  )
VALUES
  (
    ${organizationId},
    ${socialProfileId}
  )
RETURNING
  *
