# SmartRomies — Índice del Vault

Este vault es la fuente de verdad del contexto del proyecto: por qué se toman las decisiones, cómo está diseñado el modelo de datos, qué funcionalidades existen y cuándo cambió cada cosa. Antes de programar cualquier funcionalidad nueva, se documenta aquí primero.

## Qué es SmartRomies

Webapp para dividir de forma clara las cuentas de un hogar compartido, accesible desde el celular. Primera funcionalidad: registrar usos de lavadora/secadora y saber cuánto le corresponde pagar a cada integrante.

## Mapa del vault

- [[2026-08-28-reglas-de-trabajo|01-Decisiones/Reglas de trabajo]] — flujo de documentación, branching en git, stack tecnológico.
- [[2026-08-28-modelo-datos-v1-alcance|01-Decisiones/Alcance del modelo de datos v1]] — qué entra y qué queda fuera de esta primera versión.
- [[2026-08-28-seguridad-sin-auth|01-Decisiones/Seguridad sin autenticación de usuarios]] — cómo se protege Supabase sin login individual.
- [[2026-08-31-boletas-manuales|01-Decisiones/Boletas variables — ingreso manual]] — por qué no se automatiza el scraping y cómo se prorratea.
- [[00-Overview|02-Modelo-de-Datos/Overview]] — relaciones entre tablas.
  - [[members|members]]
  - [[action_types|action_types]]
  - [[usage_records|usage_records]]
  - [[boletas|boletas]]
  - [[proveedores|proveedores]]
  - [[99-Futuro-fuera-de-alcance|Futuro / fuera de alcance]]
- Historias de usuario: [[US-01-registrar-uso]] · [[US-02-ver-historial]] · [[US-03-resumen-por-persona]] · [[US-04-actualizar-precio]] · [[US-05-alta-integrantes]] · [[US-06-cargar-boleta]] · [[US-07-resumen-del-mes]] · [[US-08-resumen-por-integrante]]
- [[04-Changelog|Changelog]] — línea de tiempo de todos los cambios del proyecto.

## Stack tecnológico

- **Frontend/Backend**: TypeScript + Next.js (App Router), pensado mobile-first.
- **Base de datos**: Supabase (Postgres).
- **Despliegue**: Vercel.
- **Documentación/contexto**: este vault de Obsidian, versionado junto al código en `/vault`.
