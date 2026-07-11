-- Debt repayments: partial/full repayment history with account balance effects.
-- Run after database/migrations/001_finance_foundation.sql.

create extension if not exists pgcrypto;

alter table public.debts
  add column if not exists person_id uuid references public.people(id) on delete set null,
  add column if not exists debt_date date not null default current_date,
  add column if not exists currency text not null default 'SAR';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'debts_amounts_non_negative'
      and conrelid = 'public.debts'::regclass
  ) then
    alter table public.debts
      add constraint debts_amounts_non_negative check (total_amount >= 0 and paid_amount >= 0);
  end if;
end $$;

create table if not exists public.debt_repayments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  debt_id uuid not null references public.debts(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'SAR',
  paid_at date not null default current_date,
  direction text not null,
  idempotency_key text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (direction in ('inflow', 'outflow'))
);

create unique index if not exists debt_repayments_user_idempotency_key
  on public.debt_repayments (user_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists idx_debt_repayments_user_paid
  on public.debt_repayments (user_id, paid_at desc);
create index if not exists idx_debt_repayments_debt
  on public.debt_repayments (debt_id, paid_at desc);

alter table public.debt_repayments enable row level security;

drop policy if exists own_debt_repayments_all on public.debt_repayments;
create policy own_debt_repayments_all on public.debt_repayments
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop trigger if exists set_updated_at on public.debt_repayments;
create trigger set_updated_at before update on public.debt_repayments
  for each row execute function public.set_updated_at();

create or replace function public.record_debt_repayment(
  p_debt_id uuid,
  p_account_id uuid,
  p_amount numeric,
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
  v_debt public.debts%rowtype;
  v_account_id uuid;
  v_direction text;
  v_remaining numeric;
  v_repayment_id uuid;
  v_transaction_id uuid;
  v_status text;
begin
  if v_user is null then
    raise exception 'Authentication is required.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Repayment amount must be greater than zero.';
  end if;

  if p_idempotency_key is not null then
    select id into v_repayment_id
    from public.debt_repayments
    where user_id = v_user
      and idempotency_key = p_idempotency_key
    limit 1;

    if v_repayment_id is not null then
      return v_repayment_id;
    end if;
  end if;

  select * into v_debt
  from public.debts
  where id = p_debt_id
    and user_id = v_user
  for update;

  if v_debt.id is null then
    raise exception 'Debt was not found.';
  end if;

  select id into v_account_id
  from public.accounts
  where id = p_account_id
    and user_id = v_user
    and is_archived = false
  for update;

  if v_account_id is null then
    raise exception 'Account was not found or is archived.';
  end if;

  v_remaining := round(coalesce(v_debt.total_amount, 0) - coalesce(v_debt.paid_amount, 0), 2);

  if v_remaining <= 0 then
    raise exception 'Debt is already fully paid.';
  end if;

  if round(p_amount, 2) > v_remaining then
    raise exception 'Repayment amount cannot exceed remaining debt.';
  end if;

  if v_debt.debt_type in ('لي', 'owed_to_me') then
    v_direction := 'inflow';
  else
    v_direction := 'outflow';
  end if;

  insert into public.debt_repayments (
    user_id, debt_id, account_id, amount, currency, paid_at, direction, idempotency_key, notes
  )
  values (
    v_user, p_debt_id, v_account_id, round(p_amount, 2), coalesce(nullif(p_currency, ''), coalesce(v_debt.currency, 'SAR')),
    coalesce(p_paid_at, current_date), v_direction, p_idempotency_key, p_notes
  )
  returning id into v_repayment_id;

  if v_direction = 'inflow' then
    update public.accounts
    set
      balance = round(balance + p_amount, 2),
      available_balance = round(available_balance + p_amount, 2),
      last_activity_at = now(),
      updated_at = now()
    where id = v_account_id;
  else
    update public.accounts
    set
      balance = round(balance - p_amount, 2),
      available_balance = round(available_balance - p_amount, 2),
      last_activity_at = now(),
      updated_at = now()
    where id = v_account_id;
  end if;

  v_status := case
    when round(coalesce(v_debt.paid_amount, 0) + p_amount, 2) >= round(coalesce(v_debt.total_amount, 0), 2)
      then 'مدفوع'
    else 'مفتوح'
  end;

  update public.debts
  set
    paid_amount = round(coalesce(paid_amount, 0) + p_amount, 2),
    status = v_status,
    updated_at = now()
  where id = p_debt_id
    and user_id = v_user;

  insert into public.financial_transactions (
    user_id, transaction_type, title, amount, currency, account_id,
    transaction_date, direction, source_table, source_id, idempotency_key,
    notes, metadata
  )
  values (
    v_user,
    case when v_direction = 'inflow' then 'debt_repayment_received' else 'debt_repayment_paid' end,
    v_debt.title,
    round(p_amount, 2),
    coalesce(nullif(p_currency, ''), coalesce(v_debt.currency, 'SAR')),
    v_account_id,
    coalesce(p_paid_at, current_date),
    v_direction,
    'debt_repayments',
    v_repayment_id,
    p_idempotency_key,
    p_notes,
    jsonb_build_object('debt_id', p_debt_id, 'debt_type', v_debt.debt_type, 'party', v_debt.party)
  )
  returning id into v_transaction_id;

  insert into public.financial_audit_logs (
    user_id, action, target_table, target_id, amount, account_id, metadata
  )
  values (
    v_user, 'record_debt_repayment', 'debt_repayments', v_repayment_id,
    round(p_amount, 2), v_account_id,
    jsonb_build_object('debt_id', p_debt_id, 'transaction_id', v_transaction_id, 'direction', v_direction)
  );

  return v_repayment_id;
end;
$$;

grant all on public.debt_repayments to authenticated;
grant execute on function public.record_debt_repayment(uuid, uuid, numeric, text, date, text, text) to authenticated;
