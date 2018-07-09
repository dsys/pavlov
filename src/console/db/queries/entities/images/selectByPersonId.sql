SELECT
  images.*
FROM
  entity_graph.images,
  entity_graph.images_people
WHERE
  images_people.person_id = $1
AND
  images_people.image_id = images.id
