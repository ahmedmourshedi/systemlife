-- Finance foundation: unified transactions, atomic account movements, and transfers.
-- Run after database/schema.sql and database/mega-extension.sql.

create extension if not exists pgcrypto;

alter table public.accounts
  add column if not exists institution text,
  add column if not exists opening_balance numeric not null default 0,
  add column if not exists available_balance numeric,
  add column if not exists credit_limit numeric,
  add column if not exists include_in_net_worth boolean not null default true,
  add column if not exists include_in_available_cash boolean not null default true,
  add column if not exists status text not null default 'active',
  add column if not exists icon text,
  add column if not exists color text,
  add column if not exists last_activity_at timestamptz,
  add column if not exists archived_at timestamptz;

update public.accounts
set available_balance = balance
where available_balance is null;

alter table public.accounts
  alter column available_balance set default 0,
  alter column available_balance set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'accounts_status_check'
      and conrelid = 'public.accounts'::regclass
  ) then
    alter table public.accounts
      add constraint accounts_status_check check (status in ('active', 'archived', 'closed'));
  end if;
end $$;

create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_type text not null,
  title text not null,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'SAR',
  account_id uuid references public.accounts(id) on delete restrict,
  destination_account_id uuid references public.accounts(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  transaction_date date not null default current_date,
  direction text not null,
  status text not null default 'posted',
  source_table text,
  source_id uuid,
  idempotency_key text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (direction in ('inflow', 'outflow', 'neutral')),
  check (status in ('posted', 'voided'))
);

create unique index if not exists financial_transactions_user_idempotency_key
  on public.financial_transactions (user_id, idempotency_key)
  where idempotency_key is not null;

create table if not exists public.account_transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_account_id uuid not null references public.accounts(id) on delete restrict,
  destination_account_id uuid not null references public.accounts(id) on delete restrict,
  amount numeric(14, 2) not null check (amount > 0),
  fee numeric(14, 2) not null default 0 check (fee >= 0),
  currency text not null default 'SAR',
  transfer_at date not null default current_date,
  status text not null default 'posted',
  idempotency_key text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_account_id <> destination_account_id),
  check (status in ('posted', 'voided'))
);

create unique index if not exists account_transfers_user_idempotency_key
  on public.account_transfers (user_id, idempotency_key)
  where idempotency_key is not null;

