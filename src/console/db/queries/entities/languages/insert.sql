INSERT INTO
  entity_graph.languages (
    name
  )
VALUES
  (
    ${name}
  )
ON CONFLICT ON CONSTRAINT languages_name_unique DO UPDATE SET
  name = ${name}
RETURNING
  *
