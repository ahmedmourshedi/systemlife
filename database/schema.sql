-- نظام حياتي الشخصي - مخطط قاعدة البيانات الكامل
-- شغل هذا الملف داخل Supabase SQL Editor مرة واحدة بعد إنشاء المشروع.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  timezone text default 'Asia/Riyadh',
  currency text default 'SAR',
  daily_calories numeric default 2200,
  daily_water_ml numeric default 2500,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.personal_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  focus_areas text[] not null default array['المال', 'الصحة', 'المهام'],
  show_health boolean not null default true,
  show_investments boolean not null default true,
  show_learning boolean not null default true,
  show_books boolean not null default true,
  show_relationships boolean not null default false,
  show_travel boolean not null default false,
  show_home boolean not null default true,
  setup_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text default 'عام',
  balance numeric not null default 0,
  currency text not null default 'SAR',
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null default 'expense',
  icon text,
  color text,
  monthly_limit numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name, type)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  amount numeric not null check (amount >= 0),
  currency text not null default 'SAR',
  spent_at date not null default current_date,
  payment_method text,
  notes text,
  receipt_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  amount numeric not null check (amount >= 0),
  currency text not null default 'SAR',
  received_at date not null default current_date,
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  month date not null,
  planned_amount numeric not null default 0,
  warning_percentage numeric not null default 80,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  name text not null,
  amount numeric not null default 0,
  currency text not null default 'SAR',
  cycle text not null default 'شهري',
  next_payment_at date,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  asset_name text not null,
  asset_type text not null default 'أخرى',
  symbol text,
  quantity numeric not null default 0,
  buy_price numeric not null default 0,
  current_price numeric not null default 0,
  amount_invested numeric not null default 0,
  current_value numeric not null default 0,
  currency text not null default 'SAR',
  risk_level text default 'متوسط',
  purchased_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  investment_id uuid not null references public.investments(id) on delete cascade,
  transaction_type text not null default 'شراء',
  quantity numeric not null default 0,
  price numeric not null default 0,
  fees numeric not null default 0,
  transaction_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_type text not null default 'وجبة',
  name text not null,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  quality text default 'جيد',
  meal_at timestamptz not null default now(),
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight numeric not null check (weight >= 0),
  body_fat numeric,
  logged_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, logged_at)
);

create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_ml numeric not null default 250,
  logged_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_type text not null,
  duration_minutes numeric not null default 0,
  calories numeric not null default 0,
  effort text default 'متوسط',
  workout_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hours numeric not null default 0,
  quality text default 'متوسط',
  slept_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slept_at)
);

create table if not exists public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calories numeric not null default 2200,
  protein numeric not null default 140,
  carbs numeric not null default 220,
  fat numeric not null default 70,
  water_ml numeric not null default 2500,
  starts_at date not null default current_date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  provider text,
  field text,
  status text not null default 'جاري',
  priority text default 'متوسطة',
  start_date date,
  target_end_date date,
  total_lessons numeric not null default 0,
  completed_lessons numeric not null default 0,
  certificate_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  status text not null default 'مكتمل',
  duration_minutes numeric not null default 0,
  completed_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text,
  field text,
  status text not null default 'للقراءة',
  priority text default 'متوسطة',
  total_pages numeric not null default 0,
  current_page numeric not null default 0,
  start_date date,
  target_end_date date,
  summary text,
  apply_notes text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reading_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  pages_read numeric not null default 0,
  minutes numeric not null default 0,
  read_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null default 'general',
  title text not null,
  body text,
  source_url text,
  tags text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  area text default 'شخصي',
  status text not null default 'جاري',
  priority text default 'متوسطة',
  start_date date,
  due_date date,
  target_value numeric not null default 100,
  current_value numeric not null default 0,
  unit text default '%',
  why text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  priority text default 'متوسطة',
  status text not null default 'جديدة',
  due_date date,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  frequency text not null default 'يومي',
  target_value numeric not null default 1,
  unit text default 'مرة',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  logged_at date not null default current_date,
  value numeric not null default 1,
  status text not null default 'تم',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, habit_id, logged_at)
);

