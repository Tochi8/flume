# Flume

WhatsApp-first lead pipeline for African SMEs.
Official WhatsApp Cloud API only. Billing via [Bachs](https://docs.bachs.io).

Live build log lives in Notion (separate from the product spec).

## Stack
JavaScript · Next.js 15 App Router · React

## Local
```bash
cp .env.example .env.local
npm install
npm run dev
```

## Bachs
1. Sign up at https://app.bachs.io
2. Developer → API keys → sandbox `sk_sandbox_...`
3. Create two recurring products in NGN: Pro Monthly `15000.00`, Pro Yearly `150000.00`
4. Paste product ids into env vars
5. Webhook URL: `https://YOUR_DOMAIN/api/webhooks/bachs`

Amounts are decimal strings. Never kobo.
