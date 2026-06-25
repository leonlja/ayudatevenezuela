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
  { value: "critica", label: "Critica", className: "bg-red-700 text-white", classNameInactive: "bg-red-700/30 text-red-300 border border-red-700/50" },
  { value: "alta", label: "Alta", className: "bg-orange-500 text-black", classNameInactive: "bg-orange-500/30 text-orange-300 border border-orange-500/50" },
  { value: "media", label: "Media", className: "bg-yellow-400 text-black", classNameInactive: "bg-yellow-400/30 text-yellow-300 border border-yellow-400/50" },
  { value: "baja", label: "Baja", className: "bg-green-600 text-white", classNameInactive: "bg-green-600/30 text-green-300 border border-green-600/50" },
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
