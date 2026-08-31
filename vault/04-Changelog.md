# Changelog — Línea de tiempo del proyecto

Registro cronológico de cambios relevantes (funcionalidades, decisiones de modelo de datos, arquitectura). Cada entrada nueva se agrega **al principio**, con fecha. El detalle completo de cada decisión vive en su propia nota (ADR, ficha de tabla, historia de usuario) — aquí solo el resumen y el enlace.

---

## 2026-08-31 — Proveedor de boleta pasa a catálogo (selector), no texto libre

- Se probó el flujo con la boleta de agua (Esval, `https://www.esval.cl/personas/pago`): mismo resultado que Chilquinta — sin API pública y con el formulario de deuda protegido con reCAPTCHA (`onsubmit="return verificarRecaptcha()"`), tampoco se automatiza. No hizo falta desarrollar nada nuevo: el flujo genérico de "Cargar boleta" ya sirve para cualquier proveedor.
- A pedido del usuario, para poder agregar montos por proveedor de forma confiable más adelante, `boletas.proveedor` (texto libre) pasa a `boletas.proveedor_codigo` (FK a una tabla catálogo nueva `proveedores`, mismo rol que `action_types` para `usage_records`). Ver actualización del ADR [[2026-08-31-boletas-manuales]] y la ficha [[proveedores]].
- `supabase/migrations/0003_proveedores.sql`: crea `proveedores` (sembrada con `luz`/`agua`/`gas`) y migra `boletas.proveedor` → `boletas.proveedor_codigo`. Asume `boletas` sin filas cargadas todavía (la migración falla, sin corromper datos, si ya hubiera boletas).
- `src/lib/actions.ts` (`cargarBoleta`), `src/app/page.tsx` (trae `proveedores` activos), `src/components/Home.tsx` y `src/components/CargarBoleta.tsx` (selector en vez de input de texto) actualizados.
- Verificado: `npm run build`/`npm run lint` sin errores. **Pendiente**: aplicar `0003_proveedores.sql` en el SQL Editor de Supabase (el usuario ya había corrido la 0002 antes de este cambio) antes de poder probar `cargarBoleta` de nuevo.

---

## 2026-08-31 — Cargar boleta variable (US-06), ingreso manual en vez de scraping

- El usuario pidió automatizar el monto de la boleta de luz (Chilquinta) por web scraping. Se investigó el sitio (`chilquinta.cl`, `/cobros-cuenta`, `/consultas`): es una SPA protegida con reCAPTCHA en todas sus páginas, sin API pública de desarrollador. Sortear reCAPTCHA es evadir un mecanismo anti-bot y probablemente viola los TOS de Chilquinta — se descartó la automatización. Detalle completo en [[2026-08-31-boletas-manuales]].
- En su lugar, se implementó [[US-06-cargar-boleta]]: ingreso manual del monto desde la app, con prorrateo automático en **partes iguales** entre los integrantes activos. `cantidad_integrantes`/`monto_por_persona` quedan congelados al momento de la carga (mismo principio que `usage_records.precio_cobrado`).
- Modelo nuevo: tabla `boletas` (sin FK a las demás — el reparto es una cifra por integrante, no un evento por persona). Ver [[boletas]] y migración `supabase/migrations/0002_boletas.sql`.
- Se actualizó [[99-Futuro-fuera-de-alcance]]: "prorrateo de boletas variables" pasa de idea futura a v1 (acotado a ingreso manual + partes iguales; automatización, otros criterios de reparto e historial de boletas siguen fuera de alcance).
- UI: `src/components/Home.tsx` agrega un selector "Registrar uso" / "Cargar boleta"; nuevo `src/components/CargarBoleta.tsx` y server action `cargarBoleta` en `src/lib/actions.ts`.
- Verificado: `npm run build`/`npm run lint` sin errores. **Pendiente**: aplicar `0002_boletas.sql` en el SQL Editor de Supabase (no se pudo aplicar desde acá — solo hay acceso vía REST con la service role key, que no ejecuta DDL) antes de poder probar `cargarBoleta` contra la base real o en el navegador.
- Sigue en `feature/registrar-uso`, pendiente de que el usuario aplique la migración y pruebe el flujo.

---

## 2026-08-31 — Selección múltiple de acciones en US-01

- A pedido del usuario, tras probar el flujo: registrar un uso ahora permite elegir **más de un tipo de acción a la vez** (ej. lavado + secado en la misma tanda), en vez de una sola acción por registro. Se actualizaron los criterios de aceptación de [[US-01-registrar-uso]].
- Diseño: cada acción elegida sigue generando **su propia fila** en `usage_records` (mismo `member_id`/`fecha_uso`, precio propio), no una fila combinada — así no cambia el esquema ni se rompe el historial ([[US-02-ver-historial]]) ni el resumen por persona ([[US-03-resumen-por-persona]]).
- `src/lib/actions.ts`: `registrarUso` pasa a recibir un array de `action_type_codigo`, inserta todas las filas en un solo `insert` (atómico) y devuelve el detalle + total.
- `src/components/RegistrarUso.tsx`: el paso de elegir acción pasa a ser multi-selección (toggle) con un botón "Continuar"; la pantalla de confirmar muestra el detalle ítem por ítem y el total.
- Verificado: `npm run build`/`npm run lint` sin errores; probado contra el Supabase real con un script puntual (lavado + secado → 2 filas con el mismo `fecha_uso`, total $4.000), dejando la base limpia después.
- Sigue en la rama `feature/registrar-uso`, pendiente de que el usuario pruebe el flujo completo en el navegador.

