INSERT INTO roles (id, role_name, description)
VALUES (
  '26f852d1-6f48-4ed5-9d1a-c49c6181ef76',
  'admin',
  'Administrator role'
)
ON CONFLICT (id) DO UPDATE
SET role_name = EXCLUDED.role_name,
    description = EXCLUDED.description;

INSERT INTO users (
  id,
  email,
  password,
  name,
  phone,
  is_active,
  created_at
)
VALUES (
  'b70004a4-6cb4-47a3-bf25-dd7f144da879',
  'test@example.com',
  '$2b$10$MeoQ5LASdfJuEmUC9NFGku3Fxr5E3UCn1uwjBSgganeflEKeCTR3e',
  'Test User',
  '+123456789',
  TRUE,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    is_active = EXCLUDED.is_active;

INSERT INTO users_roles (user_id, role_id)
VALUES (
  'b70004a4-6cb4-47a3-bf25-dd7f144da879',
  '26f852d1-6f48-4ed5-9d1a-c49c6181ef76'
)
ON CONFLICT (user_id, role_id) DO NOTHING;
