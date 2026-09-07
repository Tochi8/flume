-- Flume waitlist signups from /waitlist
-- Run this in the Supabase SQL editor for project rinybhztdjmqbzfzsiog

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  problem text not null,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_created_idx on public.waitlist (created_at desc);

alter table public.waitlist enable row level security;