---

## 2026-08-31 — US-01 registrar uso + US-05 alta de integrantes

- Se documentó [[US-05-alta-integrantes]]: como `members` arranca vacía y el usuario prefirió no sembrarla a mano con nombres de ejemplo, se agrega un onboarding en la propia UI para cargar integrantes (mutación ya contemplada en [[2026-08-28-seguridad-sin-auth]]).
- Se implementó [[US-01-registrar-uso]]: flujo de 3 toques (elegir perfil → elegir acción → confirmar) sobre la pantalla principal, con mensaje de confirmación y precio congelado en el momento del registro.
- Rama: `feature/registrar-uso` (creada desde `setup/webapp-scaffold`, que todavía no está mergeada a `main`).
- Archivos nuevos: `src/lib/actions.ts` (server actions `addMember` / `registrarUso`), `src/components/Home.tsx`, `src/components/AddMemberForm.tsx`, `src/components/RegistrarUso.tsx`. `src/app/page.tsx` pasó a ser un Server Component que trae `members`/`action_types` de Supabase y quedó marcado `export const dynamic = "force-dynamic"` (si no, Next.js lo prerenderizaba estático en build y congelaba los datos).
- Se corrigió `eslint.config.mjs`: no excluía `.next/` ni `next-env.d.ts`, lo que hacía fallar `npm run lint` con cientos de errores ajenos al código del proyecto (bug preexistente del scaffold, no de esta feature).
- Verificado: `npm run build` y `npm run lint` sin errores; `/` responde 200 y muestra el onboarding cuando `members` está vacía (confirmado contra el Supabase real, ya conectado en `.env`); se probó `addMember` (alta + detección de nombre duplicado) y `registrarUso` (precio congelado correctamente) con un script puntual contra la base real, dejándola limpia después. No se pudo probar clic a clic en navegador (sin acceso a Chrome en esta sesión) — falta que el usuario lo pruebe manualmente en `npm run dev`.
- Pendiente: revisión del usuario en la rama antes de merge a `main` (que a su vez requiere primero resolver el merge de `setup/webapp-scaffold`); push a GitHub solo con confirmación explícita.

---

## 2026-08-28 — Scaffold de la webapp

- Se hizo merge de `setup/vault-modelo-datos` a `main` y push a `origin` (GitHub: `mariapazGomez/smartRomies`). El vault y el modelo de datos v1 ya están en `main` remoto.
- Se armó el esqueleto de la webapp en la rama `setup/webapp-scaffold`: Next.js 15 + TypeScript + Tailwind 4, App Router, cliente Supabase server-only. Detalle y justificación en [[2026-08-28-scaffold-webapp-nextjs]].
- Archivos: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.env.example`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/api/health/route.ts`, `src/lib/supabase/server.ts`. `.env` local queda con `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` vacías (aún no existe proyecto Supabase).
- Verificado localmente: `npm install`, `npm run build` y `npm run dev` sin errores; `GET /` responde 200; `GET /api/health` responde `{ ok: false, error: ... }` (status 500 controlado, sin crash) por faltar credenciales reales de Supabase — comportamiento esperado en este punto.
- README raíz actualizado con instrucciones de instalación y desarrollo local.
- Pendiente: revisión del usuario en la rama antes de merge a `main`; push a GitHub solo con confirmación explícita.
- Después de este scaffold: implementar las historias de usuario una por una, cada una en su propia rama — empezar por [[US-01-registrar-uso]].

---

## 2026-08-28 — Setup inicial: reglas de trabajo, vault y modelo de datos v1

- Se definieron las reglas de trabajo del proyecto: documentar antes de desarrollar, una rama por funcionalidad, merge solo tras probar. Ver [[2026-08-28-reglas-de-trabajo]].
- Se creó este vault de Obsidian, versionado dentro del repo en `/vault`.
- Se diseñó el modelo de datos v1 para el registro de usos de lavadora/secadora: tablas [[members]], [[action_types]] y [[usage_records]]. Ver [[2026-08-28-modelo-datos-v1-alcance]] y el DDL en `supabase/migrations/0001_init_schema.sql`.
- Se decidió cómo proteger las escrituras a Supabase sin tener login de usuarios (mutaciones vía backend con service role key, RLS sin policies permisivas para el cliente). Ver [[2026-08-28-seguridad-sin-auth]].
- Se documentaron las primeras 4 historias de usuario: [[US-01-registrar-uso]], [[US-02-ver-historial]], [[US-03-resumen-por-persona]], [[US-04-actualizar-precio]].
- Rama de trabajo: `setup/vault-modelo-datos`. Aún no se ha scaffoldeado la webapp Next.js — es la siguiente iteración.
