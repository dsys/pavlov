SELECT
  *
FROM
  storage.databases
WHERE
  invite_code = $1
LIMIT
  1
