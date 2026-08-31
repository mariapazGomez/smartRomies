# US-01: Registrar un uso de lavadora/secadora

**Como** integrante del hogar,
**quiero** seleccionar mi perfil y registrar que hice un lavado y/o un secado desde mi celular,
**para que** quede constancia de quién debe pagar qué.

## Criterios de aceptación

- La pantalla principal muestra la lista de integrantes activos ([[members]] con `activo = true`) como opciones tocables.
- Al elegir un perfil, se puede elegir **uno o más** tipos de acción entre los `action_types` activos (hoy: Lavado $2.000, Secado $2.000) — selección múltiple, porque en la práctica se suele lavar y secar en la misma tanda.
- Al confirmar, se crea **una fila en [[usage_records]] por cada tipo de acción elegido** (no una sola fila combinada): mismo `member_id` y `fecha_uso`, cada una con su propio `action_type_codigo` y `precio_cobrado` (= `action_types.precio_actual` de esa acción en ese momento). Esto mantiene el principio de "una fila = un evento" del modelo de datos (ver [[usage_records]]) y hace que el historial ([[US-02-ver-historial]]) y el resumen por persona ([[US-03-resumen-por-persona]]) sigan funcionando sin cambios.
- El flujo completo (elegir perfil → elegir una o más acciones → confirmar) prioriza velocidad de uso desde el celular: para una sola acción son 3 toques (perfil, acción, confirmar); elegir más de una acción suma un toque por cada acción extra.
- Tras registrar, se muestra una confirmación clara con el detalle de lo registrado y el total (ej. "Ana registró Lavado + Secado — $4.000").

## Fuera de alcance de esta historia

- Editar o eliminar un uso ya registrado (a definir en historia futura si se necesita).
- Registrar un uso "a nombre de otra persona" sin que esa persona lo confirme.

## Referencias

Modelo: [[members]], [[action_types]], [[usage_records]]. Decisión de identificación sin login: [[2026-08-28-seguridad-sin-auth]].