create table if not exists public.monthly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month date not null,
  score numeric not null default 7,
  wins text,
  lessons text,
  next_actions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month)
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null,
  owner_table text,
  owner_id uuid,
  file_url text not null,
  file_name text,
  mime_type text,
  file_size numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'app_settings',
    'accounts',
    'categories',
    'expenses',
    'incomes',
    'budgets',
    'subscriptions',
    'investments',
    'investment_transactions',
    'meals',
    'weight_logs',
    'water_logs',
    'workouts',
    'sleep_logs',
    'nutrition_targets',
    'courses',
    'course_lessons',
    'books',
    'reading_logs',
    'notes',
    'goals',
    'tasks',
    'habits',
    'habit_logs',
    'monthly_reviews',
    'personal_preferences',
    'attachments'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;


create or replace function public.prevent_unauthorized_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and new.role <> 'user' and auth.uid() is not null and not public.is_admin() then
    new.role = 'user';
  end if;

  if tg_op = 'UPDATE' and old.role is distinct from new.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'لا يمكن تغيير الدور بدون صلاحية أدمن';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
before insert or update on public.profiles
for each row execute function public.prevent_unauthorized_role_change();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, timezone, currency)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'user',
    'Asia/Riyadh',
    'SAR'
  )
  on conflict (id) do nothing;

  insert into public.accounts (user_id, name, kind, currency)
  values
    (new.id, 'الحساب الرئيسي', 'عام', 'SAR'),
    (new.id, 'كاش', 'نقدي', 'SAR'),
    (new.id, 'محفظة الاستثمار', 'استثمار', 'SAR')
  on conflict (user_id, name) do nothing;

  insert into public.categories (user_id, name, type, icon)
  values
    (new.id, 'أكل', 'expense', '🥗'),
    (new.id, 'مواصلات', 'expense', '🚗'),
    (new.id, 'بيت', 'expense', '🏠'),
    (new.id, 'تعلم', 'expense', '🎓'),
    (new.id, 'صحة', 'expense', '💊'),
    (new.id, 'راتب', 'income', '💰'),
    (new.id, 'عمل حر', 'income', '💼'),
    (new.id, 'استثمار', 'income', '📈')
  on conflict (user_id, name, type) do nothing;

  insert into public.habits (user_id, title, frequency, target_value, unit)
  values
    (new.id, 'قراءة', 'يومي', 20, 'دقيقة'),
    (new.id, 'مشي', 'يومي', 6000, 'خطوة'),
    (new.id, 'مياه', 'يومي', 2500, 'مل'),
    (new.id, 'تعلم', 'يومي', 1, 'درس')
  on conflict do nothing;

  insert into public.personal_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.personal_preferences enable row level security;

drop policy if exists profiles_select_own_or_admin on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own_or_admin on public.profiles;

create policy profiles_select_own_or_admin
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = auth.uid() or public.is_admin());

create policy profiles_update_own_or_admin
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists app_settings_admin_all on public.app_settings;
create policy app_settings_admin_all
on public.app_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists personal_preferences_select_own on public.personal_preferences;
create policy personal_preferences_select_own
on public.personal_preferences
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists personal_preferences_insert_own on public.personal_preferences;
create policy personal_preferences_insert_own
on public.personal_preferences
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists personal_preferences_update_own on public.personal_preferences;
create policy personal_preferences_update_own
on public.personal_preferences
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'accounts',
    'categories',
    'expenses',
    'incomes',
    'budgets',
    'subscriptions',
    'investments',
    'investment_transactions',
    'meals',
    'weight_logs',
    'water_logs',
    'workouts',
    'sleep_logs',
    'nutrition_targets',
    'courses',
    'course_lessons',
    'books',
    'reading_logs',
    'notes',
    'goals',
    'tasks',
    'habits',
    'habit_logs',
    'monthly_reviews',
    'attachments'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists own_records_all on public.%I', table_name);
    execute format(
      'create policy own_records_all on public.%I for all to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin())',
      table_name
    );
  end loop;
