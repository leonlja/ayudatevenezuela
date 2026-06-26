"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CATEGORIES, URGENCIES, ZONE_GROUPS } from "@/lib/categories";
import { flushQueue, queueReport } from "@/lib/offline-queue";
import ReferenceSearch from "./ReferenceSearch";
import type { SelectedReference } from "./ReferenceSearch";

const MAX_CATEGORIES = 3;

type FormData = {
  municipality: string;
  sector: string;
  zone: string;
  categories: string[];
  urgency: string;
  people_count: number;
  description: string;
  address: string;
  contact_name: string;
  contact_phone: string;
  lat_exact: string;
  lng_exact: string;
  hp_website: string;
};

const initialState: FormData = {
  municipality: "",
  sector: "",
  zone: "",
  categories: [],
  urgency: "",
  people_count: 1,
  description: "",
  address: "",
  contact_name: "",
  contact_phone: "",
  lat_exact: "",
  lng_exact: "",
  hp_website: "",
};

function getDeviceId() {
  const key = "ayuda-device-id";
  const current = localStorage.getItem(key);
  if (current) return current;
  const next = uuidv4();
  localStorage.setItem(key, next);
  return next;
}

type LocationMode = "none" | "gps" | "reference";
type SubmissionResult = { id: string; time: string } | null;

