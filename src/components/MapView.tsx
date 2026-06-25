"use client";

import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { PublicReport } from "@/lib/supabase";
import "leaflet/dist/leaflet.css";

type Props = {
  reports: PublicReport[];
};

export default function MapView({ reports }: Props) {
  const markerColor = (urgency: string) => {
    if (urgency === "critica") return "#b91c1c";
    if (urgency === "alta") return "#f97316";
    if (urgency === "media") return "#facc15";
    return "#16a34a";
  };

  const geoReports = reports.filter((report) => report.lat && report.lng);

  return (
    <div className="relative h-[60vh] overflow-hidden rounded border border-slate-700">
      <MapContainer center={[10.48, -66.9]} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
        <MarkerClusterGroup chunkedLoading>
          {geoReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat as number, report.lng as number]}
              icon={divIcon({
                html: `<span style="display:inline-block;width:16px;height:16px;border-radius:999px;border:2px solid #fff;background:${markerColor(report.urgency)}"></span>`,
                className: "",
                iconSize: [16, 16],
              })}
            >
              <Popup>
                <p>
                  <strong>{report.zone}</strong>
                </p>
                <p>{report.description}</p>
                <p>Urgencia: {report.urgency}</p>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      {geoReports.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="rounded bg-slate-900 px-4 py-3 text-center font-semibold text-slate-300">
            No hay reportes con ubicacion GPS aun.
            <br />
            <span className="text-sm font-normal text-slate-400">Los reportes con GPS apareceran aqui automaticamente.</span>
          </p>
        </div>
      )}
    </div>
  );
}

// authored-by: gpt-5.3-codex
