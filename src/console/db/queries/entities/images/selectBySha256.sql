SELECT
  *
FROM
  entity_graph.images
WHERE
  sha256 = $1
LIMIT
  1
