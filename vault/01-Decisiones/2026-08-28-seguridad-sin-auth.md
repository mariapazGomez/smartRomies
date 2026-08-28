# ADR: Seguridad de acceso a Supabase sin autenticación de usuarios

- **Fecha**: 2026-08-28
- **Estado**: Aceptado

## Contexto

Se decidió que, por ahora, los integrantes del hogar no tienen login individual: eligen su perfil de una lista en la UI (ver [[2026-08-28-modelo-datos-v1-alcance]]). Esto es más simple de usar desde el celular, pero significa que **no hay identidad verificada** de quién hace cada petición al backend.

Si la webapp escribiera directamente en Supabase desde el navegador usando la `anon key`, cualquier visitante con esa key (que es pública por diseño) podría insertar, editar o borrar registros de uso arbitrariamente, sin ninguna autenticación de por medio.

## Decisión

1. Las tablas de Supabase tienen **Row Level Security (RLS) habilitado** desde la primera migración (`supabase/migrations/0001_init_schema.sql`).
2. **No se crean policies permisivas para el rol `anon`/cliente.** Sin policies explícitas, RLS deniega todo por defecto.
3. Todas las mutaciones (crear integrante, registrar un uso, actualizar precio) pasan por el **backend de Next.js** (API routes o server actions), que usa la **service role key** de Supabase solo del lado del servidor (variable de entorno no expuesta al cliente, ej. `SUPABASE_SERVICE_ROLE_KEY` en `.env`, nunca con prefijo `NEXT_PUBLIC_`). La service role key ignora RLS.
4. El cliente (navegador) nunca tiene la service role key ni escribe directo a Supabase.

## Consecuencias

- Esta decisión debe respetarse cuando se diseñe la webapp (próxima iteración): toda escritura a `usage_records`, `members` o `action_types` se implementa como endpoint server-side, no como llamada directa del cliente al SDK de Supabase para mutaciones.
- Lecturas (ej. listar historial) pueden eventualmente exponerse vía policies de solo lectura si se justifica, pero no es necesario para el MVP — también pueden pasar por el backend por simplicidad y consistencia.
- Si más adelante se agrega autenticación real (ver [[99-Futuro-fuera-de-alcance]]), este ADR debe revisarse: se podría migrar a policies de RLS basadas en `auth.uid()` en lugar de centralizar todo en el backend.
