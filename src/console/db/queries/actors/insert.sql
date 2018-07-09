INSERT INTO
  storage.actors (
    lookup_fields,
    email_id,
    ip_address_id,
    person_id,
    phone_number_id,
    database_id
  )
VALUES
  (
    ${lookupFields},
    ${emailId},
    ${ipAddressId},
    ${personId},
    ${phoneNumberId},
    ${databaseId}
  )
RETURNING
  *
