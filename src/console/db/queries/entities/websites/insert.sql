INSERT INTO
  entity_graph.websites AS w (
    name,
    domain,
    type,
    url
  )
VALUES
  (
    ${name},
    ${domain},
    ${type},
    ${url}
  )
ON CONFLICT ON CONSTRAINT websites_url_unique DO UPDATE SET
  name = COALESCE(w.name, ${name}),
  domain = COALESCE(w.domain, ${domain}),
  type = COALESCE(w.type, ${type})
RETURNING
  *
