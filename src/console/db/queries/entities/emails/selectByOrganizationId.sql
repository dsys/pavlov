SELECT
  emails.*
FROM
  entity_graph.emails,
  entity_graph.emails_organizations
WHERE
  emails_organizations.organization_id = $1
AND
  emails_organizations.email_id = emails.id
