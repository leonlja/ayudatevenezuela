const CACHE = new Map<string, { lat: number; lng: number; accuracy_km: number } | null>();
const CACHE_TTL_MS = 10 * 60 * 1000;
const timeouts = new Map<string, NodeJS.Timeout>();

export type IpGeoResult = {
  lat: number;
  lng: number;
  accuracy_km: number;
};

/**
 * Resolve approximate coordinates from an IP address using ip-api.com (free tier).
 * Returns null on failure or private/localhost IPs.
 * Accuracy is typically 5-50 km depending on ISP density in the region.
 */
export async function geolocateIp(ip: string): Promise<IpGeoResult | null> {
  if (!ip || ip === "unknown" || ip.startsWith("127.") || ip === "::1") {
    return null;
  }

  if (CACHE.has(ip)) return CACHE.get(ip) ?? null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,lat,lon,city,regionName`,
      { signal: controller.signal },
    );
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = (await res.json()) as {
      status: string;
      lat?: number;
      lon?: number;
      city?: string;
      regionName?: string;
    };

    if (data.status !== "success" || data.lat == null || data.lon == null) {
      CACHE.set(ip, null);
      return null;
    }

    const result: IpGeoResult = {
      lat: data.lat,
      lng: data.lon,
      accuracy_km: data.city ? 5 : 25,
    };

    CACHE.set(ip, result);
    const evictTimeout = setTimeout(() => {
      CACHE.delete(ip);
      timeouts.delete(ip);
    }, CACHE_TTL_MS);
    timeouts.set(ip, evictTimeout);

    return result;
  } catch {
    return null;
  }
}

// authored-by: claude-opus-4-6
