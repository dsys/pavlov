ALTER TABLE users
  ADD COLUMN requires_processing boolean NULL,
  ADD COLUMN processing boolean NULL;

ALTER TABLE verifications
  ADD COLUMN submitted boolean NULL;
