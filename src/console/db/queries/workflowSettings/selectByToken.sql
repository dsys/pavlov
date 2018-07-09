SELECT
  *
FROM
  storage.workflow_settings
WHERE
  run_token = $1
LIMIT
  1
