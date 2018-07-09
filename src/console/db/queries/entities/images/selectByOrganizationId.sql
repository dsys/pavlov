SELECT
  images.*
FROM
  entity_graph.images,
  entity_graph.images_organizations
WHERE
  images_organizations.organization_id = $1
AND
  images_organizations.image_id = images.id
