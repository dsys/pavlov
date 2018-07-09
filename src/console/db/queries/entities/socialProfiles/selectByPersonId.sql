SELECT
  social_profiles.*
FROM
  entity_graph.social_profiles,
  entity_graph.people_social_profiles
WHERE
  people_social_profiles.person_id = $1
AND
  people_social_profiles.social_profile_id = social_profiles.id
