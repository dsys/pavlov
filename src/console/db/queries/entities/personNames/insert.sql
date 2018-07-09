INSERT INTO
  entity_graph.person_names (
    first_name,
    is_primary,
    last_name,
    middle_name,
    person_id,
    prefix,
    suffix,
    title
  )
VALUES
  (
    ${firstName},
    ${isPrimary},
    ${lastName},
    ${middleName},
    ${personId},
    ${prefix},
    ${suffix},
    ${title}
  )
RETURNING
  *
