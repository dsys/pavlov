INSERT INTO
  entity_graph.organizations_phone_numbers (
    organization_id,
    phone_number_id
  )
VALUES
  (
    ${organizationId},
    ${phoneNumberId}
  )
RETURNING
  *
