CREATE TABLE social_security_numbers (
  id text PRIMARY KEY,
  cipher_text text NOT NULL,
  hash text NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);
