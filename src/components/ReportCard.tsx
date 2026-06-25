import CategoryIcon from "@/components/CategoryIcon";
import UrgencyBadge from "@/components/UrgencyBadge";
import type { PublicReport } from "@/lib/supabase";

type Props = {
  report: PublicReport;
  onSetInProgress?: (id: string) => Promise<void>;
};

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "hace un momento";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function ReportCard({ report, onSetInProgress }: Props) {
  return (
    <article className="space-y-2 rounded border border-slate-700 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-semibold">
          <CategoryIcon category={report.category} />
          <span className="truncate">{report.zone}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500" title={new Date(report.created_at).toLocaleString("es-VE")}>
            {timeAgo(report.created_at)}
          </span>
          <UrgencyBadge urgency={report.urgency} />
        </div>
      </div>
      <p>{report.description}</p>
      <p className="text-sm text-slate-300">
        Personas: {report.people_count}
        {report.location_source === "gps" && " · GPS"}
        {report.location_source === "ip" && " · Ubicacion aprox."}
      </p>
      {report.contact_name ? <p className="text-sm text-slate-300">Contacto: {report.contact_name}</p> : null}
      {report.status === "in_progress" ? (
        <p className="rounded bg-blue-900/50 p-2 text-center text-sm font-semibold text-blue-300">
          ⏳ Ayuda en camino
        </p>
      ) : null}
      {report.status === "resolved" ? (
        <p className="rounded bg-green-900/50 p-2 text-center text-sm font-semibold text-green-300">
          ✓ Resuelto
        </p>
      ) : null}
      {onSetInProgress && report.status === "pending" ? (
        <button
          type="button"
          onClick={() => onSetInProgress(report.id)}
          className="min-h-12 w-full rounded bg-ve-blue px-4 py-3 font-semibold text-white transition-colors hover:bg-ve-blue/80"
        >
          Quiero ayudar
        </button>
      ) : null}
    </article>
  );
}

// authored-by: claude-opus-4-6
