"use client";

import { useState, useTransition } from "react";
import { registrarUso, type ActionType, type Member } from "@/lib/actions";

type Step =
  | { name: "perfil" }
  | { name: "accion"; member: Member }
  | { name: "confirmar"; member: Member; actionType: ActionType }
  | { name: "hecho"; member: Member; actionNombre: string; precio: number };

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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirmar(member: Member, actionType: ActionType) {
    setError(null);
    startTransition(async () => {
      const result = await registrarUso(member.id, actionType.codigo);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStep({
        name: "hecho",
        member,
        actionNombre: result.data.actionNombre,
        precio: result.data.precio,
      });
    });
  }

  const buttonClass =
    "w-full rounded-lg border border-neutral-300 px-4 py-3 text-left text-base font-medium dark:border-neutral-700";

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
              onClick={() => setStep({ name: "accion", member })}
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
        <div className="flex flex-col gap-2">
          {actionTypes.map((actionType) => (
            <button
              key={actionType.codigo}
              type="button"
              className={buttonClass}
              onClick={() =>
                setStep({ name: "confirmar", member: step.member, actionType })
              }
            >
              {actionType.nombre} — {formatPrecio(actionType.precio_actual)}
            </button>
          ))}
        </div>
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
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Confirmar</h2>
        <p className="text-base">
          <strong>{step.member.nombre}</strong> — {step.actionType.nombre} —{" "}
          {formatPrecio(step.actionType.precio_actual)}
        </p>
        <button
          type="button"
          disabled={isPending}
          className="rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
          onClick={() => confirmar(step.member, step.actionType)}
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
        <strong>{step.member.nombre}</strong> registró un {step.actionNombre} —{" "}
        {formatPrecio(step.precio)}
      </p>
      <button
        type="button"
        className="rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        onClick={() => setStep({ name: "perfil" })}
      >
        Registrar otro uso
      </button>
    </div>
  );
}
