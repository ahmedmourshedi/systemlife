-- Subscription payments and budget usage support.
-- Run after database/migrations/001_finance_foundation.sql.

create extension if not exists pgcrypto;

alter table public.subscriptions
  add column if not exists provider text,
  add column if not exists last_paid_at date,
  add column if not exists payment_status text not null default 'active';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'subscriptions_payment_status_check'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions
      add constraint subscriptions_payment_status_check check (payment_status in ('active', 'paused', 'cancelled'));
  end if;
end $$;

create table if not exists public.subscription_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict,
  expense_id uuid references public.expenses(id) on delete set null,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'SAR',
  paid_at date not null default current_date,
  idempotency_key text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscription_payments_user_idempotency_key
  on public.subscription_payments (user_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists idx_subscription_payments_user_paid
  on public.subscription_payments (user_id, paid_at desc);
create index if not exists idx_subscription_payments_subscription
  on public.subscription_payments (subscription_id, paid_at desc);

alter table public.subscription_payments enable row level security;

drop policy if exists own_subscription_payments_all on public.subscription_payments;
create policy own_subscription_payments_all on public.subscription_payments
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop trigger if exists set_updated_at on public.subscription_payments;
create trigger set_updated_at before update on public.subscription_payments
  for each row execute function public.set_updated_at();

create or replace function public.record_subscription_payment(
  p_subscription_id uuid,
  p_account_id uuid,
  p_amount numeric default null,
  p_currency text default 'SAR',
  p_paid_at date default current_date,
  p_notes text default null,
  p_idempotency_key text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_subscription public.subscriptions%rowtype;
  v_account_id uuid;
  v_category_id uuid;
  v_amount numeric;
  v_paid_at date := coalesce(p_paid_at, current_date);
  v_payment_id uuid;
  v_expense_id uuid;
  v_transaction_id uuid;
  v_next_payment date;
begin
  if v_user is null then
    raise exception 'Authentication is required.';
  end if;

  if p_idempotency_key is not null then
    select id into v_payment_id
    from public.subscription_payments
    where user_id = v_user
      and idempotency_key = p_idempotency_key
    limit 1;

    if v_payment_id is not null then
      return v_payment_id;
    end if;
  end if;

  select * into v_subscription
  from public.subscriptions
  where id = p_subscription_id
    and user_id = v_user
    and is_active = true
  for update;

  if v_subscription.id is null then
    raise exception 'Subscription was not found or is inactive.';
  end if;

  v_account_id := coalesce(p_account_id, v_subscription.account_id);

  select id into v_account_id
  from public.accounts
  where id = v_account_id
    and user_id = v_user
    and is_archived = false
  for update;

  if v_account_id is null then
    raise exception 'Account was not found or is archived.';
  end if;

  v_amount := round(coalesce(p_amount, v_subscription.amount), 2);

  if v_amount is null or v_amount <= 0 then
    raise exception 'Subscription payment amount must be greater than zero.';
  end if;

  insert into public.categories (user_id, name, type, icon, color)
  values (v_user, 'اشتراكات', 'expense', 'receipt', '#475569')
  on conflict (user_id, name, type) do update
    set updated_at = now()
  returning id into v_category_id;

  insert into public.expenses (
    user_id, account_id, category_id, title, amount, currency, spent_at,
    payment_method, notes
  )
  values (
    v_user, v_account_id, v_category_id, v_subscription.name, v_amount,
    coalesce(nullif(p_currency, ''), coalesce(v_subscription.currency, 'SAR')),
    v_paid_at, 'Subscription', p_notes
  )
  returning id into v_expense_id;

  insert into public.subscription_payments (
    user_id, subscription_id, account_id, expense_id, amount, currency,
    paid_at, idempotency_key, notes
  )
  values (
    v_user, p_subscription_id, v_account_id, v_expense_id, v_amount,
    coalesce(nullif(p_currency, ''), coalesce(v_subscription.currency, 'SAR')),
    v_paid_at, p_idempotency_key, p_notes
  )
  returning id into v_payment_id;

  update public.accounts
  set
    balance = round(balance - v_amount, 2),
    available_balance = round(available_balance - v_amount, 2),
    last_activity_at = now(),
    updated_at = now()
  where id = v_account_id;

  v_next_payment := case
    when v_subscription.cycle ilike '%year%' or v_subscription.cycle like '%سنوي%' then (v_paid_at + interval '1 year')::date
    when v_subscription.cycle ilike '%week%' or v_subscription.cycle like '%أسبوع%' then (v_paid_at + interval '1 week')::date
    when v_subscription.cycle ilike '%quarter%' or v_subscription.cycle like '%ربع%' then (v_paid_at + interval '3 months')::date
    else (v_paid_at + interval '1 month')::date
  end;

  update public.subscriptions
  set
    account_id = v_account_id,
    amount = v_amount,
    currency = coalesce(nullif(p_currency, ''), coalesce(v_subscription.currency, 'SAR')),
    last_paid_at = v_paid_at,
    next_payment_at = v_next_payment,
    updated_at = now()
  where id = p_subscription_id
    and user_id = v_user;

  insert into public.financial_transactions (
    user_id, transaction_type, title, amount, currency, account_id,
    category_id, transaction_date, direction, source_table, source_id,
    idempotency_key, notes, metadata
  )
  values (
    v_user, 'subscription_payment', v_subscription.name, v_amount,
    coalesce(nullif(p_currency, ''), coalesce(v_subscription.currency, 'SAR')),
    v_account_id, v_category_id, v_paid_at, 'outflow',
    'subscription_payments', v_payment_id, p_idempotency_key, p_notes,
    jsonb_build_object('subscription_id', p_subscription_id, 'expense_id', v_expense_id, 'cycle', v_subscription.cycle, 'next_payment_at', v_next_payment)
  )
  returning id into v_transaction_id;

  insert into public.financial_audit_logs (
    user_id, action, target_table, target_id, amount, account_id, metadata
  )
  values (
    v_user, 'record_subscription_payment', 'subscription_payments', v_payment_id,
    v_amount, v_account_id,
    jsonb_build_object('subscription_id', p_subscription_id, 'transaction_id', v_transaction_id, 'expense_id', v_expense_id)
  );

  return v_payment_id;
end;
$$;

grant all on public.subscription_payments to authenticated;
grant execute on function public.record_subscription_payment(uuid, uuid, numeric, text, date, text, text) to authenticated;
