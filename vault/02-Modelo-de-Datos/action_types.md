# Tabla: `action_types`

## Propósito

Catálogo de acciones cobrables sobre la lavadora/secadora. Hoy solo existen dos: lavado y secado, cada una con un precio fijo (ver [[2026-08-28-modelo-datos-v1-alcance]]). Permite agregar nuevas acciones cobrables en el futuro (ej. "lavado premium", "planchado") sin cambiar el esquema, y permite actualizar el precio vigente sin tocar código (ver [[US-04-actualizar-precio]]).

## Columnas

| Columna         | Tipo          | Nulo | Default   | Descripción                                                        |
|-----------------|---------------|------|-----------|----------------------------------------------------------------------|
| `codigo`        | `text`        | No   | —         | Llave natural, slug estable (ej. `'lavado'`, `'secado'`). No cambia una vez creado. |
| `nombre`        | `text`        | No   | —         | Etiqueta visible en la UI (ej. "Lavado").                            |
| `precio_actual` | `integer`     | No   | —         | Precio vigente en CLP (pesos chilenos, sin decimales). `CHECK (precio_actual >= 0)`. |
| `activo`        | `boolean`     | No   | `true`      | Si es `false`, deja de estar disponible para registrar usos nuevos. |
| `created_at`    | `timestamptz` | No   | `now()`     | Fecha de creación del tipo de acción.                                |
| `updated_at`    | `timestamptz` | No   | `now()`     | Última vez que cambió `precio_actual` u otro campo.                  |

## Ejemplo de valores (datos iniciales / seed)

| `codigo`  | `nombre` | `precio_actual` | `activo` | `created_at`          | `updated_at`          |
|-----------|----------|------------------|----------|------------------------|------------------------|
| `lavado`  | Lavado   | 2000             | `true`   | 2026-08-01 09:00:00+00 | 2026-08-01 09:00:00+00 |
| `secado`  | Secado   | 2000             | `true`   | 2026-08-01 09:00:00+00 | 2026-08-01 09:00:00+00 |

Ejemplo de un cambio de precio más adelante (ver [[US-04-actualizar-precio]]): si el 2026-09-15 el lavado sube a $2.200, se actualiza la fila `lavado` a `precio_actual = 2200` y `updated_at = 2026-09-15 10:00:00+00`. Los `usage_records` registrados antes de esa fecha siguen mostrando `precio_cobrado = 2000`, porque quedó congelado en su momento.

## Llaves e índices

- **PK**: `codigo` (llave natural en vez de UUID — catálogo pequeño y legible, ver justificación en [[2026-08-28-modelo-datos-v1-alcance]]).

## Relaciones

- Referenciada por `usage_records.action_type_codigo` (1 `action_type` → N `usage_records`).

## Notas de diseño

- Cambiar `precio_actual` **no** modifica usos ya registrados: `usage_records.precio_cobrado` guarda el precio congelado al momento del uso (ver [[usage_records]]). `action_types.precio_actual` solo determina qué precio se congela en los usos *futuros*.
