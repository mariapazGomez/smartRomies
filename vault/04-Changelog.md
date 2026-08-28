# Changelog — Línea de tiempo del proyecto

Registro cronológico de cambios relevantes (funcionalidades, decisiones de modelo de datos, arquitectura). Cada entrada nueva se agrega **al principio**, con fecha. El detalle completo de cada decisión vive en su propia nota (ADR, ficha de tabla, historia de usuario) — aquí solo el resumen y el enlace.

---

## 2026-08-28 — Setup inicial: reglas de trabajo, vault y modelo de datos v1

- Se definieron las reglas de trabajo del proyecto: documentar antes de desarrollar, una rama por funcionalidad, merge solo tras probar. Ver [[2026-08-28-reglas-de-trabajo]].
- Se creó este vault de Obsidian, versionado dentro del repo en `/vault`.
- Se diseñó el modelo de datos v1 para el registro de usos de lavadora/secadora: tablas [[members]], [[action_types]] y [[usage_records]]. Ver [[2026-08-28-modelo-datos-v1-alcance]] y el DDL en `supabase/migrations/0001_init_schema.sql`.
- Se decidió cómo proteger las escrituras a Supabase sin tener login de usuarios (mutaciones vía backend con service role key, RLS sin policies permisivas para el cliente). Ver [[2026-08-28-seguridad-sin-auth]].
- Se documentaron las primeras 4 historias de usuario: [[US-01-registrar-uso]], [[US-02-ver-historial]], [[US-03-resumen-por-persona]], [[US-04-actualizar-precio]].
- Rama de trabajo: `setup/vault-modelo-datos`. Aún no se ha scaffoldeado la webapp Next.js — es la siguiente iteración.
