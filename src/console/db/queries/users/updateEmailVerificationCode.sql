UPDATE
  storage.users
SET
  email_verified = DEFAULT,
  email_verification_code = DEFAULT,
  email_verification_code_created_at = DEFAULT
WHERE
  id = $1
RETURNING
  *
