CREATE TABLE project_permissions (
  id text PRIMARY KEY,
  project_id text NOT NULL,
  user_id text NOT NULL,
  can_manage bool NOT NULL,
  can_view bool NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL
);
