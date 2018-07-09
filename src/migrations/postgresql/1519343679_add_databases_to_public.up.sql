CREATE TABLE databases (
  id            text      PRIMARY KEY,
  name          text      NOT NULL,
  invite_code   text      NOT NULL,
  icon_image_id text      NULL,
  created_at    timestamp NOT NULL,
  updated_at    timestamp NOT NULL
);
