CREATE TABLE verifications_ip_addresses (
  verification_id text      PRIMARY KEY,
  ip_address_id   text      NOT NULL,
  created_at      timestamp NOT NULL
);
