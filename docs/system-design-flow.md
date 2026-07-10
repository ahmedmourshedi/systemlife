# System Design and Flow Charts

هذا الملف يشرح مشروع Life OS Mega من زاوية هندسية: ما هي الطبقات، كيف تنتقل البيانات، أين تتم الحماية، وكيف تعمل أهم التدفقات داخل التطبيق.

## 1. فكرة النظام

Life OS Mega هو تطبيق ويب عربي PWA لإدارة الحياة الشخصية. في النسخة الحالية مضبوط للاستخدام الشخصي بحساب واحد فقط. صلاحية `admin` تستخدم داخليًا لفتح صفحات صيانة النظام، وليست لإدارة موظفين.

النظام يتكون من:

- واجهة Next.js App Router داخل `app/`
- مكونات UI مشتركة داخل `components/`
- منطق قراءة البيانات داخل `lib/data.ts` و `lib/mega/data.ts`
- منطق الكتابة والتعديل داخل `app/actions.ts`
- Supabase Auth للمصادقة
- Supabase Postgres لتخزين البيانات
- Row Level Security لعزل البيانات حسب المستخدم
- PWA Manifest وService Worker للتثبيت والعمل الأساسي بدون اتصال

## 2. High Level Architecture

```mermaid
flowchart TB
  User["المستخدم / المتصفح"] --> NextApp["Next.js App Router"]
  NextApp --> Pages["صفحات app/ و admin/"]
  NextApp --> Components["components/ UI"]

  Pages --> ServerComponents["Server Components"]
  Pages --> ServerActions["Server Actions: app/actions.ts"]

  ServerComponents --> DataLayer["Data Layer: lib/data.ts + lib/mega/data.ts"]
  ServerActions --> SupabaseServer["Supabase Server Client"]
  DataLayer --> SupabaseServer

  SupabaseServer --> Auth["Supabase Auth"]
  SupabaseServer --> DB["Supabase Postgres"]

  DB --> RLS["Row Level Security Policies"]
  RLS --> UserTables["User Tables: expenses, tasks, goals, etc."]
  RLS --> AdminTables["Admin Tables: audit, modules, security, etc."]

  NextApp --> PWA["PWA: manifest.ts + public/sw.js"]
```

## 3. أهم الملفات ومسؤولية كل طبقة

| الطبقة | الملفات | المسؤولية |
|---|---|---|
| Routing | `app/` | صفحات الدخول، التطبيق، الأدمن، API routes |
| Layout | `app/app/layout.tsx`, `app/admin/layout.tsx` | حماية الصفحات وتغليفها بـ AppShell |
| UI | `components/` | القوائم، البطاقات، النماذج، الأيقونات |
| Generic Modules | `lib/mega/module-registry.ts`, `components/mega/module-page.tsx` | تعريف الوحدات وتوليد صفحة CRUD عامة |
| Reads | `lib/data.ts`, `lib/mega/data.ts` | جلب بيانات الداشبورد والوحدات |
| Writes | `app/actions.ts` | تسجيل الدخول، إنشاء السجلات، حذفها، تحديث الملف الشخصي |
| Auth Session | `proxy.ts`, `lib/supabase/session.ts` | تحديث جلسة Supabase وحماية المسارات |
| Supabase Client | `lib/supabase/server.ts`, `client.ts`, `config.ts` | إنشاء عميل Supabase للـ server/client |
| Database | `database/schema.sql`, `database/mega-extension.sql` | الجداول، العلاقات، triggers، RLS |
| Seed | `database/create-demo-auth-users.sql`, `realistic-demo-seed.sql` | إنشاء حساب وتجهيز بيانات Demo |

## 4. Authentication Flow

```mermaid
sequenceDiagram
  participant U as User
  participant Login as /login
  participant Action as signInAction
  participant SB as Supabase Auth
  participant Cookie as Browser Cookies
  participant App as /app

  U->>Login: يدخل البريد وكلمة المرور
  Login->>Action: Submit Form
  Action->>SB: signInWithPassword(email, password)
  SB-->>Action: session + user
  Action-->>Cookie: حفظ جلسة Supabase
  Action-->>App: redirect('/app')
```

## 5. Route Protection Flow

`proxy.ts` يستدعي `updateSession()` من `lib/supabase/session.ts`.

