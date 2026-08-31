# ADR: Boletas variables — ingreso manual en vez de scraping, prorrateo en partes iguales

- **Fecha**: 2026-08-31
- **Estado**: Aceptado

## Contexto

`vault/02-Modelo-de-Datos/99-Futuro-fuera-de-alcance.md` ya dejaba anotada la idea de una tabla `boletas` para prorratear gastos variables del hogar (luz, agua, gas), sin resolver cómo obtener el monto ni cómo repartirlo. El usuario pidió retomarlo, empezando por la boleta de luz (Chilquinta), y propuso automatizar la obtención del monto por web scraping.

Se investigó `https://www.chilquinta.cl/` (incluyendo `/cobros-cuenta` y `/consultas`, los caminos hacia la consulta de deuda por número de cliente): es una SPA (Nuxt/Vue) que carga `google.com/recaptcha/api.js` en todas sus páginas. No se encontró una API pública ni de desarrollador de Chilquinta — solo su web de consumidor y agregadores de pago de terceros (Servipag, Sencillito), tampoco con API abierta.

## Decisión

1. **No se automatiza la obtención del monto.** Sortear reCAPTCHA es evadir un mecanismo diseñado específicamente para bloquear acceso automatizado, y probablemente viola los términos de servicio de Chilquinta — independientemente de que el uso final (repartir la cuenta propia entre los integrantes) sea legítimo. Si en el futuro Chilquinta (u otro proveedor) publica una API oficial, esto se revisa.
2. **Ingreso manual**: alguien entra al sitio de la compañía, ve el monto adeudado, y lo carga a mano en SmartRomies vía un formulario simple (proveedor, período, monto total).
3. **Prorrateo en partes iguales** entre los integrantes activos al momento de cargar la boleta — no proporcional a uso de lavadora/secadora ni a ningún otro criterio.
4. **Se congela `cantidad_integrantes` y `monto_por_persona`** en la fila de `boletas` al momento de la carga (mismo principio que `usage_records.precio_cobrado`, ver `vault/02-Modelo-de-Datos/usage_records.md`): si después cambia la cantidad de integrantes activos, las boletas ya cargadas no se recalculan.
5. `monto_por_persona = round(monto_total / cantidad_integrantes)`. Puede quedar una diferencia de unos pocos pesos entre `monto_por_persona × cantidad_integrantes` y `monto_total` por el redondeo — se acepta como simplificación de v1, no se trackea a nivel de centavos.

Detalle del modelo en `vault/02-Modelo-de-Datos/boletas.md`. Historia de usuario: `vault/03-Historias-de-Usuario/US-06-cargar-boleta.md`.

## Consecuencias

- No hace falta guardar ninguna credencial de terceros ni exponer a SmartRomies a los términos de servicio de otro sitio.
- `boletas` es una tabla independiente (no tiene FK a `members` ni a `usage_records`), porque el reparto es una única cifra por integrante, no un evento por persona.
- Queda pendiente (fuera de alcance de esta iteración, ver `99-Futuro-fuera-de-alcance.md`): historial/listado de boletas cargadas, ajustar el reparto si cambia la cantidad de integrantes, y cualquier automatización futura si aparece una vía legítima (ej. una API oficial).
