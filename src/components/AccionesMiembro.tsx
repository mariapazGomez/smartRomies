"use client";

import { useState } from "react";
import RegistrarUso from "@/components/RegistrarUso";
import CargarBoleta from "@/components/CargarBoleta";
import type { ActionType, Member, Proveedor } from "@/lib/actions";

type Modo = "uso" | "boleta";

export default function AccionesMiembro({
  member,
  actionTypes,
  proveedores,
}: {
  member: Member;
  actionTypes: ActionType[];
  proveedores: Proveedor[];
}) {
  const [modo, setModo] = useState<Modo>("uso");

  const tabClass = (activo: boolean) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
      activo
        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
        : "border border-neutral-300 dark:border-neutral-700"
    }`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button type="button" className={tabClass(modo === "uso")} onClick={() => setModo("uso")}>
          Registrar uso
        </button>
        <button
          type="button"
          className={tabClass(modo === "boleta")}
          onClick={() => setModo("boleta")}
        >
          Cargar boleta
        </button>
      </div>
      {modo === "uso" ? (
        <RegistrarUso member={member} actionTypes={actionTypes} />
      ) : (
        <CargarBoleta proveedores={proveedores} />
      )}
    </div>
  );
}
