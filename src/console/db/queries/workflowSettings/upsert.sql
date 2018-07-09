INSERT INTO
  storage.workflow_settings (
    database_id,
    workflow_id,
    environment
  )
VALUES
  (
    ${databaseId},
    ${workflowId},
    ${environment}
  )
ON CONFLICT (database_id, workflow_id, environment) DO UPDATE SET
  database_id = ${databaseId},
  workflow_id = ${workflowId},
  environment = ${environment}
RETURNING
  *
