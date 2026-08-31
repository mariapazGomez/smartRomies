"use client";

import { useState } from "react";
import AddMemberForm from "@/components/AddMemberForm";
import SelectorMiembros from "@/components/SelectorMiembros";
import type { Member } from "@/lib/actions";

export default function Home({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [showAddMember, setShowAddMember] = useState(false);

  if (members.length === 0) {
    return (
      <AddMemberForm
        title="Antes de empezar"
        description="Agreguen a los integrantes del hogar para poder registrar usos."
        onAdded={(member) => setMembers((prev) => [...prev, member])}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SelectorMiembros members={members} />
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
