INSERT INTO
  entity_graph.people_social_profiles (
    person_id,
    social_profile_id
  )
VALUES
  (
    ${personId},
    ${socialProfileId}
  )
RETURNING
  *
