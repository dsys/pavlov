SELECT
  *
FROM
  entity_graph.images
WHERE
  images.id = $1
LIMIT
  1