```mermaid
flowchart TD
  Request["Request لأي صفحة"] --> Middleware["proxy.ts / updateSession"]
  Middleware --> CheckUser["supabase.auth.getUser()"]
  CheckUser --> HasUser{"هل يوجد User؟"}

  HasUser -- "لا" --> Protected{"المسار /app أو /admin؟"}
  Protected -- "نعم" --> Login["Redirect إلى /login?next=..."]
  Protected -- "لا" --> Continue["اكمل الطلب"]

  HasUser -- "نعم" --> AuthPage{"هل المسار /login أو /register؟"}
  AuthPage -- "نعم" --> App["Redirect إلى /app"]
  AuthPage -- "لا" --> Continue
```

## 6. App Page Load Flow

عند فتح `/app` أو أي صفحة داخل التطبيق:

```mermaid
sequenceDiagram
  participant U as User
  participant Layout as app/app/layout.tsx
  participant Data as getCurrentUserProfile()
  participant DB as Supabase DB
  participant Shell as AppShell
  participant Page as Page Component

  U->>Layout: فتح /app
  Layout->>Data: getCurrentUserProfile()
  Data->>DB: قراءة auth user + profiles
  alt لا يوجد user
    Layout-->>U: Redirect /login
  else يوجد user
    Data-->>Layout: user + profile
    Layout->>Shell: تمرير profile
    Shell->>Page: عرض الصفحة والقائمة حسب role
  end
```

## 7. Dashboard Data Flow

الداشبورد يقرأ عدة جداول بالتوازي ثم يحسب الملخص.

```mermaid
flowchart LR
  Dashboard["/app/page.tsx"] --> GetData["getDashboardData()"]
  GetData --> Expenses["expenses"]
  GetData --> Incomes["incomes"]
  GetData --> Meals["meals"]
  GetData --> Water["water_logs"]
  GetData --> Tasks["tasks"]
  GetData --> Goals["goals"]
  GetData --> Investments["investments"]

  Expenses --> Summary["DashboardSummary"]
  Incomes --> Summary
  Meals --> Summary
  Water --> Summary
  Tasks --> Summary
  Goals --> Summary
  Investments --> Summary

  Summary --> UI["Stat Cards + Recent Lists"]
```

## 8. Generic Module Flow

معظم صفحات الوحدات المتقدمة تعمل بنفس القالب:

- تعريف الوحدة في `lib/mega/module-registry.ts`
- صفحة الوحدة تستدعي `MegaModulePage`
- `MegaModulePage` يقرأ config ويولد النموذج والقائمة
- الإضافة تتم عبر `createGenericRecordAction`
- الحذف يتم عبر `deleteGenericRecordAction`

```mermaid
flowchart TD
  Route["مثال: /app/skills"] --> Page["app/app/skills/page.tsx"]
  Page --> MegaPage["MegaModulePage(moduleKey='skills')"]
  MegaPage --> Registry["getModuleConfig()"]
  Registry --> Config["table, fields, listFields, ownership"]
  MegaPage --> Records["getModuleRecords(moduleKey)"]
  Records --> DB["Supabase Table"]
  Config --> Form["Generated Form"]
  Config --> List["Generated Record List"]
  Form --> Action["createGenericRecordAction"]
  Action --> DB
```

## 9. Create Record Flow

```mermaid
sequenceDiagram
  participant U as User
  participant Form as Module Form
  participant Action as createGenericRecordAction
  participant Registry as Module Registry
  participant Auth as requireUser/requireAdmin
  participant DB as Supabase DB
  participant Next as Next Cache

  U->>Form: يملأ النموذج
  Form->>Action: POST FormData
  Action->>Registry: getModuleConfig(module_key)
  Action->>Auth: تحقق من الصلاحية حسب ownership
  Auth-->>Action: user أو admin
  Action->>DB: insert في table المحدد
  DB-->>Action: success
  Action->>Next: revalidatePath()
  Action-->>U: Redirect أو تحديث الصفحة
```

## 10. Personal System Management Flow

إدارة النظام ليست تطبيقًا منفصلًا. هي نفس النظام لكن الصفحات تحت `/admin` تحتاج `profile.role = admin`. في الاستخدام الشخصي هذا يعني أن حسابك الواحد يستطيع فتح صفحات الصيانة مثل الأمان والنسخ وجودة البيانات.

