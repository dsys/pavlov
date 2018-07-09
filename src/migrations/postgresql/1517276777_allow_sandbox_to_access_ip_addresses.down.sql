BEGIN;
REVOKE SELECT ON TABLE entity_graph.ip_addresses FROM sandbox_r;
REVOKE ALL ON TABLE entity_graph.ip_addresses FROM sandbox_rw;
COMMIT;
