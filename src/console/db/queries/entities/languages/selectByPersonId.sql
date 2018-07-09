SELECT
  languages.*
FROM
  entity_graph.languages,
  entity_graph.languages_people
WHERE
  languages_people.person_id = $1
AND
  languages_people.language_id = languages.id
