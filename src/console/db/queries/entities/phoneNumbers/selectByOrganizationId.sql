SELECT
  phone_numbers.*
FROM
  entity_graph.phone_numbers,
  entity_graph.organizations_phone_numbers
WHERE
  organizations_phone_numbers.organization_id = $1
AND
  organizations_phone_numbers.phone_number_id = phone_numbers.id
