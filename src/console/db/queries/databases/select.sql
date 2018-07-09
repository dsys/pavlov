SELECT
  *
FROM
  storage.databases
WHERE
  id = $1
LIMIT
  1
