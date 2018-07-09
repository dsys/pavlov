INSERT INTO
  entity_graph.images_organizations (
    image_id,
    organization_id
  )
VALUES
  (
    ${imageId},
    ${organizationId}
  )
RETURNING
  *
