INSERT INTO
  entity_graph.emails_organizations (
    email_id,
    organization_id
  )
VALUES
  (
    ${emailId},
    ${organizationId}
  )
RETURNING
  *
