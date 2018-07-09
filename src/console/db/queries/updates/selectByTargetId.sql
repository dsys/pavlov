SELECT
  *
FROM
  storage.updates
WHERE
  updates.target_id = $1
ORDER BY
  created_at DESC
