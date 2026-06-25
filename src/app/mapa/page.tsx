"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ReportList from "@/components/ReportList";
import type { PublicReport } from "@/lib/supabase";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

function getDeviceId(): string {
  const key = "ayuda-device-id";
  return localStorage.getItem(key) || "unknown-device";
}

export default function MapaPage() {
  const [reports, setReports] = useState<PublicReport[]>([]);
  const [view, setView] = useState<"list" | "map">("map");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [claiming, setClaiming] = useState<string | null>(null);
  const [volunteerNote, setVolunteerNote] = useState("");

  const loadReports = async () => {
    try {
      setFetchError("");
      const response = await fetch("/api/reports");
      if (!response.ok) throw new Error("Error al cargar reportes");
      const body = (await response.json()) as { data: PublicReport[] };
      setReports(body.data);
    } catch {
      setFetchError("No se pudieron cargar los reportes. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports().catch(() => undefined);
  }, []);

  const onSetInProgress = async (id: string) => {
    setClaiming(id);
    setVolunteerNote("");
  };

  const confirmClaim = async () => {
    if (!claiming || !volunteerNote.trim()) return;

    const res = await fetch("/api/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: claiming,
        status: "in_progress",
        volunteer_note: volunteerNote,
        device_id: getDeviceId(),
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      alert(data.error || "Error al actualizar el reporte.");
      return;
    }

    setClaiming(null);
    setVolunteerNote("");
    await loadReports();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Panel de voluntarios</h1>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`min-h-12 rounded p-3 font-semibold ${view === "list" ? "bg-ve-blue text-white" : "bg-slate-800"}`}
          onClick={() => setView("list")}
        >
          Vista lista
        </button>
        <button
          type="button"
          className={`min-h-12 rounded p-3 font-semibold ${view === "map" ? "bg-ve-blue text-white" : "bg-slate-800"}`}
          onClick={() => setView("map")}
        >
          Vista mapa
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-ve-yellow" />
          <span className="ml-3 text-slate-400">Cargando reportes...</span>
        </div>
      )}

      {fetchError && (
        <div className="space-y-3 rounded border border-red-700 bg-red-900/30 p-4 text-center">
          <p className="font-semibold text-red-300">{fetchError}</p>
          <button
            type="button"
            onClick={() => { setLoading(true); loadReports(); }}
            className="min-h-10 rounded bg-slate-700 px-4 py-2 font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !fetchError && (
        view === "list"
          ? <ReportList reports={reports} onSetInProgress={onSetInProgress} />
          : <MapView reports={reports} />
      )}

      {claiming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setClaiming(null)}>
          <div
            className="w-full max-w-md space-y-4 rounded-lg border border-slate-700 bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Quiero ayudar</h2>
            <p className="text-sm text-slate-400">Describe brevemente la ayuda que vas a prestar:</p>
            <textarea
              autoFocus
              className="min-h-20 w-full rounded bg-slate-800 p-3"
              placeholder="Ej: Llevo agua y comida enlatada, llego en 30 min"
              value={volunteerNote}
              onChange={(e) => setVolunteerNote(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setClaiming(null)}
                className="min-h-12 rounded bg-slate-700 p-3 font-semibold text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmClaim}
                disabled={!volunteerNote.trim()}
                className="min-h-12 rounded bg-ve-blue p-3 font-semibold text-white disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// authored-by: claude-opus-4-6
