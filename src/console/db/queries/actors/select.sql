SELECT
  *
FROM
  storage.actors
WHERE
  id = $1
LIMIT
  1
