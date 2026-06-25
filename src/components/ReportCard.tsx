import CategoryIcon from "@/components/CategoryIcon";
import UrgencyBadge from "@/components/UrgencyBadge";
import type { PublicReport } from "@/lib/supabase";

type Props = {
  report: PublicReport;
  onSetInProgress?: (id: string) => Promise<void>;
};

export default function ReportCard({ report, onSetInProgress }: Props) {
  return (
    <article className="space-y-2 rounded border border-slate-700 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-semibold">
          <CategoryIcon category={report.category} />
          <span className="truncate">{report.zone}</span>
        </p>
        <UrgencyBadge urgency={report.urgency} />
      </div>
      <p>{report.description}</p>
      <p className="text-sm text-slate-300">
        Personas: {report.people_count}
      </p>
      {report.contact_name ? <p className="text-sm text-slate-300">Contacto: {report.contact_name}</p> : null}
      {report.status !== "pending" ? (
        <p className="rounded bg-blue-900/50 p-2 text-center text-sm font-semibold text-blue-300">
          Ayuda en camino
        </p>
      ) : null}
      {onSetInProgress && report.status === "pending" ? (
        <button
          type="button"
          onClick={() => onSetInProgress(report.id)}
          className="min-h-12 w-full rounded bg-[#0033A0] px-4 py-3 font-semibold text-white"
        >
          Quiero ayudar
        </button>
      ) : null}
    </article>
  );
}

// authored-by: gpt-5.3-codex
