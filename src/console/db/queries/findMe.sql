SELECT
  *
FROM
  storage.users
WHERE
  id = storage.current_user_id()
LIMIT
  1
