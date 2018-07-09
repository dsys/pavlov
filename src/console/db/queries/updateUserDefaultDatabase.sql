UPDATE
  storage.users
SET
  default_database_id = ${defaultDatabaseId}
WHERE
  id = ${id}
RETURNING
  *
