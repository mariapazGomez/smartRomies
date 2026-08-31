# Changelog — Línea de tiempo del proyecto

Registro cronológico de cambios relevantes (funcionalidades, decisiones de modelo de datos, arquitectura). Cada entrada nueva se agrega **al principio**, con fecha. El detalle completo de cada decisión vive en su propia nota (ADR, ficha de tabla, historia de usuario) — aquí solo el resumen y el enlace.

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
