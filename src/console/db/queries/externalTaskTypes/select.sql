SELECT
  *
FROM
  storage.external_task_types
WHERE
  id = $1
LIMIT
  1
