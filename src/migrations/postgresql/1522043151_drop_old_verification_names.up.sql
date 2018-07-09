ALTER TABLE verifications
  DROP COLUMN phone_number_verification_id,
  DROP COLUMN legal_name,
  DROP COLUMN date_of_birth,
  DROP COLUMN country_of_residence,
  DROP COLUMN email_address,
  ADD COLUMN user_id text NULL;
DROP TABLE phone_number_verifications;
