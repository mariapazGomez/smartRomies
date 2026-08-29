# ADR: Scaffold de la webapp Next.js

- **Fecha**: 2026-08-28
- **Estado**: Aceptado

## Contexto

Con el modelo de datos v1 ya definido y en `main` (ver [[2026-08-28-modelo-datos-v1-alcance]] y [[2026-08-28-seguridad-sin-auth]]), tocaba armar el esqueleto de la webapp donde va a vivir la primera historia de usuario ([[US-01-registrar-uso]]).

## Decisión

1. **Next.js 15 + TypeScript + Tailwind 4, con App Router** (`src/app`), mobile-first según lo definido en el README.
2. El proyecto se armó **a mano** (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`) en lugar de `create-next-app`, para controlar exactamente qué dependencias entran y evitar el boilerplate de ejemplo que trae el generador (ya sabemos qué vamos a construir).
3. Estructura mínima:
   - `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` — shell y placeholder de la app.
   - `src/app/api/health/route.ts` — endpoint de salud que verifica conectividad con Supabase.
   - `src/lib/supabase/server.ts` — único punto de creación del cliente Supabase, marcado `server-only` y usando la service role key, en línea con [[2026-08-28-seguridad-sin-auth]] (nunca se crea un cliente Supabase con esa key fuera de este módulo).
4. `.env.example` documenta `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` sin prefijo `NEXT_PUBLIC_` a propósito; `.env` real queda en `.gitignore` y sin valores hasta que exista un proyecto Supabase.
5. `createSupabaseServerClient()` lanza un error explícito y legible si faltan las variables de entorno, en vez de fallar de forma críptica. `/api/health` captura ese error y responde `{ ok: false, error: ... }` con status 500 controlado — no un crash del proceso — lo cual permite validar el scaffold end-to-end incluso sin credenciales reales de Supabase.

## Consecuencias

- Verificado localmente: `npm install`, `npm run build` y `npm run dev` funcionan sin errores; `GET /` responde 200 y `GET /api/health` responde el JSON de error controlado esperado (sin `.env` completo).
- Cualquier acceso a Supabase desde código nuevo debe pasar por `createSupabaseServerClient()` — no crear clientes Supabase alternativos en otros archivos.
- Próxima iteración: implementar [[US-01-registrar-uso]] sobre este scaffold, en su propia rama.
