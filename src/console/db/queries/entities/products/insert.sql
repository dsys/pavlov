INSERT INTO
  entity_graph.products (
    name
  )
VALUES
  (
    ${name}
  )
ON CONFLICT ON CONSTRAINT products_name_unique DO UPDATE SET
  name = ${name}
RETURNING
  *
