BEGIN;
ALTER TABLE storage.targets
  DROP COLUMN actor_id;
ALTER TABLE storage.workflows
  DROP COLUMN actor_target_arity;
DROP TABLE storage.actors;
COMMIT;
