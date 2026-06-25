import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabasePublic =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const supabaseAdmin = supabaseServiceRole
  ? createClient(supabaseUrl || "", supabaseServiceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export type PublicReport = {
  id: string;
  created_at: string;
  zone: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  category: string;
  urgency: string;
  people_count: number;
  description: string;
  contact_name: string | null;
  status: string;
  source: string;
  telegram_username: string | null;
  location_source: "gps" | "ip" | "none";
};

// authored-by: gpt-5.3-codex
