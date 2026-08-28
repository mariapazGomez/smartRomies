# ADR: Reglas de trabajo del proyecto

- **Fecha**: 2026-08-28
- **Estado**: Aceptado

## Contexto

Necesitamos que el desarrollo de SmartRomies sea trazable en el tiempo y que no se pierda el contexto de por qué se tomó cada decisión, especialmente porque el trabajo avanza en sesiones separadas.

## Decisión

1. **Documentar antes de desarrollar**: cualquier funcionalidad o cambio de modelo de datos se documenta primero en este vault (decisión + diseño) antes de escribir código de implementación.
2. **Una rama por funcionalidad**: todo desarrollo nuevo se hace en una rama propia (`tipo/nombre-corto`, ej. `feat/registro-uso`, `setup/vault-modelo-datos`). No se desarrolla directamente sobre `main`.
3. **Merge solo tras probar**: una funcionalidad se mergea a `main` solo después de haber sido probada (manualmente o con tests, según aplique). No se mergea código sin verificar.
4. **Changelog vivo**: cada cambio relevante (funcionalidad nueva, cambio de modelo de datos, decisión de arquitectura) se agrega como entrada fechada en [[04-Changelog]], además de la documentación de diseño correspondiente.
5. **Decisiones como ADR**: decisiones de arquitectura o de modelo de datos se registran como ADR (Architecture Decision Record) en `01-Decisiones/`, con fecha, contexto y decisión — no solo el "qué" sino el "por qué".

## Stack tecnológico acordado

- **TypeScript** + **Next.js** (App Router) como framework de la webapp, mobile-first.
- **Supabase** (Postgres) como base de datos.
- **Vercel** para despliegue.
- **Obsidian vault** (`/vault`, versionado en el repo) como bitácora de contexto y decisiones.

## Consecuencias

- Cada sesión de trabajo debe empezar revisando el vault (especialmente el Changelog y las ADRs recientes) antes de proponer cambios, para no perder contexto ni contradecir decisiones ya tomadas.
- El vault vive dentro del repo, por lo que su historial de cambios queda alineado con el historial de código en git (ver [[2026-08-28-modelo-datos-v1-alcance]] para el primer caso de aplicación de esta regla).
