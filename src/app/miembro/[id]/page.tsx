import Link from "next/link";
import Avatar from "@/components/Avatar";
import ResumenMes from "@/components/ResumenMes";
import AccionesMiembro from "@/components/AccionesMiembro";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrecio } from "@/lib/format";
import {
  CANTIDAD_MESES_SELECTOR,
  mesesDisponibles,
  rangoDeMes,
  resolverMesSeleccionado,
} from "@/lib/meses";

export const dynamic = "force-dynamic";

export default async function PaginaMiembro({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mes?: string }>;
}) {
  const { id } = await params;
  const { mes: mesParam } = await searchParams;
  const meses = mesesDisponibles(CANTIDAD_MESES_SELECTOR);
  const mesSeleccionado = resolverMesSeleccionado(mesParam, meses);

  const supabase = createSupabaseServerClient();

  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id, nombre")
    .eq("id", id)
    .eq("activo", true)
    .single();

  if (memberError || !member) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6 py-10">
        <h1 className="text-2xl font-semibold">SmartRomies</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No encontramos ese integrante.
        </p>
        <Link href="/" className="text-sm underline">
          Volver
        </Link>
      </main>
    );
  }

  try {
    const { desde, hasta } = rangoDeMes(mesSeleccionado);
    const [actionTypesRes, proveedoresRes, usosMiembroRes, boletasMesRes] = await Promise.all([
      supabase
        .from("action_types")
        .select("codigo, nombre, precio_actual")
        .eq("activo", true)
        .order("nombre"),
      supabase
        .from("proveedores")
        .select("codigo, nombre")
        .eq("activo", true)
        .order("nombre"),
      // Filtrado por member_id: este resumen es de este integrante, no del hogar entero.
      supabase
        .from("usage_records")
        .select("action_type_codigo, precio_cobrado")
        .eq("member_id", member.id)
        .gte("fecha_uso", desde)
        .lt("fecha_uso", hasta),
      supabase
        .from("boletas")
        .select("proveedor_codigo, monto_por_persona")
        .gte("created_at", desde)
        .lt("created_at", hasta),
    ]);

    if (actionTypesRes.error) throw actionTypesRes.error;
    if (proveedoresRes.error) throw proveedoresRes.error;
    if (usosMiembroRes.error) throw usosMiembroRes.error;
    if (boletasMesRes.error) throw boletasMesRes.error;

    const actionTypes = actionTypesRes.data;
    const proveedores = proveedoresRes.data;

    // Ver vault/03-Historias-de-Usuario/US-08-resumen-por-integrante.md: el desglose
    // por tipo de esta página es de este integrante — sus usos, y su parte
    // (monto_por_persona, ya congelada e igualitaria) de cada boleta del mes.
    const totalPorActionType = new Map<string, number>();
    for (const row of usosMiembroRes.data) {
      totalPorActionType.set(
        row.action_type_codigo,
        (totalPorActionType.get(row.action_type_codigo) ?? 0) + row.precio_cobrado
      );
    }
    const totalPorProveedor = new Map<string, number>();
    for (const row of boletasMesRes.data) {
      totalPorProveedor.set(
        row.proveedor_codigo,
        (totalPorProveedor.get(row.proveedor_codigo) ?? 0) + row.monto_por_persona
      );
    }
    const resumenMes = [
      ...actionTypes.map((actionType) => ({
        nombre: actionType.nombre,
        total: totalPorActionType.get(actionType.codigo) ?? 0,
      })),
      ...proveedores.map((proveedor) => ({
        nombre: proveedor.nombre,
        total: totalPorProveedor.get(proveedor.codigo) ?? 0,
      })),
    ];

    const totalUsosMiembro = usosMiembroRes.data.reduce(
      (sum, row) => sum + row.precio_cobrado,
      0
    );
    const totalBoletasMiembro = boletasMesRes.data.reduce(
      (sum, row) => sum + row.monto_por_persona,
      0
    );
    const totalDelMes = totalUsosMiembro + totalBoletasMiembro;

    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-10">
        <Link href="/" className="text-sm text-neutral-500 underline">
          ← Cambiar de integrante
        </Link>
        <div className="flex items-center gap-4">
          <Avatar nombre={member.nombre} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold">{member.nombre}</h1>
            <p className="text-sm text-neutral-500">Debe pagar este mes</p>
            <p className="text-2xl font-bold">{formatPrecio(totalDelMes)}</p>
          </div>
        </div>
        <ResumenMes items={resumenMes} mesSeleccionado={mesSeleccionado} meses={meses} />
        <AccionesMiembro member={member} actionTypes={actionTypes} proveedores={proveedores} />
      </main>
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6 py-10">
        <h1 className="text-2xl font-semibold">SmartRomies</h1>
        <p className="text-sm text-red-600 dark:text-red-400">
          No se pudo conectar con la base de datos: {message}
        </p>
      </main>
    );
  }
}
