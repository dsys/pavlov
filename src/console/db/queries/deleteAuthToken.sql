DELETE FROM
  storage.auth_tokens
WHERE
  id = ${id}
RETURNING
  *
