INSERT INTO
  entity_graph.images_people (
    image_id,
    person_id
  )
VALUES
  (
    ${imageId},
    ${personId}
  )
RETURNING
  *
