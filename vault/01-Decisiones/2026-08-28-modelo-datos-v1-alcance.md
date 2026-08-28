# ADR: Alcance del modelo de datos v1

- **Fecha**: 2026-08-28
- **Estado**: Aceptado

## Contexto

La primera funcionalidad de SmartRomies es registrar usos de lavadora/secadora en un hogar compartido, para luego saber cuánto le corresponde pagar a cada integrante. Antes de construir la webapp necesitamos un modelo de datos claro. Se definieron los siguientes puntos con el usuario:

- El lavado cuesta $2.000 CLP y el secado cuesta $2.000 CLP, cada uno con precio fijo por uso (no por tiempo ni por consumo real).
- Los gastos variables del hogar (luz, agua, etc., que llegan por boleta) son un problema real pero **no se aborda en esta versión** — se registra la intención en [[99-Futuro-fuera-de-alcance]] para no perderla.
- Por ahora la app es para un solo hogar: no hay necesidad de aislar datos entre distintos hogares (multi-tenant).
- No hay login individual de usuarios: la persona elige su nombre de una lista en la UI al registrar un uso (ver [[2026-08-28-seguridad-sin-auth]] para las implicancias de esto en el backend).

## Decisión

El modelo de datos v1 tiene tres tablas:

- [[members]] — integrantes del hogar.
- [[action_types]] — catálogo de acciones cobrables (hoy: `lavado`, `secado`), con precio configurable.
- [[usage_records]] — cada uso registrado, con el precio **congelado** al momento del registro (no se recalcula si `action_types.precio_actual` cambia después).

Se usa una llave natural (`codigo` tipo texto) en `action_types` en lugar de un UUID generado, porque es un catálogo pequeño, estable y legible (`'lavado'`, `'secado'`), y usarlo directamente como FK en `usage_records` hace las consultas más legibles sin perder integridad referencial.

El detalle completo de columnas, llaves e índices de cada tabla está en su propia nota dentro de `02-Modelo-de-Datos/`, y el DDL ejecutable en `supabase/migrations/0001_init_schema.sql`.

## Fuera de alcance (deliberado)

Ver [[99-Futuro-fuera-de-alcance]] para el detalle. Resumen: tabla de hogares (multi-tenant), prorrateo de boletas variables, y tabla de pagos/settlements entre integrantes. No se modelan ahora para no construir sobre supuestos que aún no están validados con el uso real de la app.

## Consecuencias

- Agregar un nuevo tipo de acción cobrable (ej. "lavado premium") no requiere cambio de esquema, solo una fila nueva en `action_types`.
- Si el precio de lavado o secado cambia, el historial ya registrado no se ve afectado porque `usage_records.precio_cobrado` es un snapshot.
- Cuando se aborde el prorrateo de boletas o multi-hogar, este ADR debe revisarse y probablemente se necesite una migración adicional (no reemplazo) de este esquema.
