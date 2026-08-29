import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase server-only. Usa la service role key, que ignora RLS,
 * por lo que NUNCA debe importarse desde un Client Component ni exponerse
 * al navegador. Ver vault/01-Decisiones/2026-08-28-seguridad-sin-auth.md.
 */
export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno. Completa .env (ver .env.example)."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
