# US-01: Registrar un uso de lavadora/secadora

**Como** integrante del hogar,
**quiero** seleccionar mi perfil y registrar que hice un lavado o un secado desde mi celular,
**para que** quede constancia de quién debe pagar qué.

## Criterios de aceptación

- La pantalla principal muestra la lista de integrantes activos ([[members]] con `activo = true`) como opciones tocables.
- Al elegir un perfil, se puede elegir el tipo de acción entre los `action_types` activos (hoy: Lavado $2.000, Secado $2.000).
- Al confirmar, se crea una fila en [[usage_records]] con `member_id`, `action_type_codigo`, `precio_cobrado` (= `action_types.precio_actual` en ese momento) y `fecha_uso` (por defecto, ahora).
- El flujo completo (elegir perfil → elegir acción → confirmar) debe ser posible en 2-3 toques, priorizando velocidad de uso desde el celular.
- Tras registrar, se muestra una confirmación clara (ej. "Ana registró un Lavado — $2.000").

## Fuera de alcance de esta historia

- Editar o eliminar un uso ya registrado (a definir en historia futura si se necesita).
- Registrar un uso "a nombre de otra persona" sin que esa persona lo confirme.

## Referencias

Modelo: [[members]], [[action_types]], [[usage_records]]. Decisión de identificación sin login: [[2026-08-28-seguridad-sin-auth]].
