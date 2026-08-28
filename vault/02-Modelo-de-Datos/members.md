# Tabla: `members`

## Propósito

Representa a cada integrante del hogar que puede registrar usos de lavadora/secadora. Es la lista de perfiles que se muestra en la UI para que la persona elija quién es antes de registrar un uso (ver [[US-01-registrar-uso]] y [[2026-08-28-seguridad-sin-auth]] sobre por qué no hay login).

## Columnas

| Columna      | Tipo          | Nulo | Default             | Descripción                                  |
|--------------|---------------|------|----------------------|-----------------------------------------------|
| `id`         | `uuid`        | No   | `gen_random_uuid()`  | Identificador único del integrante.           |
| `nombre`     | `text`        | No   | —                    | Nombre visible en la UI (ej. "Ana").          |
| `activo`     | `boolean`     | No   | `true`                | Si es `false`, deja de aparecer como opción para registrar usos nuevos, pero su historial se conserva. |
| `created_at` | `timestamptz` | No   | `now()`               | Fecha de alta del integrante.                 |

## Llaves e índices

- **PK**: `id`.
- **UNIQUE**: `nombre` — evita duplicar perfiles con el mismo nombre en el hogar.

## Relaciones

- Referenciada por `usage_records.member_id` (1 `member` → N `usage_records`).

## Notas de diseño

- No incluye `email`/`password` ni ningún dato de autenticación: la identificación es por selección manual en la UI, no por login (ver [[2026-08-28-seguridad-sin-auth]]).
- `activo` permite "dar de baja" a alguien (se mudó, etc.) sin borrar su historial de usos ni romper la integridad referencial de `usage_records`.
