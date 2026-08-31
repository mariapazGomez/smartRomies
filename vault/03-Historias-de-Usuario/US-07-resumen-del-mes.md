# US-07: Ver resumen de montos del mes en tarjetas

**Como** integrante del hogar,
**quiero** ver, apenas abro la app, cuánto se acumuló este mes por cada tipo de uso y por cada proveedor de boleta,
**para** tener una foto rápida del gasto del mes sin tener que sumar nada a mano.

## Criterios de aceptación

- Arriba de todo en la pantalla principal (antes de "Registrar uso"/"Cargar boleta"), se muestra una sección "Este mes" con una tarjeta por cada [[action_types]] activo (hoy: Lavado, Secado) y una tarjeta por cada [[proveedores]] activo (hoy: Luz, Agua, Gas).
- Cada tarjeta de acción muestra la suma de `usage_records.precio_cobrado` de ese `action_type_codigo` con `fecha_uso` dentro del mes calendario actual.
- Cada tarjeta de proveedor muestra la suma de `boletas.monto_total` de ese `proveedor_codigo` cargadas (`created_at`) dentro del mes calendario actual.
- Si no hubo ningún uso/boleta de un tipo en el mes, su tarjeta muestra $0 (no se oculta la tarjeta).
- Se ve bien en una pantalla de celular: grilla de tarjetas, sin scroll horizontal.

## Fuera de alcance de esta historia

- Desglose por integrante (eso es [[US-03-resumen-por-persona]], no implementada todavía).
- Elegir otro mes/período distinto al mes calendario actual.
- El agrupado de boletas usa `created_at` (cuándo se cargó), no el texto libre de `periodo` — no se intenta parsear `periodo` como fecha.

## Referencias

Modelo: [[usage_records]], [[boletas]], [[action_types]], [[proveedores]].
