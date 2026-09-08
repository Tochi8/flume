# Flume

Flume turns WhatsApp conversations into customers.

Live: https://flume-ten.vercel.app

## Auth

- /signup and /login (Supabase Auth email/password)
- Desk routes require session (middleware)
- /conversations lists threads; /inbox/[uuid] opens a thread
- Marketing CTAs go to /signup

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Apply `supabase/migrations/20260906_auth_desk.sql` in the Supabase SQL editor for campaigns + qualification_configs.

Auth Site URL: https://flume-ten.vercel.app

## APIs

Auth-gated: /api/leads, /api/leads/[id], /api/tenant, /api/connections, /api/campaigns, /api/qualification, /api/billing/checkout
Public: /api/webhooks/*

Service role is server-only. Tenant scoping uses users.auth_user_id.

## Product locks

WhatsApp lead desk. Paystack billing (NGN).

## TikTok Instant Form (MVP)

Webhook: `POST https://flume-ten.vercel.app/api/webhooks/tiktok`

Env: `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_ACCESS_TOKEN`, optional `TIKTOK_ADVERTISER_ID`.

Flow: subscription notify (`lead_id`, `advertiser_id`, `page_id`) → verify signature → `GET /open_api/v1.3/lead/get/` → idempotent `ingestLead` (`raw.external_lead_id`).

Multi-tenant OAuth / storing tokens on `connections.tokens_enc` is a follow-up; Connect TikTok currently toggles connection status only.

## WhatsApp Cloud API (official)

Webhook: `POST/GET /api/webhooks/whatsapp` — verify with `WHATSAPP_VERIFY_TOKEN`, inbound messages → `ingestLead` + conversations, statuses update by `wa_message_id` when present.

Outbound: desk send (`PATCH /api/leads/[id]` with `sendMessage`) calls Graph `/{PHONE_NUMBER_ID}/messages` when `WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` are set.

Env: see `.env.example` (`WHATSAPP_*`). Live callback: `https://flume-ten.vercel.app/api/webhooks/whatsapp`.

