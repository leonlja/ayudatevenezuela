import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { fuzzCoord } from "@/lib/geo";
import { geolocateIp } from "@/lib/ip-geo";
import { CATEGORIES, URGENCIES, ZONES, STATUSES } from "@/lib/categories";

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT_PER_HOUR = 5;
const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.value));
const VALID_URGENCIES = new Set<string>(URGENCIES.map((u) => u.value));
const VALID_ZONES = new Set<string>(ZONES);
const VALID_STATUSES = new Set<string>(STATUSES.map((s) => s.value));

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function hashIp(ip: string) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error("RATE_LIMIT_SECRET is required");
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

async function canPassRateLimit(ipHash: string, deviceId: string): Promise<boolean> {
  if (!supabaseAdmin) return true;
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count } = await supabaseAdmin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("device_id", deviceId)
    .gte("created_at", since);
  return (count ?? 0) < LIMIT_PER_HOUR;
}

function parseNum(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function parseBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return request.json();
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const body: Record<string, string> = {};
    form.forEach((value, key) => {
      body[key] = String(value);
    });
    return body;
  }
  return {};
}

function checkAdminAuth(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get("x-admin-token") === secret;
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  }
  const { data, error } = await supabaseAdmin
    .from("reports")
    .select(
      "id,created_at,zone,address,lat,lng,category,urgency,people_count,description,contact_name,status,source,telegram_username,location_source",
    )
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  }

  const body = (await parseBody(request)) as Record<string, string>;
  if (body.hp_website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  let ipHash: string;
  try {
    ipHash = hashIp(getClientIp(request));
  } catch {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const deviceId = body.device_id || request.headers.get("x-device-id") || "unknown-device";
  if (!(await canPassRateLimit(ipHash, deviceId))) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const rawCategory = body.category || "otro";
  const categories = typeof rawCategory === "string" ? rawCategory.split(",").map((c: string) => c.trim()).filter(Boolean) : [rawCategory];
  const urgency = body.urgency || "media";
  const zone = body.zone || "Otro";

  if (categories.length === 0 || categories.length > 3 || !categories.every((c: string) => VALID_CATEGORIES.has(c))) {
    return NextResponse.json({ error: "Categoria invalida" }, { status: 400 });
  }
  const category = categories.join(",");
  if (!VALID_URGENCIES.has(urgency)) {
    return NextResponse.json({ error: "Urgencia invalida" }, { status: 400 });
  }
  if (!VALID_ZONES.has(zone)) {
    return NextResponse.json({ error: "Zona invalida" }, { status: 400 });
  }

  const latExact = parseNum(body.lat_exact);
  const lngExact = parseNum(body.lng_exact);

  let lat: number | null = null;
  let lng: number | null = null;
  let locationSource: "gps" | "ip" | "none" = "none";

  if (latExact !== null && lngExact !== null) {
    const fuzzy = fuzzCoord(latExact, lngExact);
    lat = fuzzy.lat;
    lng = fuzzy.lng;
    locationSource = "gps";
  } else {
    const clientIp = getClientIp(request);
    const ipGeo = await geolocateIp(clientIp);
    if (ipGeo) {
      lat = ipGeo.lat;
      lng = ipGeo.lng;
      locationSource = "ip";
    }
  }

  const payload = {
    zone,
    address: body.address || null,
    lat,
    lng,
    lat_exact: latExact,
    lng_exact: lngExact,
    category,
    urgency,
    people_count: Math.max(parseNum(body.people_count) || 1, 1),
    description: body.description || "",
    contact_name: body.contact_name || null,
    contact_phone: body.contact_phone || null,
    status: "pending",
    source: "web",
    ip_hash: ipHash,
    device_id: deviceId,
    location_source: locationSource,
  };

  if (!payload.description) {
    return NextResponse.json({ error: "Descripcion requerida" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("reports").insert(payload).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  }

  const { id, status, volunteer_note, device_id, hidden } = (await request.json()) as {
    id?: string;
    status?: string;
    volunteer_note?: string;
    device_id?: string;
    hidden?: boolean;
  };

  if (typeof hidden === "boolean") {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const { error } = await supabaseAdmin.from("reports").update({ hidden }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Estado invalido" }, { status: 400 });
  }

  if (status === "resolved" && !checkAdminAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (status === "in_progress") {
    if (!volunteer_note?.trim()) {
      return NextResponse.json({ error: "Describe la ayuda que estas prestando" }, { status: 400 });
    }
    if (!device_id) {
      return NextResponse.json({ error: "Identificador de dispositivo requerido" }, { status: 400 });
    }
  }

  const update: Record<string, unknown> = { status };
  if (volunteer_note?.trim()) {
    update.volunteer_note = volunteer_note.trim();
  }
  if (status === "resolved") {
    update.resolved_at = new Date().toISOString();
  }

  const { error } = await supabaseAdmin.from("reports").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  }
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string | string[] };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const ids = Array.isArray(id) ? id : [id];
  const { error } = await supabaseAdmin.from("reports").delete().in("id", ids);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: ids.length });
}

// authored-by: claude-opus-4-6
