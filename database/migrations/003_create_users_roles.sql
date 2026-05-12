CREATE TABLE IF NOT EXISTS users_roles (
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_users_roles_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_users_roles_role
    FOREIGN KEY (role_id)
    REFERENCES roles (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_roles_user_id ON users_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_users_roles_role_id ON users_roles (role_id);
