# Futuro / fuera de alcance (v1)

Ideas identificadas durante el diseño del modelo v1 que **deliberadamente no se construyen ahora**, para no diseñar sobre supuestos no validados. Se documentan aquí para no perderlas. Cuando se retomen, deben pasar por su propio ADR en `01-Decisiones/`.

## Multi-hogar (multi-tenant)

Hoy el modelo asume un único hogar. Si se necesita soportar varios hogares (ej. la app se comparte con otro grupo de amigos), habría que:
- Agregar tabla `hogares` (`id`, `nombre`, ...).
- Agregar `hogar_id` como FK en `members` (y probablemente en `action_types`, si los precios varían por hogar).
- Revisar el ADR [[2026-08-28-seguridad-sin-auth]], porque sin autenticación real es difícil aislar datos entre hogares distintos de forma segura — probablemente esto requeriría introducir login antes que multi-hogar.

## Prorrateo de boletas variables

Los gastos reales del hogar (luz, agua, gas) llegan por boleta y varían mes a mes — no son un precio fijo como lavado/secado. Ideas a explorar más adelante:
- Tabla `boletas` (proveedor, período, monto total).
- Mecanismo de prorrateo: dividir el monto de la boleta entre los integrantes según algún criterio (partes iguales, proporcional a uso registrado, etc. — a definir con el usuario).
- Esto es un modelo distinto al de `usage_records` (que es "costo fijo por acción"), así que probablemente sea una tabla y flujo separados, no una extensión de `usage_records`.

## Pagos / settlements entre integrantes

Actualmente "cuánto debe cada uno" es una consulta agregada sobre `usage_records`, no un estado persistido. Si se necesita trackear que alguien efectivamente pagó su parte:
- Tabla `pagos` (`member_id`, `monto`, `periodo`, `fecha_pago`, `registrado_por`).
- Definir si un pago salda usos específicos o un monto total del período.
- Definir cómo se marca un período como "cerrado/saldado".

## Autenticación real

Si más adelante se requiere seguridad más allá de "elegir tu nombre de una lista" (ver [[2026-08-28-seguridad-sin-auth]]), evaluar Supabase Auth (magic link o email/password) y migrar las policies de RLS a basarse en `auth.uid()`.
