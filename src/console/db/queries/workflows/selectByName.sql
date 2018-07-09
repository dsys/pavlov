SELECT
  *
FROM
  storage.workflows
WHERE
  name = $1
LIMIT
  1

-- TODO: Favor workflows in the user's database.
