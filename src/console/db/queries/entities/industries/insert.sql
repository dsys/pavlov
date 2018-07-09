INSERT INTO
  entity_graph.industries (
    name
  )
VALUES
  (
    ${name}
  )
ON CONFLICT ON CONSTRAINT industries_name_unique DO UPDATE SET
  name = ${name}
RETURNING
  *
