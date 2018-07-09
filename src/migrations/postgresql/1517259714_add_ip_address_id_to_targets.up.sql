BEGIN;
ALTER TABLE storage.targets
  ADD COLUMN ip_address_id uuid NULL
  REFERENCES entity_graph.ip_addresses ON DELETE CASCADE;
ALTER TABLE storage.workflows
  ADD COLUMN ip_address_arity target_arity NOT NULL DEFAULT 'NONE';
COMMIT;
