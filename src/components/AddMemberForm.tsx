"use client";

import { useState, useTransition } from "react";
import { addMember, type Member } from "@/lib/actions";

export default function AddMemberForm({
  onAdded,
  title,
  description,
}: {
  onAdded: (member: Member) => void;
  title: string;
  description?: string;
}) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addMember(nombre);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setNombre("");
      onAdded(result.data);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          disabled={isPending}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-3 text-base disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          disabled={isPending || !nombre.trim()}
          className="rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Agregar
        </button>
      </form>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
