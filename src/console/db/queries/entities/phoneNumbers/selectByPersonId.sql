SELECT
  phone_numbers.*
FROM
  entity_graph.phone_numbers,
  entity_graph.people_phone_numbers
WHERE
  people_phone_numbers.person_id = $1
AND
  people_phone_numbers.phone_number_id = phone_numbers.id
