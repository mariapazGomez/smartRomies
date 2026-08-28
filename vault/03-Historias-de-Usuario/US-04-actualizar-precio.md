# US-04: Actualizar el precio de lavado/secado

**Como** integrante del hogar,
**quiero** poder actualizar el precio de lavado o secado cuando cambie,
**para que** los nuevos usos reflejen el precio correcto, sin alterar los usos ya registrados anteriormente.

## Criterios de aceptación

- Se puede editar `action_types.precio_actual` para `lavado` o `secado` desde la UI (pantalla simple de administración, sin necesidad de tocar la base de datos directamente).
- Al guardar, se actualiza `action_types.updated_at`.
- Los [[usage_records]] ya existentes **no cambian**: su `precio_cobrado` permanece igual al valor congelado en su momento (ver nota de diseño en [[usage_records]] y [[action_types]]).
- Los usos registrados *después* del cambio usan el nuevo `precio_actual`.
- Se muestra confirmación clara del cambio (ej. "Precio de Lavado actualizado a $2.200").

## Fuera de alcance de esta historia

- Historial de cambios de precio (cuándo cambió de cuánto a cuánto) — si se necesita, sería una tabla `action_types_historial` o similar, a evaluar cuando haga falta.
- Precios distintos por integrante o por franja horaria.

## Referencias

Modelo: [[action_types]], [[usage_records]].
