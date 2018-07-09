SELECT
  *
FROM
  entity_graph.ip_addresses
WHERE
  ip_addresses.ip_address = $1
LIMIT
  1