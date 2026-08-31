import Home from "@/components/Home";
import ResumenMes from "@/components/ResumenMes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Los datos vienen de Supabase y cambian con cada alta/registro: nunca prerenderizar
// esta página como estática, o quedaría congelada con los datos del build.
export const dynamic = "force-dynamic";

const CANTIDAD_MESES_SELECTOR = 12;

function mesActualValue() {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;
}

/** Últimos N meses (incluido el actual), más reciente primero, como "YYYY-MM". */
function mesesDisponibles(cantidad: number) {
  const ahora = new Date();
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date(Date.UTC(ahora.getFullYear(), ahora.getMonth() - i, 1));
    return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

/** Rango [desde, hasta) en ISO para un mes "YYYY-MM". */
function rangoDeMes(mes: string) {
  const [year, month] = mes.split("-").map(Number);
  const desde = new Date(Date.UTC(year, month - 1, 1));
  const hasta = new Date(Date.UTC(year, month, 1));
  return { desde: desde.toISOString(), hasta: hasta.toISOString() };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes: mesParam } = await searchParams;
  const meses = mesesDisponibles(CANTIDAD_MESES_SELECTOR);
  const mesSeleccionado = mesParam && meses.includes(mesParam) ? mesParam : mesActualValue();

  let members;
  let actionTypes;
  let proveedores;
  let resumenMes;

  try {
    const supabase = createSupabaseServerClient();
    const { desde, hasta } = rangoDeMes(mesSeleccionado);
    const [membersRes, actionTypesRes, proveedoresRes, usosMesRes, boletasMesRes] =
      await Promise.all([
        supabase
          .from("members")
          .select("id, nombre")
          .eq("activo", true)
          .order("nombre"),
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
        supabase
          .from("usage_records")
          .select("action_type_codigo, precio_cobrado")
          .gte("fecha_uso", desde)
          .lt("fecha_uso", hasta),
        supabase
          .from("boletas")
          .select("proveedor_codigo, monto_total")
          .gte("created_at", desde)
          .lt("created_at", hasta),
      ]);

    if (membersRes.error) throw membersRes.error;
    if (actionTypesRes.error) throw actionTypesRes.error;
    if (proveedoresRes.error) throw proveedoresRes.error;
    if (usosMesRes.error) throw usosMesRes.error;
    if (boletasMesRes.error) throw boletasMesRes.error;

    members = membersRes.data;
    actionTypes = actionTypesRes.data;
    proveedores = proveedoresRes.data;

    // Ver vault/03-Historias-de-Usuario/US-07-resumen-del-mes.md: una tarjeta por
    // action_type/proveedor activo (aunque no tenga movimiento este mes → $0).
    const totalPorActionType = new Map<string, number>();
    for (const row of usosMesRes.data) {
      totalPorActionType.set(
        row.action_type_codigo,
        (totalPorActionType.get(row.action_type_codigo) ?? 0) + row.precio_cobrado
      );
    }
    const totalPorProveedor = new Map<string, number>();
    for (const row of boletasMesRes.data) {
      totalPorProveedor.set(
        row.proveedor_codigo,
        (totalPorProveedor.get(row.proveedor_codigo) ?? 0) + row.monto_total
      );
    }
    resumenMes = [
      ...actionTypes.map((actionType) => ({
        nombre: actionType.nombre,
        total: totalPorActionType.get(actionType.codigo) ?? 0,
      })),
      ...proveedores.map((proveedor) => ({
        nombre: proveedor.nombre,
        total: totalPorProveedor.get(proveedor.codigo) ?? 0,
      })),
    ];
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

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold">SmartRomies</h1>
      <ResumenMes items={resumenMes} mesSeleccionado={mesSeleccionado} meses={meses} />
      <Home initialMembers={members} actionTypes={actionTypes} proveedores={proveedores} />
    </main>
  );
}
