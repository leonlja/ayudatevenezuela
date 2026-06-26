"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16, { animate: true });
  }, [map, lat, lng]);
  return null;
}

const markerIcon = divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" fill="#fff" opacity="0.9"/>
  </svg>`,
  className: "",
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

type Props = {
  lat: number;
  lng: number;
  label: string;
};

export default function MiniMapPreview({ lat, lng, label }: Props) {
  return (
    <div className="overflow-hidden rounded border border-slate-700">
      <div className="h-[180px] w-full">
        <MapContainer
          center={[lat, lng]}
          zoom={16}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} icon={markerIcon} />
          <RecenterMap lat={lat} lng={lng} />
        </MapContainer>
      </div>
      <div className="bg-slate-800 px-3 py-2">
        <p className="truncate text-sm font-medium text-slate-200">{label}</p>
      </div>
    </div>
  );
}

// authored-by: claude-opus-4-6
