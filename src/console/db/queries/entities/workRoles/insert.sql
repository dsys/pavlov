INSERT INTO
  entity_graph.work_roles (
    title,
    end_date,
    is_current,
    start_date,
    work_experience_id
  )
VALUES
  (
    ${title},
    ${endDate},
    ${isCurrent},
    ${startDate},
    ${workExperienceId}
  )
RETURNING
  *
