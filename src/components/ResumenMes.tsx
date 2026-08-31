import { formatPrecio } from "@/lib/format";
import SelectorMes from "@/components/SelectorMes";

export default function ResumenMes({
  items,
  mesSeleccionado,
  meses,
}: {
  items: { nombre: string; total: number; detalle?: string }[];
  mesSeleccionado: string;
  meses: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-500">Tu resumen del mes</h2>
        <SelectorMes mesSeleccionado={mesSeleccionado} meses={meses} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.nombre}
            className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <p className="text-sm text-neutral-500">{item.nombre}</p>
            <p className="text-lg font-semibold">{formatPrecio(item.total)}</p>
            {item.detalle && (
              <p className="text-xs text-neutral-400 dark:text-neutral-500">{item.detalle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
