BEGIN;
CREATE TABLE phone_number_verifications (
  id              text      PRIMARY KEY,
  phone_number_id text      NOT NULL,
  success         boolean   NOT NULL,
  carrier         text      NULL,
  created_at      timestamp NOT NULL,
  updated_at      timestamp NOT NULL
);

ALTER TABLE verifications RENAME phone_number_id TO phone_number_verification_id;
COMMIT;
