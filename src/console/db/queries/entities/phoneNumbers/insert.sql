INSERT INTO
  entity_graph.phone_numbers AS p (
    area_code,
    country_code,
    extension,
    number,
    type
  )
VALUES
  (
    ${areaCode},
    ${countryCode},
    ${extension},
    ${number},
    ${type}
  )
ON CONFLICT ON CONSTRAINT phone_number_number_unique DO UPDATE SET
  area_code = COALESCE(p.area_code, ${areaCode}),
  country_code = COALESCE(p.country_code, ${countryCode}),
  extension = COALESCE(p.extension, ${extension}),
  type = COALESCE(p.type, ${type})
RETURNING
  *
