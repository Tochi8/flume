# Flume

Flume turns WhatsApp conversations into customers.

It captures leads from Meta and TikTok campaigns, scores them, helps you qualify them, and keeps the next reply in one desk so a small business can close inside WhatsApp instead of a spreadsheet.

Live: [flume-ten.vercel.app](https://flume-ten.vercel.app)

## What problem it solves

Ads send people to WhatsApp. Then the thread sits there.

The owner does not know who is ready to buy, which message came from which campaign, or what to say first. Leads die in chat. Campaign spend has no follow-up.

Flume is the desk for that gap:

- One inbox for leads from WhatsApp, Facebook, Instagram, and TikTok
- A score so you know who to answer first
- Suggested replies you can send yourself
- Campaign numbers next to the conversations they created

## How to use the platform

1. Open [flume-ten.vercel.app](https://flume-ten.vercel.app).
2. Read how it works, then tap **Start for free** or **Log in**.
3. **Home** is the overview: leads this month, who needs a reply, what is working.
4. **Leads** is the list. Open a person to see the message, score, and source.
5. **Inbox** opens a conversation so you can read the thread and use a suggested reply.
6. **Analytics** shows campaign leads, spend, and cost per lead.
7. The menu (hamburger on mobile) has Qualification, Campaigns, Integrations, Billing, and Settings.
8. **Integrations** is where WhatsApp, Facebook, Instagram, and TikTok get connected.
9. **Qualification** is the questions Flume uses to score a lead.
10. **Settings** is workspace name, notification email, save, and log out.

This version walks the full product flow with sample data so you can see the desk before live channels and payments are wired.

## Tech stack

- TypeScript
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Radix UI and Lucide
- TanStack Query and TanStack Table
- React Hook Form and Zod
- Recharts
- Vercel for hosting

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Marketing site: `/`
- Desk: `/overview`, `/inbox`, `/qualification`, `/campaigns`, `/integrations`, `/billing`, `/settings`
