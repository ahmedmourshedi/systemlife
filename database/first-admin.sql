-- إعداد الحساب الشخصي كأدمن بعد إنشائه من صفحة التسجيل أو Supabase Auth.
-- الحساب المقترح:
-- admin@lifeos-demo.com / LifeOS@123456

update public.profiles
set
  role = 'admin',
  full_name = coalesce(nullif(full_name, ''), 'حسابي الشخصي'),
  timezone = 'Asia/Riyadh',
  currency = 'SAR',
  updated_at = now()
where email = 'admin@lifeos-demo.com';

select id, email, full_name, role, created_at
from public.profiles
where email = 'admin@lifeos-demo.com';
