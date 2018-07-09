INSERT INTO
  entity_graph.locations_people (
    location_id,
    person_id
  )
VALUES
  (
    ${locationId},
    ${personId}
  )
RETURNING
  *
