INSERT INTO
  entity_graph.social_profiles (
    aliases,
    bio,
    followers,
    is_active,
    network_id,
    url
  )
VALUES
  (
    ${aliases:json},
    ${bio},
    ${followers},
    ${isActive},
    ${networkId},
    ${url}
  )
RETURNING
  *
