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
