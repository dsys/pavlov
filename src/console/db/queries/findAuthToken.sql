SELECT
  *
FROM
  storage.auth_tokens
WHERE
  id = ${id}
LIMIT
  1
