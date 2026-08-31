# Tabla: `boletas`

## Propósito

Registra una boleta variable del hogar (luz, agua, gas, ...) cargada a mano, con el monto ya repartido en partes iguales entre los integrantes activos al momento de la carga. Ver decisión en [[2026-08-31-boletas-manuales]].

## Columnas

| Columna               | Tipo          | Nulo | Default   | Descripción                                                                 |
|------------------------|---------------|------|-----------|-------------------------------------------------------------------------------|
| `id`                   | `uuid`        | No   | `gen_random_uuid()` | Identificador único de la boleta.                                  |
| `proveedor`            | `text`        | No   | —         | Texto libre (ej. "Luz", "Agua"). No está atado a una compañía específica.     |
| `periodo`              | `text`        | No   | —         | Texto libre para identificar el período facturado (ej. "Agosto 2026").       |
| `monto_total`          | `integer`     | No   | —         | Monto total de la boleta en CLP. `CHECK (monto_total >= 0)`.                  |
| `cantidad_integrantes` | `integer`     | No   | —         | Cantidad de [[members]] con `activo = true` al momento de cargar la boleta. `CHECK (cantidad_integrantes > 0)`. |
| `monto_por_persona`    | `integer`     | No   | —         | `round(monto_total / cantidad_integrantes)`, **congelado** al momento de la carga. `CHECK (monto_por_persona >= 0)`. |
| `created_at`           | `timestamptz` | No   | `now()`   | Cuándo se cargó la boleta.                                                     |

## Llaves e índices

- **PK**: `id`.
- Sin FK: el reparto es en partes iguales (una cifra por integrante), no un evento por persona, así que no hace falta vincular filas individuales de `members`.

## Notas de diseño

- **Por qué se congelan `cantidad_integrantes`/`monto_por_persona`**: mismo principio que `usage_records.precio_cobrado` (ver [[usage_records]]) — si cambia la cantidad de integrantes activos después, las boletas ya cargadas no deben recalcularse retroactivamente.
- El redondeo de `monto_por_persona` puede dejar una diferencia de unos pocos pesos frente a `monto_total`; es una simplificación deliberada de v1 (ver [[2026-08-31-boletas-manuales]]).
- No hay automatización de la obtención del monto (scraping descartado — ver ADR) ni historial/listado de boletas todavía (ver [[99-Futuro-fuera-de-alcance]]).
