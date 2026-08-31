"use client";

import { useRouter, usePathname } from "next/navigation";
import { formatMes } from "@/lib/format";

export default function SelectorMes({
  mesSeleccionado,
  meses,
}: {
  mesSeleccionado: string;
  meses: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={mesSeleccionado}
      onChange={(e) => router.push(`${pathname}?mes=${e.target.value}`)}
      className="rounded-lg border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
    >
      {meses.map((mes) => (
        <option key={mes} value={mes}>
          {formatMes(mes)}
        </option>
      ))}
    </select>
  );
}
