-- إنشاء حساب شخصي تجريبي داخل Supabase Auth للتطوير فقط.
-- شغل هذا الملف من Supabase SQL Editor بعد database/schema.sql.
--
-- بيانات الدخول:
-- admin@lifeos-demo.com / LifeOS@123456

create extension if not exists pgcrypto;

do $$
declare
  v_admin_id uuid := '11111111-1111-4111-8111-111111111111';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    v_admin_id,
    'authenticated',
    'authenticated',
    'admin@lifeos-demo.com',
    crypt('LifeOS@123456', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"حسابي الشخصي"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  on conflict (id) do update set
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = now(),
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

  insert into auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    v_admin_id::text,
    v_admin_id,
    jsonb_build_object(
      'sub', v_admin_id::text,
      'email', 'admin@lifeos-demo.com',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  )
  on conflict (provider, provider_id) do update set
    identity_data = excluded.identity_data,
    updated_at = now();

  insert into public.profiles (id, email, full_name, role, timezone, currency)
  values (v_admin_id, 'admin@lifeos-demo.com', 'حسابي الشخصي', 'admin', 'Asia/Riyadh', 'SAR')
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    timezone = excluded.timezone,
    currency = excluded.currency,
    updated_at = now();
end $$;

select id, email, full_name, role
from public.profiles
where email = 'admin@lifeos-demo.com';
