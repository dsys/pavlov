INSERT INTO
  entity_graph.organizations_websites (
    website_id,
    organization_id
  )
VALUES
  (
    ${websiteId},
    ${organizationId}
  )
RETURNING
  *