end $$;

create index if not exists idx_expenses_user_date on public.expenses (user_id, spent_at desc);
create index if not exists idx_incomes_user_date on public.incomes (user_id, received_at desc);
create index if not exists idx_meals_user_date on public.meals (user_id, meal_at desc);
create index if not exists idx_tasks_user_status on public.tasks (user_id, status);
create index if not exists idx_goals_user_status on public.goals (user_id, status);
create index if not exists idx_courses_user_status on public.courses (user_id, status);
create index if not exists idx_books_user_status on public.books (user_id, status);
create index if not exists idx_habit_logs_user_date on public.habit_logs (user_id, logged_at desc);
create index if not exists idx_investments_user on public.investments (user_id);

insert into public.app_settings (key, value, description)
values (
  'app_info',
  '{"name":"نظام حياتي الشخصي","version":"1.0.0","language":"ar","direction":"rtl"}'::jsonb,
  'معلومات عامة عن التطبيق'
)
on conflict (key) do update
set value = excluded.value,
    description = excluded.description;

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant all on all routines in schema public to authenticated;

-- تخزين الملفات اختياري. يمكن تفعيله لاحقًا عند إضافة رفع الإيصالات والشهادات.
insert into storage.buckets (id, name, public)
values ('lifeos', 'lifeos', false)
on conflict (id) do nothing;

drop policy if exists storage_lifeos_select on storage.objects;
drop policy if exists storage_lifeos_insert on storage.objects;
drop policy if exists storage_lifeos_update on storage.objects;
drop policy if exists storage_lifeos_delete on storage.objects;

create policy storage_lifeos_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'lifeos'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);

create policy storage_lifeos_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'lifeos'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy storage_lifeos_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'lifeos'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
)
with check (
  bucket_id = 'lifeos'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);

create policy storage_lifeos_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'lifeos'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin()
  )
);
-- نظام حياتي الشخصي - توسعة Mega
-- شغل هذا الملف بعد schema.sql إذا كنت تملك نسخة قديمة من قاعدة البيانات.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.inbox_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  item_type text default 'ملاحظة',
  area text default 'شخصي',
  priority text default 'متوسطة',
  captured_at timestamptz default now(),
  source text,
  processing_status text default 'جديد',
  decision text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date date not null default current_date,
  day_name text,
  main_focus text not null,
  top_three text,
  energy_level text default 'متوسط',
  score numeric default 7,
  reflection text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, plan_date)
);

