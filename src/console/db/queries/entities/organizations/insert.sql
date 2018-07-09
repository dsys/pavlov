INSERT INTO
  entity_graph.organizations (
    name,
    description,
    dbas,
    legal_name,
    alexa_global_rank,
    alexa_us_rank,
    employee_count,
    founding_date,
    market_cap,
    raised
  )
VALUES
  (
    ${name},
    ${description},
    ${dbas:json},
    ${legalName},
    ${alexaGlobalRank},
    ${alexaUSRank},
    ${employeeCount},
    ${foundingDate},
    ${marketCap},
    ${raised}
  )
RETURNING
  *
