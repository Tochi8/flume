-- Flume auth desk follow-up (run in Supabase SQL editor on project rinybhztdjmqbzfzsiog)
-- Safe to re-run.

-- users.auth_user_id (may already exist)
alter table public.users
  add column if not exists auth_user_id uuid unique references auth.users(id) on delete cascade;

create index if not exists users_auth_user_id_idx on public.users (auth_user_id);

-- Optional tenant settings jsonb (qualification fallback)
alter table public.tenants
  add column if not exists settings jsonb not null default '{}'::jsonb;

-- Expand connection kinds for Facebook / Instagram
alter table public.connections drop constraint if exists connections_kind_check;
alter table public.connections
  add constraint connections_kind_check
  check (kind in ('whatsapp', 'meta_page', 'facebook', 'instagram', 'tiktok'));

-- Campaigns
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  source text not null default 'facebook',
  source_label text,
  leads_count int not null default 0,
  spend_ngn int not null default 0,
  status text not null default 'active' check (status in ('active', 'paused', 'ended')),
  external_id text,
  created_at timestamptz not null default now()
);

create index if not exists campaigns_tenant_idx on public.campaigns (tenant_id, created_at desc);

-- Qualification configs
create table if not exists public.qualification_configs (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  behavior text not null default 'auto_qualify' check (behavior in ('auto_qualify', 'hand_off')),
  questions jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Demo campaigns for demo tenant (idempotent)
insert into public.campaigns (tenant_id, name, source, source_label, leads_count, spend_ngn, status)
select v.tenant_id, v.name, v.source, v.source_label, v.leads_count, v.spend_ngn, v.status
from (values
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Event Chairs — Lagos', 'facebook', 'Facebook · Lead Ads', 58, 42000, 'active'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Ramadan Furniture Sale', 'facebook', 'Facebook · Lead Ads', 34, 25500, 'active'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Office Chairs Promo', 'tiktok', 'TikTok · Lead Generation', 21, 18200, 'active'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Valentine Bundle', 'facebook', 'Facebook · Lead Ads', 14, 9800, 'paused'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'New Year Clearance', 'tiktok', 'TikTok · Lead Generation', 0, 0, 'ended')
) as v(tenant_id, name, source, source_label, leads_count, spend_ngn, status)
where exists (select 1 from public.tenants t where t.id = v.tenant_id)
  and not exists (select 1 from public.campaigns c where c.tenant_id = v.tenant_id);

-- Demo qualification config
insert into public.qualification_configs (tenant_id, behavior, questions)
values (
  '11111111-1111-1111-1111-111111111111',
  'auto_qualify',
  '[
    {"id":"q1","order":1,"prompt":"What service do you need?"},
    {"id":"q2","order":2,"prompt":"When do you need it?"},
    {"id":"q3","order":3,"prompt":"What''s your budget?"}
  ]'::jsonb
)
on conflict (tenant_id) do nothing;

-- Demo conversations (if empty)
insert into public.conversations (lead_id, direction, body, created_at)
select * from (values
  ('ed67441c-051e-478d-ae4e-bca60eb4ff62'::uuid, 'in', 'Hi, I saw your chairs on Facebook.', '2026-09-05T08:14:00Z'::timestamptz),
  ('ed67441c-051e-478d-ae4e-bca60eb4ff62'::uuid, 'in', 'I need 20 chairs for an event next Saturday.', '2026-09-05T08:15:00Z'::timestamptz),
  ('ed67441c-051e-478d-ae4e-bca60eb4ff62'::uuid, 'out', 'Hi Adebayo! Happy to help — what kind of event is it?', '2026-09-05T08:20:00Z'::timestamptz),
  ('ed67441c-051e-478d-ae4e-bca60eb4ff62'::uuid, 'in', 'A wedding reception. How much for 20 chairs, delivered Saturday?', '2026-09-05T08:31:00Z'::timestamptz),
  ('12a4bcbf-5e33-4d39-a3d9-5c51929d7146'::uuid, 'in', 'Do you cook for 40 people on Sunday?', '2026-09-05T12:00:00Z'::timestamptz),
  ('12a4bcbf-5e33-4d39-a3d9-5c51929d7146'::uuid, 'out', 'Hi Chiamaka — Sunday is open. What time should we arrive in Lekki?', '2026-09-05T12:10:00Z'::timestamptz),
  ('3979f1f4-442d-41c4-bfd9-44aeef672925'::uuid, 'in', 'How much is a consult?', '2026-09-04T15:00:00Z'::timestamptz)
) as v(lead_id, direction, body, created_at)
where exists (select 1 from public.leads l where l.id = v.lead_id)
  and not exists (select 1 from public.conversations c where c.lead_id = v.lead_id);

-- NOTE: handle_new_user trigger should already exist remotely.
-- Auth Site URL / redirect URLs: https://flume-ten.vercel.app and http://localhost:3000
-- Callback: https://flume-ten.vercel.app/auth/callback
