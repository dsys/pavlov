CREATE TABLE users (
  id            text      PRIMARY KEY,
  username      text      NOT NULL UNIQUE,
  password_hash text      NOT NULL,
  password_salt text      NOT NULL,
  created_at    timestamp NOT NULL,
  updated_at    timestamp NOT NULL
);
