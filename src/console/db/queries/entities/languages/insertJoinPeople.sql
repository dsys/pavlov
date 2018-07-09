INSERT INTO
  entity_graph.languages_people (
    language_id,
    person_id
  )
VALUES
  (
    ${languageId},
    ${personId}
  )
RETURNING
  *
