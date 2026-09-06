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

WhatsApp lead desk. Bachs billing (NGN), not Paystack.
