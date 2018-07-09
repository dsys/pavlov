SELECT
  emails.*
FROM
  entity_graph.emails,
  entity_graph.emails_people
WHERE
  emails_people.person_id = $1
AND
  emails_people.email_id = emails.id
