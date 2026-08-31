"use client";

import { useState, useTransition } from "react";
import { cargarBoleta, type Boleta, type Proveedor } from "@/lib/actions";
import { formatPrecio, formatMes } from "@/lib/format";
import { CANTIDAD_MESES_SELECTOR, mesActualValue, mesesDisponibles } from "@/lib/meses";

const MESES_PERIODO = mesesDisponibles(CANTIDAD_MESES_SELECTOR);

export default function CargarBoleta({ proveedores }: { proveedores: Proveedor[] }) {
  const [proveedorCodigo, setProveedorCodigo] = useState("");
  const [periodo, setPeriodo] = useState(mesActualValue());
  const [monto, setMonto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Boleta | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await cargarBoleta(proveedorCodigo, formatMes(periodo), Number(monto));
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setResultado(result.data);
    });
  }

  function cargarOtra() {
    setResultado(null);
    setProveedorCodigo("");
    setPeriodo(mesActualValue());
    setMonto("");
  }

  if (resultado) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Boleta cargada</h2>
        <p className="text-base">
          <strong>
            {resultado.proveedorNombre} ({resultado.periodo})
          </strong>
          : {formatPrecio(resultado.montoTotal)} → {formatPrecio(resultado.montoPorPersona)}{" "}
          por persona × {resultado.cantidadIntegrantes} integrantes
        </p>
        <button
          type="button"
          className="rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          onClick={cargarOtra}
        >
          Cargar otra boleta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Cargar boleta</h2>
      <div className="flex flex-col gap-2">
        <select
          value={proveedorCodigo}
          onChange={(e) => setProveedorCodigo(e.target.value)}
          disabled={isPending}
          className="rounded-lg border border-neutral-300 px-3 py-3 text-base disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="" disabled>
            Proveedor
          </option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.codigo} value={proveedor.codigo}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          disabled={isPending}
          className="rounded-lg border border-neutral-300 px-3 py-3 text-base disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
        >
          {MESES_PERIODO.map((mes) => (
            <option key={mes} value={mes}>
              {formatMes(mes)}
            </option>
          ))}
        </select>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto total"
          disabled={isPending}
          className="rounded-lg border border-neutral-300 px-3 py-3 text-base disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !proveedorCodigo || !periodo.trim() || !monto}
        className="rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {isPending ? "Cargando..." : "Cargar boleta"}
      </button>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </form>
  );
}
