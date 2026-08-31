# US-03: Ver resumen de cuánto debe cada persona

> **Estado 2026-08-31**: la necesidad central de esta historia (cuánto debe pagar cada uno) quedó cubierta por [[US-08-resumen-por-integrante]] — con un cálculo más simple de lo planteado acá (total del mes por persona, incluyendo boletas, sin desglosar lavado vs. secado todavía). Lo que sigue pendiente de esta historia: distinguir lavado vs. secado por persona, elegir un rango de fechas libre (no solo mes calendario), y el total general del hogar como referencia.

**Como** integrante del hogar,
**quiero** ver un resumen de cuánto le corresponde pagar a cada persona en un período,
**para** saber cuánto debo (o cuánto me deben) sin tener que sumar manualmente el historial.

## Criterios de aceptación

- Se puede elegir un período (ej. mes actual, o rango de fechas) y ver, por cada [[members]] activo, la suma de `precio_cobrado` de sus [[usage_records]] en ese período.
- El resumen distingue el total de lavados vs. secados por persona (no solo el total general), aprovechando `action_type_codigo`.
- El cálculo es una consulta agregada sobre `usage_records` (`SUM(precio_cobrado) GROUP BY member_id`) — no depende de ningún estado persistido de "deuda" (ver [[usage_records]], nota de diseño).
- Se muestra también el total general del hogar en el período, como referencia.

## Fuera de alcance de esta historia

- Marcar a alguien como "ya pagó" o llevar saldos entre personas — eso es una funcionalidad de pagos/settlements, ver [[99-Futuro-fuera-de-alcance]].
- Incluir gastos de boletas (luz/agua) en este resumen — también fuera de alcance v1.

## Referencias

Modelo: [[usage_records]], [[members]], [[action_types]].
