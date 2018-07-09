INSERT INTO
  entity_graph.people (
    date_of_birth,
    gender,
    interests,
    skills
  )
VALUES
  (
    ${dateOfBirth},
    ${gender},
    ${interests:json},
    ${skills:json}
  )
RETURNING
  *
