# US-07: Ver resumen de montos del mes en tarjetas

**Como** integrante del hogar,
**quiero** ver, apenas abro la app, cuánto se acumuló este mes por cada tipo de uso y por cada proveedor de boleta,
**para** tener una foto rápida del gasto del mes sin tener que sumar nada a mano.

## Criterios de aceptación

- Arriba de todo en la pantalla principal (antes de "Registrar uso"/"Cargar boleta"), se muestra una sección "Resumen del mes" con un selector de mes y una tarjeta por cada [[action_types]] activo (hoy: Lavado, Secado) y cada [[proveedores]] activo (hoy: Luz, Agua, Gas).
- El selector lista los últimos 12 meses (incluido el actual); al elegir uno, la URL queda como `/?mes=YYYY-MM` y las tarjetas muestran los montos de ese mes — al abrir la app sin elegir nada, se ve el mes actual por defecto.
- Cada tarjeta de acción muestra la suma de `usage_records.precio_cobrado` de ese `action_type_codigo` con `fecha_uso` dentro del mes elegido.
- Cada tarjeta de proveedor muestra la suma de `boletas.monto_total` de ese `proveedor_codigo` cargadas (`created_at`) dentro del mes elegido.
- Si no hubo ningún uso/boleta de un tipo en el mes elegido, su tarjeta muestra $0 (no se oculta la tarjeta).
- Se ve bien en una pantalla de celular: grilla de tarjetas, sin scroll horizontal.

## Fuera de alcance de esta historia

- Desglose por integrante (eso es [[US-03-resumen-por-persona]], no implementada todavía).
- Elegir un período fuera de los últimos 12 meses, o un rango de fechas libre.
- El agrupado de boletas usa `created_at` (cuándo se cargó), no el texto libre de `periodo` — no se intenta parsear `periodo` como fecha; una boleta de "Julio" cargada en agosto cuenta para agosto.

## Referencias

Modelo: [[usage_records]], [[boletas]], [[action_types]], [[proveedores]].
