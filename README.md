---
authored-by: claude-opus-4-6
---

# Ayúdate Venezuela

Aplicacion web mobile-first para reportar necesidades en crisis y coordinar voluntariado.

## Stack

- Next.js + TypeScript + Tailwind + App Router + `src/`
- Supabase PostgreSQL
- Telegram webhook con `grammy`
- PWA con service worker + cola offline IndexedDB
- Mapa con Leaflet y cluster de marcadores

## Setup local

1. `cp .env.example .env.local`
2. Ejecutar `supabase/schema.sql` en Supabase
3. `npm install && npm run dev`

## Variables de entorno

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave publica Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (server-side) |
| `RATE_LIMIT_SECRET` | HMAC secret para hash de IP |
| `TELEGRAM_BOT_TOKEN` | Token del bot Grammy |
| `TELEGRAM_WEBHOOK_SECRET` | Validacion de webhook (opcional) |
| `ADMIN_SECRET` | Token para operaciones admin (PATCH resolved, DELETE, hide) |

## API

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| `GET` | `/api/reports` | — | Lista publica (sin PII, excluye `hidden`) |
| `POST` | `/api/reports` | — | Crear reporte (honeypot + rate limit) |
| `PATCH` | `/api/reports` | parcial | Cambiar estado o ocultar reporte |
| `DELETE` | `/api/reports` | admin | Eliminar reportes |
| `POST` | `/api/telegram/webhook` | — | Webhook Telegram |

### Admin (PATCH)

```bash
# Ocultar reporte
curl -X PATCH https://ayudatevenezuela.vercel.app/api/reports \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_SECRET" \
  -d '{"id": "UUID", "hidden": true}'

# Marcar resuelto
curl -X PATCH https://ayudatevenezuela.vercel.app/api/reports \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_SECRET" \
  -d '{"id": "UUID", "status": "resolved"}'
```

### Admin (DELETE)

```bash
curl -X DELETE https://ayudatevenezuela.vercel.app/api/reports \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_SECRET" \
  -d '{"id": ["UUID1", "UUID2"]}'
```

## Deploy (Vercel)

1. Importar repo en Vercel.
2. Definir env vars de `.env.example`.
3. Configurar webhook Telegram:
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<dominio>/api/telegram/webhook`

## DB migrations

Ejecutar en Supabase SQL Editor cuando se actualice `schema.sql`:

```sql
-- v2: hidden column
ALTER TABLE reports ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;
```

<!-- authored-by: claude-opus-4-6 -->
