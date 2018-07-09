BEGIN;
GRANT SELECT ON TABLE entity_graph.ip_addresses TO sandbox_r;
GRANT ALL ON TABLE entity_graph.ip_addresses TO sandbox_rw;
COMMIT;
