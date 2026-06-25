export type ZoneGroup = {
  municipality: string;
  sectors: string[];
};

export const ZONE_GROUPS: ZoneGroup[] = [
  {
    municipality: "Libertador",
    sectors: [
      "23 de Enero",
      "Altagracia",
      "Antimano",
      "Candelaria",
      "Catia",
      "Coche",
      "El Junquito",
      "El Paraiso",
      "El Recreo",
      "La Pastora",
      "La Vega",
      "Macarao",
      "San Agustin",
      "San Jose",
      "San Juan",
      "San Martin",
      "San Pedro",
      "Santa Rosalia",
      "Santa Teresa",
      "Sucre (Catia)",
    ],
  },
  {
    municipality: "Sucre",
    sectors: [
      "Caucaguita",
      "Filas de Mariche",
      "La Urbina",
      "Leoncio Martinez",
      "Palo Verde",
      "Petare",
    ],
  },
  {
    municipality: "Chacao",
    sectors: [
      "Altamira",
      "Campo Alegre",
      "Chacao Centro",
      "El Rosal",
      "La Castellana",
    ],
  },
  {
    municipality: "Baruta",
    sectors: [
      "Chuao",
      "Colinas de Bello Monte",
      "El Cafetal",
      "Las Mercedes",
      "Prados del Este",
      "Santa Fe",
    ],
  },
  {
    municipality: "El Hatillo",
    sectors: [
      "El Hatillo Centro",
      "La Lagunita",
      "Los Naranjos",
    ],
  },
  {
    municipality: "La Guaira (Vargas)",
    sectors: [
      "Caraballeda",
      "Catia La Mar",
      "Macuto",
      "Maiquetia",
      "Naiguata",
    ],
  },
  {
    municipality: "El Valle",
    sectors: [
      "Coche",
      "El Valle Centro",
      "Los Jardines",
      "Vista Hermosa",
    ],
  },
  {
    municipality: "Caricuao",
    sectors: [
      "UD1",
      "UD2",
      "UD3",
      "UD4",
      "UD5",
      "UD7",
      "Ruiz Pineda",
    ],
  },
];

export const ZONES: string[] = ZONE_GROUPS.flatMap((g) =>
  g.sectors.map((s) => `${g.municipality} - ${s}`),
).concat(["Otro"]);

export const ZONE_COORDS: Record<string, { lat: number; lng: number }> = {
  "Libertador - 23 de Enero": { lat: 10.5100, lng: -66.9350 },
  "Libertador - Altagracia": { lat: 10.5070, lng: -66.9130 },
  "Libertador - Antimano": { lat: 10.4750, lng: -66.9650 },
  "Libertador - Candelaria": { lat: 10.5050, lng: -66.9070 },
  "Libertador - Catia": { lat: 10.5112, lng: -66.9467 },
  "Libertador - Coche": { lat: 10.4550, lng: -66.9300 },
  "Libertador - El Junquito": { lat: 10.4750, lng: -67.0100 },
  "Libertador - El Paraiso": { lat: 10.4900, lng: -66.9350 },
  "Libertador - El Recreo": { lat: 10.4950, lng: -66.8900 },
  "Libertador - La Pastora": { lat: 10.5150, lng: -66.9200 },
  "Libertador - La Vega": { lat: 10.4650, lng: -66.9500 },
  "Libertador - Macarao": { lat: 10.4450, lng: -66.9900 },
  "Libertador - San Agustin": { lat: 10.5000, lng: -66.9050 },
  "Libertador - San Jose": { lat: 10.5080, lng: -66.9180 },
  "Libertador - San Juan": { lat: 10.5040, lng: -66.9250 },
  "Libertador - San Martin": { lat: 10.5050, lng: -66.9380 },
  "Libertador - San Pedro": { lat: 10.4900, lng: -66.9100 },
  "Libertador - Santa Rosalia": { lat: 10.4950, lng: -66.9200 },
  "Libertador - Santa Teresa": { lat: 10.5060, lng: -66.9146 },
  "Libertador - Sucre (Catia)": { lat: 10.5130, lng: -66.9500 },
  "Sucre - Caucaguita": { lat: 10.4600, lng: -66.7800 },
  "Sucre - Filas de Mariche": { lat: 10.4500, lng: -66.7700 },
  "Sucre - La Urbina": { lat: 10.4950, lng: -66.8200 },
  "Sucre - Leoncio Martinez": { lat: 10.4980, lng: -66.8400 },
  "Sucre - Palo Verde": { lat: 10.4850, lng: -66.8050 },
  "Sucre - Petare": { lat: 10.4806, lng: -66.8142 },
  "Chacao - Altamira": { lat: 10.4980, lng: -66.8520 },
  "Chacao - Campo Alegre": { lat: 10.4950, lng: -66.8480 },
  "Chacao - Chacao Centro": { lat: 10.4961, lng: -66.8563 },
  "Chacao - El Rosal": { lat: 10.4930, lng: -66.8600 },
  "Chacao - La Castellana": { lat: 10.5000, lng: -66.8550 },
  "Baruta - Chuao": { lat: 10.4850, lng: -66.8600 },
  "Baruta - Colinas de Bello Monte": { lat: 10.4780, lng: -66.8850 },
  "Baruta - El Cafetal": { lat: 10.4550, lng: -66.8500 },
  "Baruta - Las Mercedes": { lat: 10.4800, lng: -66.8650 },
  "Baruta - Prados del Este": { lat: 10.4600, lng: -66.8700 },
  "Baruta - Santa Fe": { lat: 10.4700, lng: -66.8550 },
  "El Hatillo - El Hatillo Centro": { lat: 10.4250, lng: -66.8250 },
  "El Hatillo - La Lagunita": { lat: 10.4350, lng: -66.8400 },
  "El Hatillo - Los Naranjos": { lat: 10.4400, lng: -66.8300 },
  "La Guaira (Vargas) - Caraballeda": { lat: 10.6100, lng: -66.8600 },
  "La Guaira (Vargas) - Catia La Mar": { lat: 10.6000, lng: -67.0300 },
  "La Guaira (Vargas) - Macuto": { lat: 10.6150, lng: -66.8900 },
  "La Guaira (Vargas) - Maiquetia": { lat: 10.6032, lng: -66.9333 },
  "La Guaira (Vargas) - Naiguata": { lat: 10.6200, lng: -66.7800 },
  "El Valle - Coche": { lat: 10.4550, lng: -66.9300 },
  "El Valle - El Valle Centro": { lat: 10.4658, lng: -66.9119 },
  "El Valle - Los Jardines": { lat: 10.4600, lng: -66.9200 },
  "El Valle - Vista Hermosa": { lat: 10.4700, lng: -66.9050 },
  "Caricuao - UD1": { lat: 10.4380, lng: -66.9700 },
  "Caricuao - UD2": { lat: 10.4370, lng: -66.9730 },
  "Caricuao - UD3": { lat: 10.4360, lng: -66.9760 },
  "Caricuao - UD4": { lat: 10.4350, lng: -66.9790 },
  "Caricuao - UD5": { lat: 10.4340, lng: -66.9820 },
  "Caricuao - UD7": { lat: 10.4330, lng: -66.9850 },
  "Caricuao - Ruiz Pineda": { lat: 10.4400, lng: -66.9680 },
  Otro: { lat: 10.48, lng: -66.9 },
};

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
