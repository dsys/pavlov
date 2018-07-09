INSERT INTO
  entity_graph.locations_organizations (
    location_id,
    organization_id
  )
VALUES
  (
    ${locationId},
    ${organizationId}
  )
RETURNING
  *
