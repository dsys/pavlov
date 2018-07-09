SELECT
  *
FROM
  entity_graph.ip_addresses
WHERE
  ip_addresses.id = $1
LIMIT
  1