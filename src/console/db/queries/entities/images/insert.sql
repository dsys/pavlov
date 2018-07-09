INSERT INTO
  entity_graph.images AS i (
    sha256,
    content_type,
    content_length,
    width,
    height
  )
VALUES
  (
    ${sha256},
    ${contentType},
    ${contentLength},
    ${width},
    ${height}
  )
ON CONFLICT ON CONSTRAINT images_sha256_unique DO UPDATE SET
  content_type = COALESCE(i.content_type, ${contentType}),
  content_length = COALESCE(i.content_length, ${contentLength}),
  width = COALESCE(i.width, ${width}),
  height = COALESCE(i.height, ${height})
RETURNING
  *
