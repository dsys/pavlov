INSERT INTO
  storage.database_grants (
    permissions,
    user_id,
    database_id
  )
VALUES
  (
    'r',
    ${userId},
    ${databaseId}
  )
RETURNING
  *
