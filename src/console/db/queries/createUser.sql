INSERT INTO
  storage.users (
    username,
    password_hash,
    password_salt,
    primary_email,
    preferred_name
  )
VALUES
  (
    ${username},
    ${passwordHash},
    ${passwordSalt},
    ${primaryEmail},
    ${preferredName}
  )
ON CONFLICT DO NOTHING
RETURNING
  *
