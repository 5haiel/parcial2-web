DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\ir migrations/001_create_roles.sql
\ir migrations/002_create_users.sql
\ir migrations/003_create_users_roles.sql
\ir seed.sql
