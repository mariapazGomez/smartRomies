# US-05: Alta de integrantes (onboarding)

**Como** integrante del hogar,
**quiero** poder agregar a los integrantes del hogar desde la propia app,
**para** no depender de cargar datos a mano en Supabase antes de poder usar la app.

## Contexto

[[US-01-registrar-uso]] asume que ya existen [[members]] activos para elegir. En la práctica, una base nueva arranca sin integrantes: en vez de sembrarlos a mano con una migración (con nombres de ejemplo que luego habría que corregir), se resolvió agregarlos desde la UI, como un paso de onboarding. Esto ya estaba contemplado como mutación server-side en [[2026-08-28-seguridad-sin-auth]] ("crear integrante" pasa por el backend con la service role key), así que no requiere ningún cambio de arquitectura ni de esquema.

## Criterios de aceptación

- Si no hay ningún `member` con `activo = true`, la pantalla principal muestra un formulario para agregar integrantes (nombre + botón "Agregar") en vez del flujo de [[US-01-registrar-uso]].
- Al agregar un nombre, se crea una fila en [[members]] (`activo = true` por default) y aparece de inmediato en la lista, sin recargar la página.
- Nombres duplicados (constraint `UNIQUE` en `members.nombre`) muestran un mensaje claro ("Ya existe un integrante con ese nombre") en vez de un error crudo.
- Una vez que hay al menos un integrante activo, la app pasa a mostrar el flujo normal de [[US-01-registrar-uso]].
- Con integrantes ya cargados, sigue existiendo un acceso simple ("+ agregar integrante") para sumar a alguien nuevo más adelante, sin tener que vaciar la tabla.

## Fuera de alcance de esta historia

- Editar o desactivar (`activo = false`) integrantes existentes — ya se puede hacer directo en Supabase mientras no haga falta desde la UI.
- Cualquier validación de identidad al agregar un nombre (sigue sin haber login, ver [[2026-08-28-seguridad-sin-auth]]).

## Referencias

Modelo: [[members]]. Decisión de seguridad: [[2026-08-28-seguridad-sin-auth]]. Historia dependiente: [[US-01-registrar-uso]].
