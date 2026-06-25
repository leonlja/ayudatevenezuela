export const ZONES = [
  "Petare",
  "Chacao",
  "La Guaira",
  "Catia",
  "El Valle",
  "Caricuao",
  "Baruta",
  "Libertador",
  "Otro",
] as const;

export const CATEGORIES = [
  { value: "medica", label: "Asistencia Medica", icon: "[M]" },
  { value: "rescate", label: "Rescate", icon: "[R]" },
  { value: "agua_comida", label: "Agua/Comida", icon: "[A]" },
  { value: "refugio", label: "Refugio", icon: "[H]" },
  { value: "insumos", label: "Insumos", icon: "[I]" },
  { value: "otro", label: "Otro", icon: "[O]" },
] as const;

export const URGENCIES = [
  { value: "critica", label: "Critica", className: "bg-red-700 text-white" },
  { value: "alta", label: "Alta", className: "bg-orange-500 text-black" },
  { value: "media", label: "Media", className: "bg-yellow-400 text-black" },
  { value: "baja", label: "Baja", className: "bg-green-600 text-white" },
] as const;

export const STATUSES = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En progreso" },
  { value: "resolved", label: "Resuelto" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type UrgencyValue = (typeof URGENCIES)[number]["value"];
export type StatusValue = (typeof STATUSES)[number]["value"];

// authored-by: gpt-5.3-codex
