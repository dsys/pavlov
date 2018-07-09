INSERT INTO
  entity_graph.education_experiences (
    degrees,
    end_date,
    is_current,
    majors,
    minors,
    organization_id,
    person_id,
    start_date
  )
VALUES
  (
    ${degrees:json},
    ${endDate},
    ${isCurrent},
    ${majors:json},
    ${minors:json},
    ${organizationId},
    ${personId},
    ${startDate}
  )
RETURNING
  *
