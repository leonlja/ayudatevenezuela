"use client";

import { useMemo, useState } from "react";
import ReportCard from "@/components/ReportCard";
import { CATEGORIES, STATUSES, ZONES } from "@/lib/categories";
import type { PublicReport } from "@/lib/supabase";

const urgencyOrder: Record<string, number> = {
  critica: 0,
  alta: 1,
  media: 2,
  baja: 3,
};

type Props = {
  reports: PublicReport[];
  onSetInProgress?: (id: string) => Promise<void>;
};

export default function ReportList({ reports, onSetInProgress }: Props) {
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(
    () =>
      reports
        .filter((item) => !zone || item.zone === zone)
        .filter((item) => !category || item.category === category)
        .filter((item) => !status || item.status === status)
        .sort((a, b) => (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9)),
    [category, reports, status, zone],
  );

  const criticalCount = reports.filter((item) => item.urgency === "critica").length;
  const resolvedCount = reports.filter((item) => item.status === "resolved").length;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-2 rounded border border-slate-700 bg-slate-900 p-3 text-center text-sm">
        <div>Total: {reports.length}</div>
        <div>Criticos: {criticalCount}</div>
        <div>Resueltos: {resolvedCount}</div>
      </div>

      <div className="grid gap-2 rounded border border-slate-700 bg-slate-900 p-3 md:grid-cols-3">
        <select className="min-h-12 rounded bg-slate-800 p-2" value={zone} onChange={(e) => setZone(e.target.value)}>
          <option value="">Todas las zonas</option>
          {ZONES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="min-h-12 rounded bg-slate-800 p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Todas las categorias</option>
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          className="min-h-12 rounded bg-slate-800 p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3">
        {filtered.map((report) => (
          <ReportCard key={report.id} report={report} onSetInProgress={onSetInProgress} />
        ))}
      </div>
    </section>
  );
}

// authored-by: gpt-5.3-codex
