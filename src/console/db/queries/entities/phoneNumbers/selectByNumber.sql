SELECT
  *
FROM
  entity_graph.phone_numbers
WHERE
  phone_numbers.number = $1
LIMIT
  1
