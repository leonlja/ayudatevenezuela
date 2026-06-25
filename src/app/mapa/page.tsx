"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ReportList from "@/components/ReportList";
import type { PublicReport } from "@/lib/supabase";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapaPage() {
  const [reports, setReports] = useState<PublicReport[]>([]);
  const [view, setView] = useState<"list" | "map">("list");

  const loadReports = async () => {
    const response = await fetch("/api/reports");
    if (response.ok) {
      const body = (await response.json()) as { data: PublicReport[] };
      setReports(body.data);
    }
  };

  useEffect(() => {
    loadReports().catch(() => undefined);
  }, []);

  const onSetInProgress = async (id: string) => {
    let token = sessionStorage.getItem("admin-token");
    if (!token) {
      const input = prompt("Ingresa el codigo de voluntario:");
      if (!input) return;
      token = input;
      sessionStorage.setItem("admin-token", token);
    }

    const res = await fetch("/api/reports", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ id, status: "in_progress" }),
    });

    if (res.status === 401) {
      sessionStorage.removeItem("admin-token");
      alert("Codigo incorrecto. Intenta de nuevo.");
      return;
    }

    await loadReports();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Panel de voluntarios</h1>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`min-h-12 rounded p-3 font-semibold ${view === "list" ? "bg-[#0033A0] text-white" : "bg-slate-800"}`}
          onClick={() => setView("list")}
        >
          Vista lista
        </button>
        <button
          type="button"
          className={`min-h-12 rounded p-3 font-semibold ${view === "map" ? "bg-[#0033A0] text-white" : "bg-slate-800"}`}
          onClick={() => setView("map")}
        >
          Vista mapa
        </button>
      </div>

      {view === "list" ? <ReportList reports={reports} onSetInProgress={onSetInProgress} /> : <MapView reports={reports} />}
    </section>
  );
}

// authored-by: gpt-5.3-codex
