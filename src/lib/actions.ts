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

export type Proveedor = {
  codigo: string;
  nombre: string;
};

export type Boleta = {
  proveedorNombre: string;
  periodo: string;
  montoTotal: number;
  cantidadIntegrantes: number;
  montoPorPersona: number;
};

/**
 * Cargar una boleta variable (ver vault/03-Historias-de-Usuario/US-06-cargar-boleta.md).
 * `proveedorCodigo` se valida contra el catálogo `proveedores` (ver
 * vault/02-Modelo-de-Datos/proveedores.md) en vez de aceptar texto libre, para
 * poder agregar montos por proveedor de forma confiable más adelante.
 * `cantidad_integrantes`/`monto_por_persona` se calculan contra los members activos
 * en este mismo momento y quedan congelados (ver vault/01-Decisiones/2026-08-31-boletas-manuales.md):
 * no se recalculan si después cambia la cantidad de integrantes.
 */
export async function cargarBoleta(
  proveedorCodigo: string,
  periodo: string,
  montoTotal: number
): Promise<ActionResult<Boleta>> {
  const periodoLimpio = periodo.trim();

  if (!proveedorCodigo || !periodoLimpio) {
    return { ok: false, error: "Completá proveedor y período." };
  }
  if (!Number.isFinite(montoTotal) || montoTotal <= 0) {
    return { ok: false, error: "El monto tiene que ser mayor a cero." };
  }

  const supabase = createSupabaseServerClient();

  const { data: proveedor, error: proveedorError } = await supabase
    .from("proveedores")
    .select("nombre")
    .eq("codigo", proveedorCodigo)
    .eq("activo", true)
    .single();

  if (proveedorError || !proveedor) {
    return { ok: false, error: "El proveedor elegido ya no está disponible." };
  }

  const { count, error: countError } = await supabase
    .from("members")
    .select("id", { count: "exact", head: true })
    .eq("activo", true);

  if (countError) {
    return { ok: false, error: countError.message };
  }
  if (!count) {
    return {
      ok: false,
      error: "No hay integrantes activos para repartir la boleta.",
    };
  }

  const montoTotalRedondeado = Math.round(montoTotal);
  const montoPorPersona = Math.round(montoTotalRedondeado / count);

  const { error: insertError } = await supabase.from("boletas").insert({
    proveedor_codigo: proveedorCodigo,
    periodo: periodoLimpio,
    monto_total: montoTotalRedondeado,
    cantidad_integrantes: count,
    monto_por_persona: montoPorPersona,
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  return {
    ok: true,
    data: {
      proveedorNombre: proveedor.nombre,
      periodo: periodoLimpio,
      montoTotal: montoTotalRedondeado,
      cantidadIntegrantes: count,
      montoPorPersona,
    },
  };
}