```mermaid
flowchart TD
  AdminRoute["/admin/*"] --> AdminLayout["app/admin/layout.tsx"]
  AdminLayout --> Profile["getCurrentUserProfile()"]
  Profile --> Role{"profile.role == admin?"}
  Role -- "لا" --> AppRedirect["Redirect /app"]
  Role -- "نعم" --> AdminPages["Admin Pages"]
  AdminPages --> AdminData["getAdminData() أو Mega admin modules"]
  AdminData --> AdminTables["admin_audit_logs, system_modules, security_events..."]
```

## 11. Database Design

### Core User Tables

كل جدول شخصي تقريبًا يحتوي:

- `id`
- `user_id`
- حقول خاصة بالموديول
- `created_at`
- `updated_at`

أمثلة:

- المال: `accounts`, `categories`, `expenses`, `incomes`, `budgets`, `subscriptions`
- الصحة: `meals`, `weight_logs`, `water_logs`, `workouts`, `sleep_logs`
- التعلم: `courses`, `course_lessons`, `books`, `reading_logs`, `skills`
- الإنتاجية: `tasks`, `goals`, `habits`, `daily_plans`, `time_blocks`
- الحياة الشخصية: `journal_entries`, `people`, `travel_plans`, `documents`, `idea_bank`

### Admin Tables

جداول إدارية لا تعتمد على `user_id` غالبًا، وتتحكم بها سياسة `public.is_admin()`:

- `admin_audit_logs`
- `system_modules`
- `data_quality_checks`
- `module_templates`
- `backup_jobs`
- `security_events`
- `system_announcements`

## 12. RLS Security Model

```mermaid
flowchart TD
  Query["Query من التطبيق"] --> AuthUID["auth.uid()"]
  Query --> IsAdmin["public.is_admin()"]
  AuthUID --> UserPolicy{"user_id = auth.uid()?"}
  IsAdmin --> AdminPolicy{"role = admin?"}

  UserPolicy -- "نعم" --> Allow["Allow"]
  AdminPolicy -- "نعم" --> Allow
  UserPolicy -- "لا" --> DenyCheck["تحقق من admin"]
  DenyCheck --> AdminPolicy
  AdminPolicy -- "لا" --> Deny["Deny"]
```

قاعدة الجداول الشخصية:

```sql
user_id = auth.uid() or public.is_admin()
```

قاعدة الجداول الإدارية:

```sql
public.is_admin()
```

## 13. PWA Flow

```mermaid
flowchart TD
  Browser["Browser"] --> Manifest["app/manifest.ts"]
  Browser --> SWRegister["components/register-service-worker.tsx"]
  SWRegister --> ServiceWorker["public/sw.js"]
  ServiceWorker --> Cache["Cache static assets"]
  Browser --> Offline["app/offline/page.tsx"]
```

## 14. Data Seeding Flow

للاستخدام الشخصي الحالي:

```mermaid
flowchart TD
  Schema["database/schema.sql"] --> Mega["database/mega-extension.sql"]
  Mega --> DemoUser["database/create-demo-auth-users.sql"]
  DemoUser --> Profile["admin@lifeos-demo.com / role=admin"]
  Profile --> Realistic["database/realistic-demo-seed.sql"]
  Realistic --> UserData["بيانات واقعية على نفس حساب الأدمن الشخصي"]
```

## 15. Mental Model سريع

فكر في النظام بهذا الشكل:

1. المستخدم يدخل من `/login`
2. Supabase Auth يحفظ الجلسة في cookies
3. `proxy.ts` يحمي المسارات
4. صفحات `/app` تقرأ `profile`
5. كل صفحة تقرأ بياناتها من Supabase
6. كل نموذج يرسل إلى Server Action
7. Server Action يتحقق من المستخدم ثم يكتب في قاعدة البيانات
8. RLS في Supabase هو خط الدفاع الأخير
9. حسابك الشخصي يرى صفحات الصيانة لأن `profile.role = admin`

## 16. أهم قرار تصميمي

المشروع ليس CRUD صفحات منفصلة فقط. الجزء الأهم هو `module-registry`:

- يعرّف الجدول
- يعرّف الحقول
- يعرّف طريقة العرض
- يحدد هل الوحدة للمستخدم أم للأدمن

لذلك إضافة وحدة جديدة غالبًا تحتاج:

1. إنشاء جدول في SQL
2. إضافة config في `lib/mega/module-registry.ts`
3. إضافة route بسيط يستدعي `MegaModulePage`
4. إضافة رابط في navigation إذا لزم
