"use client";

import { useState, useTransition } from "react";
import { registrarUso, type ActionType, type Member } from "@/lib/actions";

type Step =
  | { name: "perfil" }
  | { name: "accion"; member: Member }
  | { name: "confirmar"; member: Member; actionTypes: ActionType[] }
  | {
      name: "hecho";
      member: Member;
      items: { actionNombre: string; precio: number }[];
      total: number;
    };

function formatPrecio(precio: number) {
  return precio.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default function RegistrarUso({
  members,
  actionTypes,
}: {
  members: Member[];
  actionTypes: ActionType[];
}) {
  const [step, setStep] = useState<Step>({ name: "perfil" });
  const [seleccionadas, setSeleccionadas] = useState<ActionType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleAccion(actionType: ActionType) {
    setSeleccionadas((prev) =>
      prev.some((a) => a.codigo === actionType.codigo)
        ? prev.filter((a) => a.codigo !== actionType.codigo)
        : [...prev, actionType]
    );
  }

  function confirmar(member: Member, actionTypesElegidos: ActionType[]) {
    setError(null);
    startTransition(async () => {
      const result = await registrarUso(
        member.id,
        actionTypesElegidos.map((a) => a.codigo)
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStep({
        name: "hecho",
        member,
        items: result.data.items,
        total: result.data.total,
      });
    });
  }

  const buttonClass =
    "w-full rounded-lg border border-neutral-300 px-4 py-3 text-left text-base font-medium dark:border-neutral-700";
  const buttonSelectedClass =
    "w-full rounded-lg border-2 border-neutral-900 bg-neutral-100 px-4 py-3 text-left text-base font-medium dark:border-neutral-100 dark:bg-neutral-800";

  if (step.name === "perfil") {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">¿Quién sos?</h2>
        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <button
              key={member.id}
              type="button"
              className={buttonClass}
              onClick={() => {
                setSeleccionadas([]);
                setStep({ name: "accion", member });
              }}
            >
              {member.nombre}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step.name === "accion") {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">¿Qué hiciste, {step.member.nombre}?</h2>
        <p className="text-sm text-neutral-500">Podés elegir más de una.</p>
        <div className="flex flex-col gap-2">
          {actionTypes.map((actionType) => {
            const selected = seleccionadas.some((a) => a.codigo === actionType.codigo);
            return (
              <button
                key={actionType.codigo}
                type="button"
                className={selected ? buttonSelectedClass : buttonClass}
                onClick={() => toggleAccion(actionType)}
              >
                {selected ? "✓ " : ""}
                {actionType.nombre} — {formatPrecio(actionType.precio_actual)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={seleccionadas.length === 0}
          className="rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
          onClick={() =>
            setStep({ name: "confirmar", member: step.member, actionTypes: seleccionadas })
          }
        >
          Continuar
        </button>
        <button
          type="button"
          className="text-sm text-neutral-500 underline"
          onClick={() => setStep({ name: "perfil" })}
        >
          Cambiar perfil
        </button>
      </div>
    );
  }

  if (step.name === "confirmar") {
    const total = step.actionTypes.reduce((sum, a) => sum + a.precio_actual, 0);
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Confirmar</h2>
        <p className="text-base font-medium">{step.member.nombre}</p>
        <ul className="flex flex-col gap-1 text-base">
          {step.actionTypes.map((actionType) => (
            <li key={actionType.codigo} className="flex justify-between">
              <span>{actionType.nombre}</span>
              <span>{formatPrecio(actionType.precio_actual)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold dark:border-neutral-800">
          <span>Total</span>
          <span>{formatPrecio(total)}</span>
        </div>
        <button
          type="button"
          disabled={isPending}
          className="rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
          onClick={() => confirmar(step.member, step.actionTypes)}
        >
          {isPending ? "Registrando..." : "Confirmar"}
        </button>
        <button
          type="button"
          disabled={isPending}
          className="text-sm text-neutral-500 underline disabled:opacity-50"
          onClick={() => setStep({ name: "accion", member: step.member })}
        >
          Volver
        </button>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base">
        <strong>{step.member.nombre}</strong> registró{" "}
        {step.items.map((item) => item.actionNombre).join(" + ")} —{" "}
        {formatPrecio(step.total)}
      </p>
      <button
        type="button"
        className="rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        onClick={() => {
          setSeleccionadas([]);
          setStep({ name: "perfil" });
        }}
      >
        Registrar otro uso
      </button>
    </div>
  );
}
