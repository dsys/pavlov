INSERT INTO
  entity_graph.emails_people (
    email_id,
    person_id
  )
VALUES
  (
    ${emailId},
    ${personId}
  )
RETURNING
  *
