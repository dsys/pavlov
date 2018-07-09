SELECT
  storage.databases.*
FROM
  storage.databases
JOIN
  storage.users
ON
  storage.databases.id = storage.users.default_database_id
WHERE
  storage.users.id = storage.current_user_id()
LIMIT
  1
