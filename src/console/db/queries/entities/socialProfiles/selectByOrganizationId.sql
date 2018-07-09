SELECT
  social_profiles.*
FROM
  entity_graph.social_profiles,
  entity_graph.organizations_social_profiles
WHERE
  organizations_social_profiles.organization_id = $1
AND
  organizations_social_profiles.social_profile_id = social_profiles.id
