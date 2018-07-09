SELECT
  *
FROM
  storage.updates
WHERE
  id = $1
LIMIT
  1
