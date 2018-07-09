SELECT
  *
FROM
  entity_graph.emails
WHERE
  emails.id = $1
LIMIT
  1
