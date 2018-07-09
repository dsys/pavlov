SELECT
  locations.*
FROM
  entity_graph.locations
WHERE
  locations.id = $1