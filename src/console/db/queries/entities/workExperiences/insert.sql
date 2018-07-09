INSERT INTO
  entity_graph.work_experiences (
    organization_id,
    person_id
  )
VALUES
  (
    ${organizationId},
    ${personId}
  )
RETURNING
  *
