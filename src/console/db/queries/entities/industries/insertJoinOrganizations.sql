INSERT INTO
  entity_graph.industries_organizations (
    industry_id,
    organization_id
  )
VALUES
  (
    ${industryId},
    ${organizationId}
  )
RETURNING
  *
