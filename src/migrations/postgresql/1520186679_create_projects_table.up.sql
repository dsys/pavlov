CREATE TABLE projects (
  id          text      PRIMARY KEY,
  name        text      NOT NULL,
  private_key text      NOT NULL,
  created_at  timestamp NOT NULL,
  updated_at  timestamp NOT NULL
);
