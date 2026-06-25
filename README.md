---
authored-by: gpt-5.3-codex
---

# Ayuda Venezuela

Aplicacion web mobile-first para reportar necesidades en crisis y coordinar voluntariado.

## Stack

- Next.js + TypeScript + Tailwind + App Router + `src/`
- Supabase PostgreSQL
- Telegram webhook con `grammy`
- PWA con service worker + cola offline IndexedDB
- Mapa con Leaflet y cluster de marcadores

## Setup local

1. Copiar variables:
   - `cp .env.example .env.local`
2. Crear tabla en Supabase:
   - Ejecutar `supabase/schema.sql`
3. Instalar y correr:
   - `npm install`
   - `npm run dev`

## Variables de entorno

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RATE_LIMIT_SECRET`
- `TELEGRAM_BOT_TOKEN`

## Endpoints

- `GET /api/reports`: lista publica sin telefono ni GPS exacto
- `POST /api/reports`: crea reporte (honeypot + rate limit)
- `PATCH /api/reports`: actualiza estado (`pending`, `in_progress`, `resolved`)
- `POST /api/telegram/webhook`: webhook del bot de Telegram

## Deploy (Vercel)

1. Importar repo en Vercel.
2. Definir env vars de `.env.example`.
3. Configurar webhook Telegram:
   - `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<tu-dominio>/api/telegram/webhook`

## Verificacion

- `npm run lint`
- `npm run build`
- `npm run test`

<!-- authored-by: gpt-5.3-codex -->
