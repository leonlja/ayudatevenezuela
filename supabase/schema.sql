create extension if not exists pgcrypto;

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  zone text not null,
  address text,
  lat double precision,
  lng double precision,
  lat_exact double precision,
  lng_exact double precision,
  category text not null,
  urgency text not null check (urgency in ('critica','alta','media','baja')),
  people_count integer not null default 1 check (people_count > 0),
  description text not null,
  contact_name text,
  contact_phone text,
  status text not null default 'pending' check (status in ('pending','in_progress','resolved')),
  resolved_at timestamptz,
  source text not null default 'web' check (source in ('web','telegram')),
  telegram_username text,
  ip_hash text,
  device_id text,
  volunteer_note text,
  location_source text not null default 'none' check (location_source in ('gps','ip','none'))
);

create index if not exists idx_reports_status_urgency on reports (status, urgency);
create index if not exists idx_reports_zone on reports (zone);
create index if not exists idx_reports_created_at on reports (created_at desc);
create index if not exists idx_reports_category on reports (category);

create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_reports_updated_at on reports;
create trigger trg_reports_updated_at
before update on reports
for each row execute function set_updated_at();

create or replace function purge_sensitive_fields()
returns void
language sql
set search_path = ''
as $$
  update public.reports
  set lat_exact = null,
      lng_exact = null,
      contact_phone = null
  where created_at < now() - interval '30 days';
$$;

alter table reports enable row level security;

create or replace view public_reports as
select
  id, created_at, zone, address, lat, lng, category, urgency,
  people_count, description, contact_name, status, resolved_at,
  source, telegram_username, location_source, volunteer_note
from reports;

drop policy if exists "public_read_reports" on reports;
create policy "public_read_reports"
on reports
for select
using (true);

drop policy if exists "service_write_reports" on reports;
create policy "service_write_reports"
on reports
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create index if not exists idx_reports_rate_limit on reports (ip_hash, device_id, created_at);

create table if not exists telegram_sessions (
  user_id bigint primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

-- Schedule weekly (example with pg_cron enabled in Supabase):
-- select cron.schedule('purge-sensitive-weekly', '0 3 * * 0', $$select purge_sensitive_fields();$$);

-- authored-by: claude-opus-4-7
