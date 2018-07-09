SELECT
  *
FROM
  storage.external_tasks
WHERE
  id = $1
LIMIT
  1
