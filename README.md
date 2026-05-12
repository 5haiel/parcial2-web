# Preparcial - Sistema de Usuarios y Roles

Aplicación NestJS para autenticación con JWT, autorización por roles y persistencia en PostgreSQL con relación muchos a muchos entre usuarios y roles.

## Arquitectura

- `src/auth`: autenticación con JWT, estrategia Passport y decorador/guard de roles.
- `src/users`: gestión de usuarios, perfil propio y asignación de roles.
- `src/roles`: creación y listado de roles.
- `database/migrations`: scripts SQL de migración.
- `database/seed.sql`: datos iniciales probados.
- `database/reset.sql`: limpia y reconstruye la base de datos desde cero.

## Requisitos funcionales cubiertos

- Registro de usuario: `POST /auth/register`
- Login con JWT: `POST /auth/login`
- Crear rol: `POST /roles`
- Listar roles: `GET /roles`
- Asignar roles a usuario: `PATCH /users/:id/roles`
- Ver perfil propio: `GET /users/me`
- Listar usuarios: `GET /users`

## Modelos

### `users`

- `id` UUID PK
- `email` único, no nulo
- `password` hash, no nulo
- `name`
- `phone` opcional
- `is_active` default `true`
- `created_at` default `CURRENT_TIMESTAMP`

### `roles`

- `id` UUID PK
- `role_name` único
- `description` opcional
- `created_at` default `CURRENT_TIMESTAMP`

## Variables de entorno

Crear un archivo `.env` con:

```env
JWT_SECRET=mysecretkey
JWT_EXPIRES_IN=120s

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=parcial2
```

## Instalación

```bash
npm install
```

## Ejecutar la aplicación

```bash
npm run start:dev
```

## Base de datos

### Nota importante

El proyecto usa TypeORM con PostgreSQL. Para el entregable final se recomienda mantener `synchronize: false` y usar los scripts SQL incluidos en `database/`.

### Migraciones SQL

Los scripts deben ejecutarse en este orden:

1. `database/migrations/001_create_roles.sql`
2. `database/migrations/002_create_users.sql`
3. `database/migrations/003_create_users_roles.sql`

Ejecutar todo desde cero con:

```bash
psql -U postgres -d parcial2 -f database/reset.sql
```

### Seed SQL

El archivo `database/seed.sql` inserta:

- rol `admin`
- usuario de prueba `test@example.com`
- relación entre ambos en la tabla intermedia

Ejecutarlo solo cuando las tablas ya existan:

```bash
psql -U postgres -d parcial2 -f database/seed.sql
```

### Reset completo

Si necesitas limpiar y reconstruir la base de datos:

```bash
psql -U postgres -d parcial2 -f database/reset.sql
```

## Probar la API

### Registro

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "+123456789"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Roles protegidos

Usar el `access_token` devuelto por login:

```bash
curl -X GET http://localhost:3000/api/v1/roles \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Seguridad y validación

- Passwords cifradas con `bcrypt`.
- DTOs validados con `class-validator`.
- JWT con Passport.
- Decorador `@Roles(...)` y `RolesGuard` personalizado.

## Entregables

- Migraciones SQL de la base de datos.
- Script SQL con usuarios y roles probados.
- Repositorio listo para release en GitHub.

## Estado actual

- La aplicación ya responde correctamente a los endpoints principales.
- La base de datos ya puede reconstruirse desde cero con `database/reset.sql`.
- El usuario `test@example.com` tiene el rol `admin` asignado para probar los endpoints protegidos.
