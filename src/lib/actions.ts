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
 * Registrar uno o más usos a la vez (ver vault/03-Historias-de-Usuario/US-01-registrar-uso.md).
 * Cada `actionTypeCodigo` elegido genera su propia fila en usage_records (mismo
 * member_id/fecha_uso, precio propio), en vez de una sola fila combinada, para
 * mantener el principio de "una fila = un evento" (vault/02-Modelo-de-Datos/usage_records.md).
 * `precio_cobrado` se congela leyendo `action_types.precio_actual` en este mismo
 * momento (no se confía en un precio ya cacheado en el cliente).
 */
export async function registrarUso(
  memberId: string,
  actionTypeCodigos: string[]
): Promise<
  ActionResult<{ items: { actionNombre: string; precio: number }[]; total: number }>
> {
  const codigos = [...new Set(actionTypeCodigos)];
  if (codigos.length === 0) {
    return { ok: false, error: "Elegí al menos un tipo de acción." };
  }

  const supabase = createSupabaseServerClient();

  const { data: actionTypes, error: actionTypesError } = await supabase
    .from("action_types")
    .select("codigo, nombre, precio_actual")
    .in("codigo", codigos)
    .eq("activo", true);

  if (actionTypesError || !actionTypes || actionTypes.length !== codigos.length) {
    return { ok: false, error: "Algún tipo de acción ya no está disponible." };
  }

  const fechaUso = new Date().toISOString();
  const { error: insertError } = await supabase.from("usage_records").insert(
    actionTypes.map((actionType) => ({
      member_id: memberId,
      action_type_codigo: actionType.codigo,
      precio_cobrado: actionType.precio_actual,
      fecha_uso: fechaUso,
    }))
  );

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  return {
    ok: true,
    data: {
      items: actionTypes.map((actionType) => ({
        actionNombre: actionType.nombre,
        precio: actionType.precio_actual,
      })),
      total: actionTypes.reduce((sum, actionType) => sum + actionType.precio_actual, 0),
    },
  };
}