create table if not exists public.financial_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  target_table text not null,
  target_id uuid,
  amount numeric(14, 2),
  account_id uuid references public.accounts(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.financial_transactions enable row level security;
alter table public.account_transfers enable row level security;
alter table public.financial_audit_logs enable row level security;

drop policy if exists own_financial_transactions_all on public.financial_transactions;
create policy own_financial_transactions_all on public.financial_transactions
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists own_account_transfers_all on public.account_transfers;
create policy own_account_transfers_all on public.account_transfers
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists own_financial_audit_logs_all on public.financial_audit_logs;
create policy own_financial_audit_logs_all on public.financial_audit_logs
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop trigger if exists set_updated_at on public.financial_transactions;
create trigger set_updated_at before update on public.financial_transactions
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.account_transfers;
create trigger set_updated_at before update on public.account_transfers
  for each row execute function public.set_updated_at();

create index if not exists idx_financial_transactions_user_date
  on public.financial_transactions (user_id, transaction_date desc, created_at desc);
create index if not exists idx_financial_transactions_user_type
  on public.financial_transactions (user_id, transaction_type, transaction_date desc);
create index if not exists idx_account_transfers_user_date
  on public.account_transfers (user_id, transfer_at desc);
create index if not exists idx_financial_audit_logs_user_created
  on public.financial_audit_logs (user_id, created_at desc);

create or replace function public.create_financial_movement(
  p_transaction_type text,
  p_title text,
  p_amount numeric,
  p_currency text default 'SAR',
  p_account_id uuid default null,
  p_category_id uuid default null,
  p_transaction_date date default current_date,
  p_payment_method text default null,
  p_source text default null,
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
  v_account_id uuid;
  v_category_id uuid;
  v_direction text;
  v_source_table text;
  v_legacy_id uuid;
  v_transaction_id uuid;
begin
  if v_user is null then
    raise exception 'Authentication is required.';
  end if;

  if p_transaction_type not in ('income', 'expense') then
    raise exception 'Unsupported movement type: %', p_transaction_type;
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be greater than zero.';
  end if;

  if p_idempotency_key is not null then
    select id into v_transaction_id
    from public.financial_transactions
    where user_id = v_user
      and idempotency_key = p_idempotency_key
    limit 1;

    if v_transaction_id is not null then
      return v_transaction_id;
    end if;
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

  if p_category_id is not null then
    select id into v_category_id
    from public.categories
    where id = p_category_id
      and user_id = v_user
      and type = p_transaction_type;

    if v_category_id is null then
      raise exception 'Category was not found.';
    end if;
  end if;

  if p_transaction_type = 'income' then
    v_direction := 'inflow';
    v_source_table := 'incomes';

    insert into public.incomes (
      user_id, account_id, category_id, title, amount, currency, received_at, source, notes
    )
    values (
      v_user, v_account_id, v_category_id, p_title, round(p_amount, 2), coalesce(nullif(p_currency, ''), 'SAR'),
      coalesce(p_transaction_date, current_date), p_source, p_notes
    )
    returning id into v_legacy_id;

    update public.accounts
    set
      balance = round(balance + p_amount, 2),
      available_balance = round(available_balance + p_amount, 2),
      last_activity_at = now(),
      updated_at = now()
    where id = v_account_id;
  else
    v_direction := 'outflow';
    v_source_table := 'expenses';

    insert into public.expenses (
      user_id, account_id, category_id, title, amount, currency, spent_at, payment_method, notes
    )
    values (
      v_user, v_account_id, v_category_id, p_title, round(p_amount, 2), coalesce(nullif(p_currency, ''), 'SAR'),
      coalesce(p_transaction_date, current_date), p_payment_method, p_notes
    )
    returning id into v_legacy_id;

    update public.accounts
    set
      balance = round(balance - p_amount, 2),
      available_balance = round(available_balance - p_amount, 2),
      last_activity_at = now(),
      updated_at = now()
    where id = v_account_id;
  end if;

  insert into public.financial_transactions (
    user_id, transaction_type, title, amount, currency, account_id, category_id,
    transaction_date, direction, source_table, source_id, idempotency_key, notes,
    metadata
  )
  values (
    v_user, p_transaction_type, p_title, round(p_amount, 2), coalesce(nullif(p_currency, ''), 'SAR'),
    v_account_id, v_category_id, coalesce(p_transaction_date, current_date), v_direction,
    v_source_table, v_legacy_id, p_idempotency_key, p_notes,
    jsonb_build_object('payment_method', p_payment_method, 'source', p_source)
  )
  returning id into v_transaction_id;

  insert into public.financial_audit_logs (
    user_id, action, target_table, target_id, amount, account_id, metadata
  )
  values (
    v_user, concat('create_', p_transaction_type), 'financial_transactions',
    v_transaction_id, round(p_amount, 2), v_account_id,
    jsonb_build_object('legacy_table', v_source_table, 'legacy_id', v_legacy_id)
  );

  return v_transaction_id;
end;
$$;

create or replace function public.create_account_transfer(
  p_source_account_id uuid,
  p_destination_account_id uuid,
  p_amount numeric,
  p_fee numeric default 0,
  p_currency text default 'SAR',
  p_transfer_at date default current_date,
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
  v_source_account uuid;
  v_destination_account uuid;
  v_transfer_id uuid;
  v_transaction_id uuid;
  v_fee numeric := coalesce(p_fee, 0);
begin
  if v_user is null then
    raise exception 'Authentication is required.';
  end if;

  if p_source_account_id = p_destination_account_id then
    raise exception 'Source and destination accounts must be different.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be greater than zero.';
  end if;

  if v_fee < 0 then
    raise exception 'Transfer fee cannot be negative.';
  end if;

  if p_idempotency_key is not null then
    select id into v_transfer_id
    from public.account_transfers
    where user_id = v_user
      and idempotency_key = p_idempotency_key
    limit 1;

    if v_transfer_id is not null then
      return v_transfer_id;
    end if;
  end if;

  select id into v_source_account
  from public.accounts
  where id = p_source_account_id
    and user_id = v_user
    and is_archived = false
  for update;

  select id into v_destination_account
  from public.accounts
  where id = p_destination_account_id
    and user_id = v_user
    and is_archived = false
  for update;

  if v_source_account is null or v_destination_account is null then
    raise exception 'One of the transfer accounts was not found or is archived.';
  end if;

  insert into public.account_transfers (
    user_id, source_account_id, destination_account_id, amount, fee, currency,
    transfer_at, idempotency_key, notes
  )
  values (
    v_user, v_source_account, v_destination_account, round(p_amount, 2), round(v_fee, 2),
    coalesce(nullif(p_currency, ''), 'SAR'), coalesce(p_transfer_at, current_date),
    p_idempotency_key, p_notes
  )
  returning id into v_transfer_id;

  update public.accounts
  set
    balance = round(balance - p_amount - v_fee, 2),
    available_balance = round(available_balance - p_amount - v_fee, 2),
    last_activity_at = now(),
    updated_at = now()
  where id = v_source_account;

  update public.accounts
  set
    balance = round(balance + p_amount, 2),
    available_balance = round(available_balance + p_amount, 2),
    last_activity_at = now(),
    updated_at = now()
  where id = v_destination_account;

  insert into public.financial_transactions (
    user_id, transaction_type, title, amount, currency, account_id,
    destination_account_id, transaction_date, direction, source_table, source_id,
    idempotency_key, notes, metadata
  )
  values (
    v_user, 'transfer', 'Account transfer', round(p_amount, 2), coalesce(nullif(p_currency, ''), 'SAR'),
    v_source_account, v_destination_account, coalesce(p_transfer_at, current_date),
    'neutral', 'account_transfers', v_transfer_id, p_idempotency_key, p_notes,
    jsonb_build_object('fee', round(v_fee, 2))
  )
  returning id into v_transaction_id;

  insert into public.financial_audit_logs (
    user_id, action, target_table, target_id, amount, account_id, metadata
  )
  values (
    v_user, 'create_transfer', 'account_transfers', v_transfer_id, round(p_amount, 2),
    v_source_account, jsonb_build_object('destination_account_id', v_destination_account, 'fee', round(v_fee, 2), 'transaction_id', v_transaction_id)
  );

  return v_transfer_id;
end;
$$;

grant all on public.financial_transactions to authenticated;
grant all on public.account_transfers to authenticated;
grant all on public.financial_audit_logs to authenticated;
grant execute on function public.create_financial_movement(text, text, numeric, text, uuid, uuid, date, text, text, text, text) to authenticated;
grant execute on function public.create_account_transfer(uuid, uuid, numeric, numeric, text, date, text, text) to authenticated;
