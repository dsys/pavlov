SELECT
  *
FROM
  storage.decisions
WHERE
  id = $1
LIMIT
  1
