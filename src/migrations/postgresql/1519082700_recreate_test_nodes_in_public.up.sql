BEGIN;
  DROP TABLE entity_graph.test_nodes;
  CREATE TABLE test_nodes (
    id         text      PRIMARY KEY,
    test_str   text      NOT NULL,
    test_int   integer   NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
  );
COMMIT;
