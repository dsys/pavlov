SELECT
  locations.*
FROM
  entity_graph.locations,
  entity_graph.locations_people
WHERE
  locations_people.person_id = $1
AND
  locations_people.location_id = locations.id