create table if not exists public.time_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  area text default 'عمل',
  start_at timestamptz not null default now(),
  end_at timestamptz,
  planned_minutes numeric default 60,
  actual_minutes numeric default 0,
  focus_score numeric default 7,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  area text default 'شخصي',
  status text default 'جاري',
  priority text default 'متوسطة',
  start_date date,
  due_date date,
  progress numeric default 0,
  why text,
  success_criteria text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  status text default 'جاري',
  due_date date,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  title text not null,
  mood text default 'جيد',
  gratitude text,
  lessons text,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_at date not null default current_date,
  mood_score numeric default 7,
  energy_score numeric default 7,
  stress_score numeric default 3,
  sleep_quality text default 'جيدة',
  trigger text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  relationship_type text default 'عمل',
  email text,
  phone text,
  company text,
  last_contact_at date,
  next_follow_up_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  document_type text default 'أخرى',
  related_area text default 'شخصي',
  file_url text,
  expires_at date,
  tags text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  meal_type text default 'غداء',
  calories numeric default 0,
  protein numeric default 0,
  carbs numeric default 0,
  fat numeric default 0,
  prep_minutes numeric default 15,
  ingredients text,
  steps text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  planned_date date not null default current_date,
  meal_type text default 'غداء',
  meal_name text not null,
  target_calories numeric default 600,
  is_prepared text default 'لا',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grocery_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  category text default 'أخرى',
  quantity numeric default 1,
  unit text default 'قطعة',
  estimated_price numeric default 0,
  status text default 'مطلوب',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  party text,
  debt_type text default 'عليّ',
  total_amount numeric default 0,
  paid_amount numeric default 0,
  due_date date,
  status text default 'مفتوح',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asset_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  asset_type text default 'جهاز',
  purchase_date date,
  purchase_price numeric default 0,
  current_value numeric default 0,
  warranty_until date,
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  category text default 'مطبخ',
  quantity numeric default 1,
  min_quantity numeric default 1,
  unit text default 'قطعة',
  location text,
  expires_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saving_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_amount numeric default 0,
  current_amount numeric default 0,
  monthly_contribution numeric default 0,
  target_date date,
  priority text default 'متوسطة',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.career_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action_date date not null default current_date,
  title text not null,
  action_type text default 'تعلم',
  status text default 'جاري',
  impact_score numeric default 5,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text default 'تقنية',
  current_level numeric default 1,
  target_level numeric default 7,
  practice_plan text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  issuer text,
  field text,
  issued_at date,
  expires_at date,
  credential_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.relationships_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_name text not null,
  contact_at date not null default current_date,
  contact_type text default 'رسالة',
  quality_score numeric default 7,
  next_step text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.travel_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination text not null,
  purpose text default 'ترفيه',
  start_date date,
  end_date date,
  budget numeric default 0,
  status text default 'فكرة',
  checklist text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.idea_bank (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  area text default 'شخصي',
  potential_score numeric default 5,
  effort_score numeric default 5,
  status text default 'خام',
  description text,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.decision_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  decision_date date not null default current_date,
  title text not null,
  area text default 'شخصي',
  confidence_score numeric default 7,
  expected_outcome text,
  alternatives text,
  review_date date,
  actual_outcome text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rituals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  ritual_type text default 'صباحي',
  trigger text,
  duration_minutes numeric default 15,
  steps text,
  is_active text default 'نعم',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  score numeric default 7,
  wins text,
  problems text,
  lessons text,
  next_week_focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start)
);

create table if not exists public.quarterly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quarter_start date not null,
  score numeric default 7,
  wins text,
  lessons text,
  next_quarter_focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, quarter_start)
);

