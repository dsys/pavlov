SELECT
  *
FROM
  entity_graph.emails
WHERE
  emails.address = $1
LIMIT
  1
