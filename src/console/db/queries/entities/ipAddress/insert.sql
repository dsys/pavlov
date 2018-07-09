INSERT INTO
  entity_graph.ip_addresses AS ip (
    ip_address,
    website_id,
    location_id,
    organization_id,
    as_number,
    as_org_id,
    isp_id
  )
VALUES
  (
    ${ipAddress},
    ${website},
    ${location},
    ${organization},
    ${asNumber},
    ${asOrg},
    ${isp}
  )
ON CONFLICT ON CONSTRAINT ip_address_ip_unique DO UPDATE SET
  ip_address = COALESCE(ip.ip_address, ${ipAddress}),
  website_id = COALESCE(ip.website_id, ${website}),
  location_id = COALESCE(ip.location_id, ${location}),
  organization_id = COALESCE(ip.organization_id, ${organization}),
  as_number = COALESCE(ip.as_number, ${asNumber}),
  as_org_id = COALESCE(ip.as_org_id, ${asOrg}),
  isp_id = COALESCE(ip.isp_id, ${isp})
RETURNING
  *