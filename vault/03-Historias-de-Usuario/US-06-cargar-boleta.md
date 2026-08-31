# US-06: Cargar una boleta variable y repartirla en partes iguales

**Como** integrante del hogar,
**quiero** cargar el monto de una boleta variable (luz, agua, gas) a mano,
**para que** se reparta automáticamente en partes iguales entre los integrantes activos.

## Contexto

Ver [[2026-08-31-boletas-manuales]]: se descartó automatizar la obtención del monto (el sitio de Chilquinta está protegido con reCAPTCHA y no tiene API pública), así que el monto se ingresa manualmente después de consultarlo en el sitio de la compañía.

## Criterios de aceptación

- Desde la pantalla principal (una vez que hay integrantes activos) se puede pasar a un modo "Cargar boleta", separado del flujo de registrar uso.
- El formulario pide: proveedor (texto libre, ej. "Luz"), período (texto libre, ej. "Agosto 2026") y monto total.
- Al confirmar, se crea una fila en [[boletas]] con `cantidad_integrantes` (los [[members]] activos en ese momento) y `monto_por_persona` ya calculados y congelados.
- Se muestra una confirmación clara con el desglose (ej. "Boleta de Luz (Agosto 2026): $45.000 → $15.000 por persona × 3 integrantes").
- Si no hay ningún integrante activo, se muestra un mensaje claro en vez de dejar cargar la boleta (no se puede repartir entre cero personas).

## Fuera de alcance de esta historia

- Automatizar la obtención del monto (ver [[2026-08-31-boletas-manuales]]).
- Ver el historial de boletas cargadas.
- Editar o eliminar una boleta ya cargada.
- Cualquier criterio de reparto distinto a partes iguales.

## Referencias

Modelo: [[boletas]]. Decisión: [[2026-08-31-boletas-manuales]].
