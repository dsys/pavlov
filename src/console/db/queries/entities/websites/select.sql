SELECT
  websites.*
FROM
  entity_graph.websites
WHERE
  websites.id = $1