export default function ReportForm() {
  const [form, setForm] = useState<FormData>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "queued" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult>(null);
  const [locationMode, setLocationMode] = useState<LocationMode>("none");
  const [selectedReference, setSelectedReference] = useState<SelectedReference | null>(null);

  const toggleCategory = (value: string) => {
    setForm((prev) => {
      const selected = prev.categories.includes(value);
      if (selected) {
        return { ...prev, categories: prev.categories.filter((c) => c !== value) };
      }
      if (prev.categories.length >= MAX_CATEGORIES) return prev;
      return { ...prev, categories: [...prev.categories, value] };
    });
  };

  const summary = useMemo(() => {
    const catLabels = form.categories
      .map((c) => CATEGORIES.find((item) => item.value === c)?.label ?? c)
      .join(", ");
    const zoneSummary = form.municipality
      ? form.municipality === "Otro"
        ? "Otro"
        : form.sector
          ? `${form.municipality} - ${form.sector}`
          : form.municipality
      : "Sin seleccionar";
    return {
      zone: zoneSummary,
      category: catLabels || "Sin seleccionar",
      urgency: URGENCIES.find((item) => item.value === form.urgency)?.label ?? "Sin seleccionar",
      people_count: form.people_count,
    };
  }, [form]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    if (!form.municipality || (form.municipality !== "Otro" && !form.sector)) {
      setStatus("error");
      setError("Selecciona municipio y sector.");
      return;
    }
    if (form.categories.length === 0) {
      setStatus("error");
      setError("Selecciona al menos una categoria.");
      return;
    }
    if (!form.urgency) {
      setStatus("error");
      setError("Selecciona una urgencia.");
      return;
    }

    try {
      const deviceId = getDeviceId();
      const payload = {
        ...form,
        category: form.categories.join(","),
        device_id: deviceId,
        location_source: locationMode,
      };
      if (!navigator.onLine) {
        await queueReport(payload);
        setStatus("queued");
        return;
      }

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": deviceId,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar el reporte");
      }

      const data = (await response.json()) as { id: string };
      await flushQueue(deviceId);
      setSubmissionResult({ id: data.id, time: new Date().toLocaleTimeString("es-VE") });
      setStatus("done");
      setForm(initialState);
      setLocationMode("none");
      setSelectedReference(null);
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Error inesperado");
    }
  };

  const fillGps = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          lat_exact: String(position.coords.latitude),
          lng_exact: String(position.coords.longitude),
        }));
        setLocationMode("gps");
        setSelectedReference(null);
      },
      () => setError("No se pudo leer GPS."),
    );
  };

  const handleReferenceSelect = (ref: SelectedReference) => {
    setSelectedReference(ref);
    setForm((current) => ({
      ...current,
      lat_exact: String(ref.lat),
      lng_exact: String(ref.lng),
    }));
    setLocationMode("reference");
  };

  const handleReferenceClear = () => {
    setSelectedReference(null);
    setForm((current) => ({
      ...current,
      lat_exact: "",
      lng_exact: "",
    }));
    setLocationMode("none");
  };

  const closeModal = () => {
    setSubmissionResult(null);
    setStatus("idle");
  };

  return (
    <>
      {/* Sticky summary bar */}
      <div className="sticky top-[57px] z-10 -mx-4 border-b border-slate-700 bg-slate-900/95 px-4 py-3 backdrop-blur">
        <p className="text-center text-base font-semibold">
          {summary.zone} | {summary.category} | {summary.urgency} | {summary.people_count} persona(s)
        </p>
      </div>

      <form className="space-y-4" onSubmit={submit} method="POST" action="/api/reports">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-semibold">Municipio</span>
            <select
              required
              value={form.municipality}
              onChange={(event) => {
                const mun = event.target.value;
                const isOtro = mun === "Otro";
                setForm({
                  ...form,
                  municipality: mun,
                  sector: isOtro ? "" : "",
                  zone: isOtro ? "Otro" : "",
                });
              }}
              className="min-h-12 w-full rounded bg-slate-800 p-3"
            >
              <option value="" disabled>Municipio...</option>
              {ZONE_GROUPS.map((group) => (
                <option key={group.municipality} value={group.municipality}>
                  {group.municipality}
                </option>
              ))}
              <option value="Otro">Otro</option>
            </select>
          </label>

          {form.municipality && form.municipality !== "Otro" && (
            <label className="block">
              <span className="mb-1 block font-semibold">Sector</span>
              <select
                required
                value={form.sector}
                onChange={(event) => {
                  const sec = event.target.value;
                  setForm({
                    ...form,
                    sector: sec,
                    zone: `${form.municipality} - ${sec}`,
                  });
                }}
                className="min-h-12 w-full rounded bg-slate-800 p-3"
              >
                <option value="" disabled>Sector...</option>
                {ZONE_GROUPS.find((g) => g.municipality === form.municipality)?.sectors.map(
                  (sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ),
                )}
              </select>
            </label>
          )}
        </div>

        <input type="hidden" name="zone" value={form.zone} />

        <div>
          <p className="mb-2 font-semibold">
            Categoria{" "}
            <span className="font-normal text-slate-400">
              ({form.categories.length}/{MAX_CATEGORIES})
            </span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => {
              const selected = form.categories.includes(category.value);
              const atLimit = form.categories.length >= MAX_CATEGORIES && !selected;
              return (
                <button
                  key={category.value}
                  type="button"
                  className={`min-h-12 rounded border p-3 text-left transition-colors ${
                    selected
                      ? "border-ve-yellow bg-ve-yellow/10 text-white"
                      : atLimit
                        ? "cursor-not-allowed border-slate-800 text-slate-600"
                        : "border-slate-700 text-slate-300"
                  }`}
                  onClick={() => toggleCategory(category.value)}
                  disabled={atLimit}
                >
                  {category.icon} {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold">Urgencia</p>
          <div className="grid grid-cols-2 gap-2">
            {URGENCIES.map((urgency) => (
              <button
                key={urgency.value}
                type="button"
                className={`min-h-12 rounded p-3 font-semibold transition-colors ${
                  form.urgency === urgency.value ? urgency.className : urgency.classNameInactive
                }`}
                onClick={() => setForm({ ...form, urgency: urgency.value })}
              >
                {urgency.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block font-semibold">Personas afectadas</span>
          <input
            className="min-h-12 w-full rounded bg-slate-800 p-3"
            type="number"
            min={1}
            name="people_count"
            value={form.people_count}
            onChange={(event) => setForm({ ...form, people_count: Number(event.target.value) })}
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-semibold">Descripcion</span>
          <textarea
            required
            className="min-h-24 w-full rounded bg-slate-800 p-3"
            placeholder="Ej: edificio colapsado, hay heridos y necesitamos rescate."
            name="description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-semibold">Direccion / referencia (opcional)</span>
          <span className="mb-1 block text-sm text-slate-400">Indica el punto publico para recibir la ayuda</span>
          <input
            className="min-h-12 w-full rounded bg-slate-800 p-3"
            name="address"
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-semibold">Nombre (opcional)</span>
            <input
              className="min-h-12 w-full rounded bg-slate-800 p-3"
              name="contact_name"
              value={form.contact_name}
              onChange={(event) => setForm({ ...form, contact_name: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-semibold">Telefono (opcional)</span>
            <input
              className="min-h-12 w-full rounded bg-slate-800 p-3"
              name="contact_phone"
              value={form.contact_phone}
              onChange={(event) => setForm({ ...form, contact_phone: event.target.value })}
            />
          </label>
        </div>

        <label className="hidden" aria-hidden>
          Sitio web
          <input
            tabIndex={-1}
            autoComplete="off"
            name="hp_website"
            value={form.hp_website}
            onChange={(event) => setForm({ ...form, hp_website: event.target.value })}
          />
        </label>

        <input type="hidden" name="category" value={form.categories.join(",")} />
        <input type="hidden" name="urgency" value={form.urgency} />
        <input type="hidden" name="lat_exact" value={form.lat_exact} />
        <input type="hidden" name="lng_exact" value={form.lng_exact} />

        <div className="space-y-2">
          <p className="font-semibold">Ubicacion (opcional)</p>
          <button
            type="button"
            onClick={fillGps}
            className={`min-h-12 w-full rounded border p-3 transition-colors ${
              locationMode === "gps"
                ? "border-green-500 bg-green-500/10 text-green-400"
                : "border-slate-500"
            }`}
          >
            {locationMode === "gps" ? "GPS capturado" : "Usar ubicacion GPS"}
          </button>
          <div className="relative">
            <div className="absolute inset-x-0 top-0 flex items-center justify-center">
              <span className="bg-slate-900 px-2 text-xs text-slate-500">o</span>
            </div>
            <hr className="border-slate-700" />
          </div>
          <ReferenceSearch
            selected={selectedReference}
            onSelect={handleReferenceSelect}
            onClear={handleReferenceClear}
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="h-24 w-full rounded bg-green-600 text-xl font-bold text-white transition-colors hover:bg-green-500 disabled:opacity-50"
        >
          {status === "sending" ? "Enviando..." : "Enviar reporte"}
        </button>

        {status === "queued" ? (
          <p className="rounded bg-yellow-300 p-3 text-sm font-semibold text-black">Sin conexion: reporte guardado en cola.</p>
        ) : null}
        {status === "error" ? (
          <p className="rounded bg-red-700 p-3 text-sm font-semibold text-white">{error}</p>
        ) : null}
      </form>

      {/* Success modal */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={closeModal}>
          <div
            className="w-full max-w-md space-y-4 rounded-lg border border-slate-700 bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <p className="text-3xl">&#10003;</p>
              <h2 className="text-xl font-bold text-green-400">Reporte enviado</h2>
            </div>
            <div className="space-y-1 rounded bg-slate-800 p-4 text-sm">
              <p><span className="text-slate-400">Hora:</span> {submissionResult.time}</p>
              <p><span className="text-slate-400">ID:</span> <span className="font-mono text-xs">{submissionResult.id}</span></p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="min-h-12 rounded bg-slate-700 p-3 font-semibold text-white transition-colors hover:bg-slate-600"
              >
                Nuevo reporte
              </button>
              <Link
                href="/mapa"
                className="flex min-h-12 items-center justify-center rounded bg-ve-blue p-3 font-semibold text-white no-underline transition-colors hover:bg-ve-blue/80"
              >
                Ver en mapa
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// authored-by: claude-opus-4-6
