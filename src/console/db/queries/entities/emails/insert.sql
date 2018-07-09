INSERT INTO
  entity_graph.emails AS e (
    address,
    domain,
    email_provider_id,
    is_primary,
    type
  )
VALUES
  (
    ${address},
    ${domain},
    ${emailProviderId},
    ${isPrimary},
    ${type}
  )
ON CONFLICT ON CONSTRAINT emails_address_unique DO UPDATE SET
  domain = COALESCE(e.domain, ${domain}),
  email_provider_id = COALESCE(e.email_provider_id, ${emailProviderId}),
  is_primary = COALESCE(e.is_primary, ${isPrimary}),
  type = COALESCE(e.type, ${type})
RETURNING
  *
