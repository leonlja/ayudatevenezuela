"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const MiniMapPreview = dynamic(() => import("./MiniMapPreview"), { ssr: false });

type NominatimAddress = Record<string, string | undefined> & {
  road?: string;
  suburb?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  county?: string;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  address?: NominatimAddress;
};

export type SelectedReference = {
  label: string;
  lat: number;
  lng: number;
  municipality?: string;
  sector?: string;
};

type Props = {
  onSelect: (ref: SelectedReference) => void;
  onClear: () => void;
  selected: SelectedReference | null;
};

const DEBOUNCE_MS = 400;

function buildConciseLabel(result: NominatimResult): string {
  const addr = result.address;
  if (!addr) return result.display_name;

  const parts: string[] = [];
  const seen = new Set<string>();
  const add = (v: string | undefined) => {
    if (v && !seen.has(v)) {
      seen.add(v);
      parts.push(v);
    }
  };

  const displayFirst = result.display_name.split(",")[0]?.trim();
  add(displayFirst);
  add(addr.road);
  add(addr.suburb);

  const mun = addr.city_district || addr.county;
  add(mun);

  const city = addr.city || addr.town || addr.village;
  if (city !== mun) add(city);

  return parts.length > 0 ? parts.join(", ") : result.display_name;
}

function extractLocationInfo(addr?: NominatimAddress) {
  if (!addr) return {};
  return {
    municipality: addr.city_district || addr.county || addr.city || addr.town,
    sector: addr.suburb,
  };
}

export default function ReferenceSearch({ onSelect, onClear, selected }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: q,
        countrycodes: "ve",
        format: "json",
        limit: "6",
        addressdetails: "1",
      });
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { "Accept-Language": "es" } },
      );
      if (!res.ok) throw new Error("Nominatim error");
      const data = (await res.json()) as NominatimResult[];
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(() => search(query), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: NominatimResult) => {
    const loc = extractLocationInfo(result.address);
    const ref: SelectedReference = {
      label: buildConciseLabel(result),
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      municipality: loc.municipality,
      sector: loc.sector,
    };
    onSelect(ref);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  if (selected) {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2 rounded bg-slate-800 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Punto de referencia
            </p>
            <p className="mt-1 text-sm text-slate-200">{selected.label}</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded bg-slate-700 px-2 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-600"
          >
            Cambiar
          </button>
        </div>
        <MiniMapPreview lat={selected.lat} lng={selected.lng} label={selected.label} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Buscar lugar, ej: "Hospital Miguel Perez Carreño"'
          className="min-h-12 w-full rounded bg-slate-800 p-3 pr-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-ve-yellow" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded border border-slate-700 bg-slate-900 shadow-lg">
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                type="button"
                className="w-full px-3 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800"
                onClick={() => handleSelect(r)}
              >
                {buildConciseLabel(r)}
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 3 && !loading && results.length === 0 && open && (
        <div className="absolute z-20 mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-3 text-center text-sm text-slate-400 shadow-lg">
          No se encontraron resultados
        </div>
      )}
    </div>
  );
}

// authored-by: claude-opus-4-6
