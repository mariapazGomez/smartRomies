"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type Member = {
  id: string;
  nombre: string;
};

export type ActionType = {
  codigo: string;
  nombre: string;
  precio_actual: number;
};

/**
 * Alta de integrante (ver vault/03-Historias-de-Usuario/US-05-alta-integrantes.md).
 * `members.nombre` es UNIQUE: un duplicado se traduce a un mensaje legible en vez
 * del error crudo de Postgres (código 23505).
 */
export async function addMember(
  nombre: string
): Promise<ActionResult<Member>> {
  const nombreLimpio = nombre.trim();
  if (!nombreLimpio) {
    return { ok: false, error: "El nombre no puede estar vacío." };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("members")
    .insert({ nombre: nombreLimpio })
    .select("id, nombre")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Ya existe un integrante con ese nombre." };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true, data };
}

/**
 * Registrar un uso (ver vault/03-Historias-de-Usuario/US-01-registrar-uso.md).
 * `precio_cobrado` se congela leyendo `action_types.precio_actual` en este mismo
 * momento (no se confía en un precio ya cacheado en el cliente), en línea con
 * vault/02-Modelo-de-Datos/usage_records.md.
 */
export async function registrarUso(
  memberId: string,
  actionTypeCodigo: string
): Promise<ActionResult<{ actionNombre: string; precio: number }>> {
  const supabase = createSupabaseServerClient();

  const { data: actionType, error: actionTypeError } = await supabase
    .from("action_types")
    .select("nombre, precio_actual")
    .eq("codigo", actionTypeCodigo)
    .eq("activo", true)
    .single();

  if (actionTypeError || !actionType) {
    return { ok: false, error: "El tipo de acción ya no está disponible." };
  }

  const { error: insertError } = await supabase.from("usage_records").insert({
    member_id: memberId,
    action_type_codigo: actionTypeCodigo,
    precio_cobrado: actionType.precio_actual,
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  return {
    ok: true,
    data: { actionNombre: actionType.nombre, precio: actionType.precio_actual },
  };
}
