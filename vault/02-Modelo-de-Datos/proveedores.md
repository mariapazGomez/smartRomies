# Tabla: `proveedores`

## Propósito

Catálogo de proveedores de boletas variables (hoy: luz, agua, gas). Estandariza el campo `boletas.proveedor_codigo` para poder agregar montos por proveedor de forma confiable más adelante (ej. "total gastado en agua este año"), sin depender de que alguien haya escrito siempre el mismo texto. Mismo rol que [[action_types]] para `usage_records`.

## Columnas

| Columna      | Tipo          | Nulo | Default   | Descripción                                                        |
|--------------|---------------|------|-----------|-----------------------------------------------------------------------|
| `codigo`     | `text`        | No   | —         | Llave natural, slug estable (ej. `'luz'`, `'agua'`, `'gas'`). No cambia una vez creado. |
| `nombre`     | `text`        | No   | —         | Etiqueta visible en la UI (ej. "Luz").                                |
| `activo`     | `boolean`     | No   | `true`      | Si es `false`, deja de estar disponible para cargar boletas nuevas. |
| `created_at` | `timestamptz` | No   | `now()`     | Fecha de creación.                                                    |

## Ejemplo de valores (seed)

| `codigo` | `nombre` | `activo` |
|----------|----------|----------|
| `luz`    | Luz      | `true`   |
| `agua`   | Agua     | `true`   |
| `gas`    | Gas      | `true`   |

## Llaves e índices

- **PK**: `codigo` (llave natural, catálogo chico y estable — mismo criterio que [[action_types]]).

## Relaciones

- Referenciada por `boletas.proveedor_codigo` (1 `proveedor` → N `boletas`).
