BEGIN;
  DROP TABLE test_nodes;
  CREATE TABLE entity_graph.test_nodes (
    id         uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
    test_str   text      NOT NULL,
    test_int   integer   NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );
COMMIT;
