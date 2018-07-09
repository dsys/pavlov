SELECT
  *
FROM
  storage.users
WHERE
  id = ${userId}
LIMIT
  1
