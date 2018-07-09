UPDATE
  storage.targets
SET
  label = ${label},
  score = ${score},
  reasons = ${reasons:json},
  updated_at = now()
WHERE
  id = ${id}
RETURNING
  *
