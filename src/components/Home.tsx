"use client";

import { useState } from "react";
import AddMemberForm from "@/components/AddMemberForm";
import RegistrarUso from "@/components/RegistrarUso";
import CargarBoleta from "@/components/CargarBoleta";
import type { ActionType, Member } from "@/lib/actions";

type Modo = "uso" | "boleta";

export default function Home({
  initialMembers,
  actionTypes,
}: {
  initialMembers: Member[];
  actionTypes: ActionType[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [modo, setModo] = useState<Modo>("uso");

  if (members.length === 0) {
    return (
      <AddMemberForm
        title="Antes de empezar"
        description="Agreguen a los integrantes del hogar para poder registrar usos."
        onAdded={(member) => setMembers((prev) => [...prev, member])}
      />
    );
  }

  const tabClass = (activo: boolean) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
      activo
        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
        : "border border-neutral-300 dark:border-neutral-700"
    }`;

  return (
    <div className="flex flex-col gap-6">
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
        <RegistrarUso members={members} actionTypes={actionTypes} />
      ) : (
        <CargarBoleta />
      )}
      <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
        {showAddMember ? (
          <AddMemberForm
            title="Agregar integrante"
            onAdded={(member) => {
              setMembers((prev) => [...prev, member]);
              setShowAddMember(false);
            }}
          />
        ) : (
          <button
            type="button"
            className="text-sm text-neutral-500 underline"
            onClick={() => setShowAddMember(true)}
          >
            + agregar integrante
          </button>
        )}
      </div>
    </div>
  );
}
