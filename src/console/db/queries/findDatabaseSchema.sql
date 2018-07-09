SELECT
  tables.table_name,
  columns.column_name,
  columns.data_type,
  columns.is_nullable,
  columns.ordinal_position
FROM
  information_schema.tables,
  information_schema.columns
WHERE
  tables.table_schema IN ('storage', 'entity_graph')
AND
  columns.table_schema = tables.table_schema
AND
  columns.table_name = tables.table_name
AND
  tables.table_name NOT IN ('auth_tokens', 'pulses', 'users')
ORDER BY
  columns.ordinal_position;
