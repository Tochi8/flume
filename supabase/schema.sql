-- Flume core schema (documentation for local/devs)
-- Project: rinybhztdjmqbzfzsiog (https://rinybhztdjmqbzfzsiog.supabase.co)
-- ALREADY applied remotely. Do NOT re-run create-table migrations that conflict.
-- Paste into SQL editor only when rebuilding a fresh database.

create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  workspace text not null default '',
  plan text not null default 'free' check (plan in ('free', 'pro_month', 'pro_year')),
  extract_limit int not null default 50,
  timezone text not null default 'Africa/Lagos',
  bachs_customer_id text,
  bachs_subscription_id text,
  paystack_customer_code text,
  paystack_subscription_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'owner',
  password_hash text,
  created_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  kind text not null check (kind in ('whatsapp', 'meta_page', 'tiktok')),
  external_id text,
  status text not null default 'disconnected',
  tokens_enc text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  phone_e164 text not null,
  name text,
  source text,
  campaign_id text,
  score int,
  score_reasons jsonb not null default '[]'::jsonb,
  band text,
  status text not null default 'new' check (status in ('new', 'qualified', 'contacted', 'won', 'lost', 'junk')),
  excerpt text,
  draft text,
  cost_ngn int default 10,
  intent text,
  extracted_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb,
  unique (tenant_id, phone_e164)
);

create index if not exists leads_tenant_extracted_idx on public.leads (tenant_id, extracted_at desc);
create index if not exists leads_tenant_status_idx on public.leads (tenant_id, status);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  wa_message_id text,
  direction text not null check (direction in ('in', 'out')),
  body text not null,
  template_name text,
  billed_by_meta boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  body text not null,
  approved_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_months (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  yyyymm text not null,
  extracts_used int not null default 0,
  primary key (tenant_id, yyyymm)
);

-- Demo seed (idempotent-ish: only if no tenants)
-- Demo tenant: 11111111-1111-1111-1111-111111111111
do $$
begin
  if not exists (select 1 from public.tenants) then
    insert into public.tenants (id, name, workspace, plan, extract_limit)
    values ('11111111-1111-1111-1111-111111111111', 'Tolu', 'Lekki Events', 'free', 50);

    insert into public.usage_months (tenant_id, yyyymm, extracts_used)
    values ('11111111-1111-1111-1111-111111111111', to_char(timezone('Africa/Lagos', now()), 'YYYYMM'), 43);

    insert into public.leads (tenant_id, phone_e164, name, source, campaign_id, score, score_reasons, band, status, excerpt, draft, cost_ngn, intent)
    values
      ('11111111-1111-1111-1111-111111111111', '+2348011111112', 'Adebayo', 'Facebook', 'Event chairs', 92,
       '["valid phone","intent: event","source boost"]'::jsonb, 'high', 'qualified',
       'I need 20 chairs for an event next Saturday.',
       'Hi Adebayo, thanks for reaching out. We can help with the 20 chairs for your event next Saturday. Would you like our available options and pricing?',
       10, 'Event purchase'),
      ('11111111-1111-1111-1111-111111111111', '+2348111111109', 'Chiamaka', 'TikTok', 'Catering Lekki', 76,
       '["valid phone","form complete"]'::jsonb, 'medium', 'contacted',
       'Do you cook for 40 people on Sunday?',
       'Hi Chiamaka — Sunday is open. What time should we arrive in Lekki?',
       10, 'Booking'),
      ('11111111-1111-1111-1111-111111111111', '+2347011111101', 'Ibrahim', 'Click-to-WhatsApp', 'Clinic consult', 54,
       '["valid phone","thin form"]'::jsonb, 'low', 'new',
       'How much is a consult?',
       'Hi Ibrahim — consults start at ₦15,000. Are you booking for yourself?',
       10, 'Info');
  end if;
end $$;

-- NOTE: RLS is currently disabled on these tables (phase 1 uses service-role server routes).
-- Enable RLS + policies before exposing the anon key to browsers for direct table access.


-- See also: supabase/migrations/20260906_auth_desk.sql
