-- Store Bachs subscription id for reliable cancel → tenant matching
alter table public.tenants
  add column if not exists bachs_subscription_id text;

create index if not exists tenants_bachs_customer_idx
  on public.tenants (bachs_customer_id)
  where bachs_customer_id is not null;

create index if not exists tenants_bachs_subscription_idx
  on public.tenants (bachs_subscription_id)
  where bachs_subscription_id is not null;
