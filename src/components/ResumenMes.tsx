import { formatPrecio } from "@/lib/format";

export default function ResumenMes({
  items,
}: {
  items: { nombre: string; total: number }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-neutral-500">Este mes</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.nombre}
            className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <p className="text-sm text-neutral-500">{item.nombre}</p>
            <p className="text-lg font-semibold">{formatPrecio(item.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
