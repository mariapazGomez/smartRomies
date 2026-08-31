import Home from "@/components/Home";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Los datos vienen de Supabase y cambian con cada alta/registro: nunca prerenderizar
// esta página como estática, o quedaría congelada con los datos del build.
export const dynamic = "force-dynamic";

export default async function Page() {
  let members;
  let actionTypes;

  try {
    const supabase = createSupabaseServerClient();
    const [membersRes, actionTypesRes] = await Promise.all([
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
    ]);

    if (membersRes.error) throw membersRes.error;
    if (actionTypesRes.error) throw actionTypesRes.error;

    members = membersRes.data;
    actionTypes = actionTypesRes.data;
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
      <Home initialMembers={members} actionTypes={actionTypes} />
    </main>
  );
}
