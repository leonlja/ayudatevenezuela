import { URGENCIES } from "@/lib/categories";

export default function UrgencyBadge({ urgency }: { urgency: string }) {
  const match = URGENCIES.find((item) => item.value === urgency);
  return (
    <span className={`rounded px-2 py-1 text-xs font-bold ${match?.className ?? "bg-slate-700 text-white"}`}>
      {match?.label ?? urgency}
    </span>
  );
}

// authored-by: gpt-5.3-codex
