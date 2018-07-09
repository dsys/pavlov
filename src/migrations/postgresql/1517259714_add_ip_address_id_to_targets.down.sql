BEGIN;
ALTER TABLE storage.targets DROP COLUMN ip_address_id;
ALTER TABLE storage.workflows DROP COLUMN ip_address_arity;
COMMIT;
