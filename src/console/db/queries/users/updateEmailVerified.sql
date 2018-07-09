UPDATE
  storage.users
SET
  email_verified = true
WHERE
  email_verification_code = $1
AND
  email_verification_code_created_at > now()::date - interval '7 days'
RETURNING
  *
