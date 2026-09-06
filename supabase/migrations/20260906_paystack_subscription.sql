-- Paystack customer + subscription codes for webhook fulfilment
alter table public.tenants
  add column if not exists paystack_customer_code text;

alter table public.tenants
  add column if not exists paystack_subscription_code text;

create index if not exists tenants_paystack_customer_idx
  on public.tenants (paystack_customer_code)
  where paystack_customer_code is not null;

create index if not exists tenants_paystack_subscription_idx
  on public.tenants (paystack_subscription_code)
  where paystack_subscription_code is not null;
