CREATE TABLE ip_addresses (
  id         text      PRIMARY KEY,
  address    text      NOT NULL,
  updated_at timestamp NOT NULL,
  created_at timestamp NOT NULL
);
