ALTER TABLE users
  ADD COLUMN legal_name text NULL,
  ADD COLUMN date_of_birth timestamp NULL,
  ADD COLUMN address_street_1 text NULL,
  ADD COLUMN address_street_2 text NULL,
  ADD COLUMN address_city text NULL,
  ADD COLUMN address_state text NULL,
  ADD COLUMN address_postal_code text NULL,
  ADD COLUMN address_country text NULL;
