-- Personal single-user setup preferences.
-- Run this once in Supabase SQL Editor after database/schema.sql.

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

alter table public.personal_preferences enable row level security;

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

drop trigger if exists set_updated_at_personal_preferences on public.personal_preferences;
create trigger set_updated_at_personal_preferences
before update on public.personal_preferences
for each row execute function public.set_updated_at();
