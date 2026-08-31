# SmartRomies

Webapp para dividir de forma clara las cuentas de un hogar compartido, con historial consultable. Primera funcionalidad: registrar usos de lavadora/secadora y saber cuánto le corresponde pagar a cada integrante.

## Fuente de verdad del contexto

Todo el contexto del proyecto — reglas de trabajo, decisiones de arquitectura, modelo de datos y historias de usuario — vive en el vault de Obsidian versionado en [`/vault`](./vault/00-Index.md). Antes de desarrollar cualquier funcionalidad nueva, se documenta ahí primero (ver [reglas de trabajo](./vault/01-Decisiones/2026-08-28-reglas-de-trabajo.md)).

## Stack

- **TypeScript + Next.js** (App Router), mobile-first.
- **Supabase** (Postgres) como base de datos — esquema en [`supabase/migrations`](./supabase/migrations).
- **Vercel** para despliegue.

## Desarrollo local

```bash
cp .env.example .env   # completar con las credenciales del proyecto Supabase
npm install
npm run dev             # http://localhost:3000
```

Sin un `.env` completo, la app igual levanta: `GET /api/health` responde un error controlado indicando qué variable falta.

Otros scripts: `npm run build` (build de producción), `npm run lint`.

## Estado actual

Flujo de registrar un uso de lavadora/secadora implementado (perfil → acción → confirmar), con alta de integrantes desde la propia app. Ver [changelog](./vault/04-Changelog.md) para la línea de tiempo completa y próximos pasos.
