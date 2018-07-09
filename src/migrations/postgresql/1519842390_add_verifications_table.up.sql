CREATE TABLE verifications (
  id                   text      PRIMARY KEY,
  project_id           text      NOT NULL,
  environment          text      NOT NULL,
  reference_key        text      NOT NULL,
  phone_number_id      text      NULL,
  legal_name           text      NULL,
  date_of_birth        timestamp NULL,
  country_of_residence text      NULL,
  created_at           timestamp NOT NULL,
  updated_at           timestamp NOT NULL
);
