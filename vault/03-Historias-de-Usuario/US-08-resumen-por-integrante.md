# US-08: Elegir integrante y ver su resumen mensual

**Como** integrante del hogar,
**quiero** que al abrir la app lo primero que vea sea elegir quién soy tocando mi círculo, y que eso me lleve directo a cuánto debo pagar este mes,
**para** no tener que buscar mi información entre la de todos.

## Contexto

Reemplaza la pantalla única que tenía todo junto (resumen por tipo + pestañas de acción arriba de la lista de integrantes dentro de "Registrar uso"). Esta historia cubre lo que [[US-03-resumen-por-persona]] dejaba pendiente (desglose de cuánto debe cada uno), con un cálculo simple: no hace falta esquema nuevo porque el reparto de boletas ya es igualitario (ver [[2026-08-31-boletas-manuales]]).

## Criterios de aceptación

- `/` (pantalla principal): si no hay integrantes activos, se mantiene el onboarding actual ([[US-05-alta-integrantes]]). Si hay, se muestra una grilla de círculos, uno por cada [[members]] activo — hoy con las iniciales del nombre sobre un color, a futuro con su avatar real (ver "Fuera de alcance"). Debajo de cada círculo, el nombre. Se mantiene el acceso "+ agregar integrante" en esta pantalla.
- Tocar un círculo navega a `/miembro/[id]`, la página de resumen de esa persona.
- En `/miembro/[id]` se ve: el nombre/avatar de la persona, cuánto **debe pagar este mes** (destacado), el selector de mes (mismo que [[US-07-resumen-del-mes]], default mes actual) y las tarjetas de resumen por tipo (Lavado/Secado/Luz/Agua/Gas) para el mes elegido.
- "Debe pagar este mes" = suma de sus `usage_records.precio_cobrado` del mes + suma de `boletas.monto_por_persona` de las boletas cargadas ese mes (todo integrante activo paga lo mismo por boleta, al ser reparto igualitario).
- **Las tarjetas de resumen por tipo son de este integrante, no del hogar entero**: Lavado/Secado muestran solo sus propios `usage_records`; Luz/Agua/Gas muestran su `monto_por_persona` de cada boleta del mes (por eso esas tres sí van a coincidir entre integrantes distintos — es su parte igualitaria — pero Lavado/Secado deben diferir según lo que cada uno usó). La suma de todas las tarjetas debe dar exactamente "Debe pagar este mes".
- Las acciones "Registrar uso" y "Cargar boleta" (antes en `/`) se mudan a esta página. Como el integrante ya está elegido, "Registrar uso" ya no pide elegir perfil — arranca directo en elegir la(s) acción(es).
- Un link para volver a `/` y elegir otro integrante.
- Si el `id` de la URL no corresponde a un integrante activo, se muestra un mensaje claro y un link a `/`, no un error crudo.

## Fuera de alcance de esta historia

- Subir o elegir una foto de avatar real — por ahora los círculos muestran solo iniciales.
- Cualquier cambio al reparto de boletas (sigue siendo partes iguales, congelado al cargar).
- Editar el nombre/avatar de un integrante desde esta pantalla.

## Referencias

Modelo: [[members]], [[usage_records]], [[boletas]]. Reemplaza/absorbe el propósito de [[US-03-resumen-por-persona]]. Reusa [[US-07-resumen-del-mes]] (selector de mes, resumen por tipo).
