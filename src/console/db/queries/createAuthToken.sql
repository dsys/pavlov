INSERT INTO
  storage.auth_tokens (
    user_id,
    issuer,
    audience,
    expires_at
  )
VALUES
  (
    ${userId},
    ${issuer},
    ${audience},
    now() + ${expiresIn}::interval
  )
RETURNING
  *