create table if not exists public.yearly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  year_number integer not null,
  score numeric default 7,
  theme text,
  wins text,
  lessons text,
  next_year_goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, year_number)
);

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_name text not null,
  target_table text not null,
  source_format text default 'CSV',
  status text default 'مخطط',
  rows_count numeric default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.export_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_name text not null,
  export_format text default 'JSON',
  status text default 'مخطط',
  file_url text,
  rows_count numeric default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  module text not null,
  trigger_type text default 'تاريخ',
  condition_text text,
  action_text text,
  is_active text default 'نعم',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  channel text default 'داخل التطبيق',
  frequency text default 'مرة',
  next_run_at timestamptz,
  is_active text default 'نعم',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  target_table text,
  target_id text,
  severity text default 'متوسطة',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.system_modules (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  owner_area text,
  status text default 'نشطة',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.data_quality_checks (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  check_name text not null,
  target_table text not null,
  severity text default 'متوسطة',
  status text default 'مفتوح',
  finding text,
  fix_suggestion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.module_templates (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  template_type text default 'مراجعة',
  target_module text,
  content text,
  is_active text default 'نعم',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.backup_jobs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  job_name text not null,
  backup_type text default 'يدوي',
  status text default 'مخطط',
  file_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  event_type text default 'ملاحظة أمنية',
  severity text default 'متوسطة',
  actor_email text,
  description text,
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.system_announcements (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  audience text default 'الجميع',
  status text default 'مسودة',
  published_at timestamptz,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'inbox_items',
    'daily_plans',
    'time_blocks',
    'projects',
    'project_milestones',
    'journal_entries',
    'mood_logs',
    'people',
    'documents',
    'recipes',
    'meal_plans',
    'grocery_items',
    'debts',
    'asset_items',
    'home_inventory',
    'saving_goals',
    'career_actions',
    'skills',
    'certificates',
    'relationships_logs',
    'travel_plans',
    'idea_bank',
    'decision_logs',
    'rituals',
    'weekly_reviews',
    'quarterly_reviews',
    'yearly_reviews',
    'import_jobs',
    'export_jobs',
    'automation_rules',
    'notification_rules'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists own_records_all on public.%I', table_name);
    execute format('create policy own_records_all on public.%I for all to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin())', table_name);
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end $$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'admin_audit_logs',
    'system_modules',
    'data_quality_checks',
    'module_templates',
    'backup_jobs',
    'security_events',
    'system_announcements'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists admin_records_all on public.%I', table_name);
    execute format('create policy admin_records_all on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', table_name);
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end $$;

create index if not exists idx_inbox_items_user_status on public.inbox_items (user_id, processing_status, captured_at desc);
create index if not exists idx_daily_plans_user_date on public.daily_plans (user_id, plan_date desc);
create index if not exists idx_time_blocks_user_start on public.time_blocks (user_id, start_at desc);
create index if not exists idx_projects_user_status on public.projects (user_id, status);
create index if not exists idx_journal_entries_user_date on public.journal_entries (user_id, entry_date desc);
create index if not exists idx_mood_logs_user_date on public.mood_logs (user_id, logged_at desc);
create index if not exists idx_people_user_followup on public.people (user_id, next_follow_up_at);
create index if not exists idx_documents_user_expires on public.documents (user_id, expires_at);
create index if not exists idx_grocery_items_user_status on public.grocery_items (user_id, status);
create index if not exists idx_debts_user_due on public.debts (user_id, due_date, status);
create index if not exists idx_saving_goals_user_target on public.saving_goals (user_id, target_date);
create index if not exists idx_skills_user_category on public.skills (user_id, category);
create index if not exists idx_notifications_user_next on public.notification_rules (user_id, next_run_at);

insert into public.app_settings (key, value, description)
values (
  'mega_release',
  '{"name":"نظام حياتي الشخصي Mega","version":"2.0.0","modules":60,"language":"ar","direction":"rtl"}'::jsonb,
  'بيانات إصدار نسخة Mega'
)
on conflict (key) do update
set value = excluded.value,
    description = excluded.description,
    updated_at = now();

insert into public.system_modules (name, slug, owner_area, status, description)
values
  ('الالتقاط السريع', 'capture', 'إنتاجية', 'نشطة', 'صندوق موحد لتسجيل أي شيء بسرعة.'),
  ('مخطط اليوم', 'planner', 'إنتاجية', 'نشطة', 'خطة يومية ومراجعة مسائية.'),
  ('إدارة الوقت', 'time', 'إنتاجية', 'نشطة', 'كتل وقت ومقارنة المخطط بالمنفذ.'),
  ('المشاريع الشخصية', 'projects', 'إنتاجية', 'نشطة', 'إدارة المبادرات الكبيرة.'),
  ('الديون والالتزامات', 'debts', 'مال', 'نشطة', 'متابعة المديونيات والأقساط.'),
  ('أهداف الادخار', 'savings', 'مال', 'نشطة', 'أهداف مالية ومساهمات شهرية.'),
  ('الوصفات الصحية', 'recipes', 'صحة', 'نشطة', 'مكتبة وصفات محسوبة الماكروز.'),
  ('خطة الوجبات', 'meal-plan', 'صحة', 'نشطة', 'تخطيط الوجبات الأسبوعية.'),
  ('خريطة المهارات', 'skills', 'تعلم', 'نشطة', 'تقييم المهارات وربطها بالتطبيق العملي.'),
  ('سجل القرارات', 'decisions', 'تفكير', 'نشطة', 'توثيق القرارات ومراجعتها لاحقًا.'),
  ('سجل التدقيق', 'admin-audit', 'إدارة', 'نشطة', 'سجل عمليات إدارية حساسة.'),
  ('جودة البيانات', 'data-quality', 'إدارة', 'نشطة', 'فحوصات البيانات قبل التقارير.')
on conflict (slug) do update
set name = excluded.name,
    owner_area = excluded.owner_area,
    status = excluded.status,
    description = excluded.description,
    updated_at = now();

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant all on all routines in schema public to authenticated;
