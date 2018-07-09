INSERT INTO
  entity_graph.people_websites (
    website_id,
    person_id
  )
VALUES
  (
    ${websiteId},
    ${personId}
  )
RETURNING
  *
