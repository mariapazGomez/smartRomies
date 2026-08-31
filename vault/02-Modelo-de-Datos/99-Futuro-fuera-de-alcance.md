# Futuro / fuera de alcance (v1)

Ideas identificadas durante el diseño del modelo v1 que **deliberadamente no se construyen ahora**, para no diseñar sobre supuestos no validados. Se documentan aquí para no perderlas. Cuando se retomen, deben pasar por su propio ADR en `01-Decisiones/`.

## Multi-hogar (multi-tenant)

Hoy el modelo asume un único hogar. Si se necesita soportar varios hogares (ej. la app se comparte con otro grupo de amigos), habría que:
- Agregar tabla `hogares` (`id`, `nombre`, ...).
- Agregar `hogar_id` como FK en `members` (y probablemente en `action_types`, si los precios varían por hogar).
- Revisar el ADR [[2026-08-28-seguridad-sin-auth]], porque sin autenticación real es difícil aislar datos entre hogares distintos de forma segura — probablemente esto requeriría introducir login antes que multi-hogar.

## Prorrateo de boletas variables

**Actualización 2026-08-31**: la versión mínima de esto ya está en v1 — ingreso manual del monto y prorrateo en partes iguales. Ver [[boletas]] y [[2026-08-31-boletas-manuales]]. Se investigó automatizar la obtención del monto por scraping (Chilquinta) y se descartó: el sitio está protegido con reCAPTCHA y no tiene API pública, sortear esa protección no es algo que se vaya a construir.

Lo que sigue fuera de alcance:
- Automatizar la obtención del monto (scraping, integración con alguna API si Chilquinta u otro proveedor llega a publicar una).
- Otros criterios de prorrateo además de partes iguales (proporcional a uso registrado, etc.).
- Historial/listado de boletas cargadas.
- Recalcular el reparto de una boleta ya cargada si cambia la cantidad de integrantes activos después.

## Pagos / settlements entre integrantes

Actualmente "cuánto debe cada uno" es una consulta agregada sobre `usage_records`, no un estado persistido. Si se necesita trackear que alguien efectivamente pagó su parte:
- Tabla `pagos` (`member_id`, `monto`, `periodo`, `fecha_pago`, `registrado_por`).
- Definir si un pago salda usos específicos o un monto total del período.
- Definir cómo se marca un período como "cerrado/saldado".

## Autenticación real

Si más adelante se requiere seguridad más allá de "elegir tu nombre de una lista" (ver [[2026-08-28-seguridad-sin-auth]]), evaluar Supabase Auth (magic link o email/password) y migrar las policies de RLS a basarse en `auth.uid()`.
