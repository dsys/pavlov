SELECT
  websites.*
FROM
  entity_graph.websites,
  entity_graph.people_websites
WHERE
  people_websites.person_id = $1
AND
  people_websites.website_id = websites.id
