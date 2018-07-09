INSERT INTO
  entity_graph.people_phone_numbers (
    person_id,
    phone_number_id
  )
VALUES
  (
    ${personId},
    ${phoneNumberId}
  )
RETURNING
  *
