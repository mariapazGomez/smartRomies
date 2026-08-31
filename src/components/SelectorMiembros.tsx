import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { Member } from "@/lib/actions";

export default function SelectorMiembros({ members }: { members: Member[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">¿Quién sos?</h2>
      <div className="grid grid-cols-3 gap-4">
        {members.map((member) => (
          <Link
            key={member.id}
            href={`/miembro/${member.id}`}
            className="flex flex-col items-center gap-2"
          >
            <Avatar nombre={member.nombre} />
            <span className="text-sm">{member.nombre}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
