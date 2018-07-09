SELECT
  *
FROM
  storage.external_task_types
WHERE
  workflow_id = $1
