"use client";

import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CATEGORIES, URGENCIES, ZONES } from "@/lib/categories";
import { flushQueue, queueReport } from "@/lib/offline-queue";

type FormData = {
  zone: string;
  category: string;
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
  zone: ZONES[0],
  category: CATEGORIES[0].value,
  urgency: URGENCIES[0].value,
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

export default function ReportForm() {
  const [form, setForm] = useState<FormData>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "queued" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const summary = useMemo(
    () => ({
      zone: form.zone,
      category: CATEGORIES.find((item) => item.value === form.category)?.label ?? form.category,
      urgency: URGENCIES.find((item) => item.value === form.urgency)?.label ?? form.urgency,
      people_count: form.people_count,
    }),
    [form],
  );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const deviceId = getDeviceId();
      const payload = {
        ...form,
        device_id: deviceId,
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

      await flushQueue(deviceId);
      setStatus("done");
      setForm(initialState);
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Error inesperado");
    }
  };

  const fillGps = () => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setForm((current) => ({
          ...current,
          lat_exact: String(position.coords.latitude),
          lng_exact: String(position.coords.longitude),
        })),
      () => setError("No se pudo leer GPS."),
    );
  };

  return (
    <form className="space-y-4" onSubmit={submit} method="POST" action="/api/reports">
      <label className="block">
        <span className="mb-1 block font-semibold">Zona</span>
        <select
          required
          value={form.zone}
          onChange={(event) => setForm({ ...form, zone: event.target.value })}
          className="min-h-12 w-full rounded bg-slate-800 p-3"
          name="zone"
        >
          {ZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </label>

      <div>
        <p className="mb-2 font-semibold">Categoria</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              className={`min-h-12 rounded border p-3 text-left ${
                form.category === category.value ? "border-[#FFD100]" : "border-slate-700"
              }`}
              onClick={() => setForm({ ...form, category: category.value })}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-semibold">Urgencia</p>
        <div className="grid grid-cols-2 gap-2">
          {URGENCIES.map((urgency) => (
            <button
              key={urgency.value}
              type="button"
              className={`min-h-12 rounded p-3 font-semibold ${urgency.className}`}
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

      <input type="hidden" name="category" value={form.category} />
      <input type="hidden" name="urgency" value={form.urgency} />
      <input type="hidden" name="lat_exact" value={form.lat_exact} />
      <input type="hidden" name="lng_exact" value={form.lng_exact} />

      <button type="button" onClick={fillGps} className="min-h-12 w-full rounded border border-slate-500 p-3">
        Usar ubicacion GPS
      </button>

      <button type="submit" className="min-h-12 w-full rounded bg-[#CF142B] p-3 text-lg font-bold text-white">
        Enviar reporte
      </button>

      <div className="rounded border border-slate-700 bg-slate-900 p-3 text-sm">
        Resumen: {summary.zone} | {summary.category} | {summary.urgency} | {summary.people_count} persona(s)
      </div>

      {status === "queued" ? (
        <p className="rounded bg-yellow-300 p-3 text-sm font-semibold text-black">Sin conexion: reporte guardado en cola.</p>
      ) : null}
      {status === "done" ? (
        <p className="rounded bg-green-700 p-3 text-sm font-semibold text-white">Reporte enviado correctamente.</p>
      ) : null}
      {status === "error" ? (
        <p className="rounded bg-red-700 p-3 text-sm font-semibold text-white">{error}</p>
      ) : null}
    </form>
  );
}

// authored-by: gpt-5.3-codex
