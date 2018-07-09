CREATE TABLE phone_number_connections (
  id text PRIMARY KEY,
  phone_number_id text NOT NULL,
  user_id text NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);
