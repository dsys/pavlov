SELECT
  *
FROM
  entity_graph.phone_numbers
WHERE
  phone_numbers.id = $1
LIMIT
  1
