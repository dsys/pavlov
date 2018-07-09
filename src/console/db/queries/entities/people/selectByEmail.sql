SELECT
  people.*
FROM
  entity_graph.people,
  entity_graph.emails_people,
  entity_graph.emails
WHERE
  emails_people.person_id = people.id
AND
  emails_people.email_id = emails.id
AND
  emails.id = $1
