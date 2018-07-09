SELECT
  *
FROM
  storage.users
WHERE
  username = ${username}
LIMIT
  1
