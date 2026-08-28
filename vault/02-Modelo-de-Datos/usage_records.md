# Tabla: `usage_records`

## Propósito

Tabla transaccional: cada fila es un evento de "esta persona hizo esta acción (lavado/secado) en este momento, a este precio". Es la base para calcular el historial ([[US-02-ver-historial]]) y cuánto le corresponde pagar a cada integrante ([[US-03-resumen-por-persona]]).

## Columnas

| Columna               | Tipo          | Nulo | Default              | Descripción                                                                 |
|------------------------|---------------|------|------------------------|-------------------------------------------------------------------------------|
| `id`                   | `uuid`        | No   | `gen_random_uuid()`   | Identificador único del registro de uso.                                     |
| `member_id`            | `uuid`        | No   | —                     | Quién hizo el uso. FK a `members(id)`.                                       |
| `action_type_codigo`   | `text`        | No   | —                     | Qué acción se hizo. FK a `action_types(codigo)`.                             |
| `precio_cobrado`       | `integer`     | No   | —                     | Precio en CLP **congelado** al momento del registro (snapshot de `action_types.precio_actual`). `CHECK (precio_cobrado >= 0)`. |
| `fecha_uso`            | `timestamptz` | No   | `now()`                | Cuándo ocurrió el uso (puede diferir de `created_at` si se registra a posteriori). |
| `notas`                | `text`        | Sí   | —                     | Comentario opcional (ej. "carga grande", "compartido con Luis").             |
| `created_at`           | `timestamptz` | No   | `now()`                | Cuándo se creó el registro en el sistema.                                    |

## Ejemplo de valores

| `id`   | `member_id` (→ [[members]])              | `action_type_codigo` | `precio_cobrado` | `fecha_uso`             | `notas`              | `created_at`             |
|--------|--------------------------------------------|------------------------|--------------------|---------------------------|-----------------------|---------------------------|
| `a001` | `11111111-...` (Ana)                        | `lavado`               | 2000               | 2026-08-10 08:15:00+00    | —                     | 2026-08-10 08:15:03+00    |
| `a002` | `22222222-...` (Luis)                       | `secado`               | 2000               | 2026-08-10 09:40:00+00    | —                     | 2026-08-10 09:40:11+00    |
| `a003` | `11111111-...` (Ana)                        | `secado`               | 2000               | 2026-08-11 20:05:00+00    | "carga grande"        | 2026-08-11 20:05:47+00    |
| `a004` | `22222222-...` (Luis)                       | `lavado`               | 2200               | 2026-09-16 07:30:00+00    | —                     | 2026-09-16 07:30:05+00    |

(`id`, `member_id` acortados por legibilidad; en la base real son `uuid` completos.)

Nótese la fila `a004`: es posterior al cambio de precio de ejemplo descrito en [[action_types]] (lavado sube a $2.200 el 2026-09-15), por eso su `precio_cobrado` es 2200, mientras que `a001`, que es de antes del cambio, quedó congelada en 2000 aunque hoy `action_types.precio_actual` ya no sea ese valor.

Con estos 4 registros, el resumen del período 2026-08-01 a 2026-08-31 (ver [[US-03-resumen-por-persona]]) sería: Ana debe $4.000 (1 lavado + 1 secado), Luis debe $2.000 (1 secado) — el registro `a004` de septiembre no entra en ese período.

## Llaves e índices

- **PK**: `id`.
- **FK**: `member_id` → `members(id)`.
- **FK**: `action_type_codigo` → `action_types(codigo)`.
- **Índice** `idx_usage_records_fecha_uso` sobre `(fecha_uso)` — para reportes globales por período (ej. "todos los usos de agosto").
- **Índice** `idx_usage_records_member_fecha` sobre `(member_id, fecha_uso)` — para consultas "cuánto debe la persona X en el período Y"; como `member_id` es el prefijo, también sirve para consultas solo por `member_id`.

## Relaciones

- N `usage_records` → 1 `member` (vía `member_id`).
- N `usage_records` → 1 `action_type` (vía `action_type_codigo`).

## Notas de diseño

- **Por qué se congela el precio**: si no se guardara `precio_cobrado` y en cambio se calculara siempre desde `action_types.precio_actual`, un cambio de precio alteraría retroactivamente el costo de usos ya registrados y ya "cobrados" a las personas. Congelar el precio al momento del uso mantiene el historial financiero correcto (ver [[2026-08-28-modelo-datos-v1-alcance]]).
- El "cuánto debe cada uno" no es una columna ni una tabla aparte en v1: es una suma agregada de `precio_cobrado` agrupada por `member_id` sobre el período que se consulte. Si más adelante se necesita trackear pagos/saldos, eso es una tabla nueva (ver [[99-Futuro-fuera-de-alcance]]), no un cambio a esta tabla.
