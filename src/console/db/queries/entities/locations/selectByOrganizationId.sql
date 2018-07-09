SELECT
  locations.*
FROM
  entity_graph.locations,
  entity_graph.locations_organizations
WHERE
  locations_organizations.organization_id = $1
AND
  locations_organizations.location_id = locations.id
