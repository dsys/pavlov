SELECT
  people.*
FROM
  entity_graph.people,
  entity_graph.people_phone_numbers,
  entity_graph.phone_numbers
WHERE
  people_phone_numbers.person_id = people.id
AND
  people_phone_numbers.phone_number_id = phone_numbers.id
AND
  phone_numbers.number = $1
LIMIT
  1
