"use client";

import { divIcon } from "leaflet";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { PublicReport } from "@/lib/supabase";
import { CATEGORIES, URGENCIES, ZONE_COORDS } from "@/lib/categories";
import "leaflet/dist/leaflet.css";

type Props = {
  reports: PublicReport[];
};

function hasValidCoords(report: PublicReport): boolean {
  if (report.lat == null || report.lng == null) return false;
  return Math.abs(report.lat) > 1 || Math.abs(report.lng) > 1;
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  }
  return h;
}

function getReportPosition(report: PublicReport): [number, number] {
  if (hasValidCoords(report)) return [report.lat!, report.lng!];
  const fallback = ZONE_COORDS[report.zone] ?? ZONE_COORDS.Otro;
  const h = hashId(report.id);
  const jitterLat = ((h & 0xffff) / 0xffff - 0.5) * 0.01;
  const jitterLng = (((h >> 16) & 0xffff) / 0xffff - 0.5) * 0.01;
  return [fallback.lat + jitterLat, fallback.lng + jitterLng];
}

function clusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 40 : count < 50 ? 48 : 56;
  return divIcon({
    html: `<div style="
      width: ${size}px; height: ${size}px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255, 209, 0, 0.9);
      border: 3px solid #fff;
      border-radius: 50%;
      color: #0f172a;
      font-weight: 800;
      font-size: ${size > 40 ? 16 : 14}px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    ">${count}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function pinIcon(urgency: string) {
  const colors: Record<string, string> = {
    critica: "#b91c1c",
    alta: "#f97316",
    media: "#facc15",
    baja: "#16a34a",
  };
  const fill = colors[urgency] ?? "#64748b";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${fill}" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" fill="#fff" opacity="0.9"/>
  </svg>`;
  return divIcon({
    html: svg,
    className: "",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

function categoryLabel(cat: string): string {
  return cat
    .split(",")
    .map((c) => CATEGORIES.find((item) => item.value === c.trim())?.label ?? c)
    .join(", ");
}

function urgencyLabel(u: string): string {
  return URGENCIES.find((item) => item.value === u)?.label ?? u;
}

export default function MapView({ reports }: Props) {
  return (
    <div className="relative h-[60vh] overflow-hidden rounded border border-slate-700">
      <MapContainer center={[10.48, -66.9]} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
        {reports
          .filter((r) => (r.location_source ?? "none") === "ip" && hasValidCoords(r))
          .map((report) => (
            <Circle
              key={`radius-${report.id}`}
              center={[report.lat!, report.lng!]}
              radius={5000}
              pathOptions={{ color: "#64748b", weight: 1, fillOpacity: 0.08, dashArray: "4 4" }}
            />
          ))}
        <MarkerClusterGroup chunkedLoading maxClusterRadius={50} disableClusteringAtZoom={14} iconCreateFunction={clusterIcon}>
          {reports.map((report) => {
            const pos = getReportPosition(report);
            const locSource = report.location_source ?? "none";

            return (
              <Marker
                key={report.id}
                position={pos}
                icon={pinIcon(report.urgency)}
              >
                <Popup>
                  <div style={{ minWidth: 180, fontSize: 13, lineHeight: 1.5, color: "#1e293b" }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14 }}>{report.zone}</p>
                    <p style={{ margin: "0 0 4px" }}>{report.description}</p>
                    <p style={{ margin: "0 0 2px" }}><strong>Categoria:</strong> {categoryLabel(report.category)}</p>
                    <p style={{ margin: "0 0 2px" }}><strong>Urgencia:</strong> {urgencyLabel(report.urgency)}</p>
                    <p style={{ margin: "0 0 2px" }}><strong>Personas:</strong> {report.people_count}</p>
                    <p style={{ margin: "0 0 2px" }}><strong>Estado:</strong> {report.status === "in_progress" ? "Ayuda en camino" : report.status === "resolved" ? "Resuelto" : "Pendiente"}</p>
                    {report.contact_name && <p style={{ margin: "0 0 2px" }}><strong>Contacto:</strong> {report.contact_name}</p>}
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748b" }}>
                      {new Date(report.created_at).toLocaleString("es-VE")}
                      {locSource === "ip" ? " (ubicacion por IP ~5km)" : locSource === "none" ? " (solo zona)" : ""}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
      {reports.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="rounded bg-slate-900 px-4 py-3 text-center font-semibold text-slate-300">
            No hay reportes aun.
          </p>
        </div>
      )}
    </div>
  );
}

// authored-by: claude-opus-4-6
