SELECT
  industries.*
FROM
  entity_graph.industries,
  entity_graph.industries_organizations
WHERE
  industries_organizations.organization_id = $1
AND
  industries_organizations.industry_id = industries.id
