SELECT
  websites.*
FROM
  entity_graph.websites,
  entity_graph.organizations_websites
WHERE
  organizations_websites.organization_id = $1
AND
  organizations_websites.website_id = websites.id
