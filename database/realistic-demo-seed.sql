-- بيانات Demo واقعية لنظام حياتي الشخصي
-- شغل هذا الملف بعد database/schema.sql وبعد إنشاء الحساب الشخصي.
-- الملف يضيف البيانات الواقعية لحسابك الشخصي:
-- admin@lifeos-demo.com
-- يمكن تشغيله أكثر من مرة؛ سيحذف بيانات Demo القديمة التي تحتوي على [DEMO] ثم يعيد إنشاءها.

do $$
declare
  v_user uuid;
  v_cash uuid;
  v_bank uuid;
  v_stc uuid;
  v_invest_wallet uuid;
  v_cat_food uuid;
  v_cat_transport uuid;
  v_cat_home uuid;
  v_cat_learning uuid;
  v_cat_health uuid;
  v_cat_subs uuid;
  v_cat_salary uuid;
  v_cat_freelance uuid;
  v_cat_invest_income uuid;
  v_goal_health uuid;
  v_goal_learning uuid;
  v_goal_money uuid;
  v_course_k6 uuid;
  v_course_appsheet uuid;
  v_book_explore uuid;
  v_book_lessons uuid;
  v_habit_reading uuid;
  v_habit_water uuid;
  v_habit_walk uuid;
  v_project_lifeos uuid;
  v_invest_sukuk uuid;
  v_invest_index uuid;
begin
  select id into v_user
  from public.profiles
  where email = 'admin@lifeos-demo.com'
  limit 1;

  if v_user is null then
    raise exception 'لا يوجد حساب شخصي بالبريد admin@lifeos-demo.com داخل public.profiles. شغل database/create-demo-auth-users.sql أولًا، ثم أعد تشغيل هذا الملف.';
  end if;

  update public.profiles
  set
    full_name = coalesce(full_name, 'أحمد الشاذلي'),
    timezone = 'Asia/Riyadh',
    currency = 'SAR',
    daily_calories = 2200,
    daily_water_ml = 2600,
    updated_at = now()
  where id = v_user;

  -- تنظيف Demo سابق فقط بدون لمس بياناتك الحقيقية.
  delete from public.investment_transactions where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.course_lessons where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.reading_logs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.habit_logs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.project_milestones where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.expenses where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.incomes where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.budgets where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.subscriptions where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.investments where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.meals where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.weight_logs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.water_logs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.workouts where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.sleep_logs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.nutrition_targets where user_id = v_user and starts_at = current_date - 14 and calories = 2200 and protein = 150 and water_ml = 2600;
  delete from public.courses where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.books where user_id = v_user and coalesce(summary, '') like '%[DEMO]%';
  delete from public.notes where user_id = v_user and coalesce(body, '') like '%[DEMO]%';
  delete from public.tasks where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.goals where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.habits where user_id = v_user and title in ('قراءة 20 دقيقة', 'مياه 2.6 لتر', 'مشي 6000 خطوة');
  delete from public.monthly_reviews where user_id = v_user and coalesce(lessons, '') like '%[DEMO]%';
  delete from public.inbox_items where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.daily_plans where user_id = v_user and coalesce(reflection, '') like '%[DEMO]%';
  delete from public.time_blocks where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.projects where user_id = v_user and coalesce(why, '') like '%[DEMO]%';
  delete from public.journal_entries where user_id = v_user and coalesce(content, '') like '%[DEMO]%';
  delete from public.mood_logs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.people where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.documents where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.recipes where user_id = v_user and coalesce(steps, '') like '%[DEMO]%';
  delete from public.meal_plans where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.grocery_items where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.debts where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.asset_items where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.home_inventory where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.saving_goals where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.career_actions where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.skills where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.certificates where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.relationships_logs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.travel_plans where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.idea_bank where user_id = v_user and coalesce(description, '') like '%[DEMO]%';
  delete from public.decision_logs where user_id = v_user and coalesce(expected_outcome, '') like '%[DEMO]%';
  delete from public.rituals where user_id = v_user and coalesce(steps, '') like '%[DEMO]%';
  delete from public.weekly_reviews where user_id = v_user and coalesce(lessons, '') like '%[DEMO]%';
  delete from public.quarterly_reviews where user_id = v_user and coalesce(lessons, '') like '%[DEMO]%';
  delete from public.yearly_reviews where user_id = v_user and coalesce(lessons, '') like '%[DEMO]%';
  delete from public.import_jobs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.export_jobs where user_id = v_user and coalesce(notes, '') like '%[DEMO]%';
  delete from public.automation_rules where user_id = v_user and coalesce(condition_text, '') like '%[DEMO]%';
  delete from public.notification_rules where user_id = v_user and coalesce(message, '') like '%[DEMO]%';

  insert into public.accounts (user_id, name, kind, balance, currency)
  values (v_user, 'الحساب الرئيسي', 'بنك', 18450, 'SAR')
  on conflict (user_id, name) do update set kind = excluded.kind, balance = excluded.balance, currency = excluded.currency, updated_at = now()
  returning id into v_bank;

  insert into public.accounts (user_id, name, kind, balance, currency)
  values (v_user, 'كاش', 'نقدي', 620, 'SAR')
  on conflict (user_id, name) do update set kind = excluded.kind, balance = excluded.balance, currency = excluded.currency, updated_at = now()
  returning id into v_cash;

  insert into public.accounts (user_id, name, kind, balance, currency)
  values (v_user, 'STC Pay', 'محفظة رقمية', 1320, 'SAR')
  on conflict (user_id, name) do update set kind = excluded.kind, balance = excluded.balance, currency = excluded.currency, updated_at = now()
  returning id into v_stc;

  insert into public.accounts (user_id, name, kind, balance, currency)
  values (v_user, 'محفظة الاستثمار', 'استثمار', 34750, 'SAR')
  on conflict (user_id, name) do update set kind = excluded.kind, balance = excluded.balance, currency = excluded.currency, updated_at = now()
  returning id into v_invest_wallet;

  insert into public.categories (user_id, name, type, icon, color, monthly_limit)
  values (v_user, 'أكل', 'expense', 'salad', '#0f766e', 1600)
  on conflict (user_id, name, type) do update set monthly_limit = excluded.monthly_limit, icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_food;

  insert into public.categories (user_id, name, type, icon, color, monthly_limit)
  values (v_user, 'مواصلات', 'expense', 'car', '#2563eb', 900)
  on conflict (user_id, name, type) do update set monthly_limit = excluded.monthly_limit, icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_transport;

  insert into public.categories (user_id, name, type, icon, color, monthly_limit)
  values (v_user, 'بيت', 'expense', 'home', '#7c3aed', 2200)
  on conflict (user_id, name, type) do update set monthly_limit = excluded.monthly_limit, icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_home;

  insert into public.categories (user_id, name, type, icon, color, monthly_limit)
  values (v_user, 'تعلم', 'expense', 'graduation', '#d97706', 700)
  on conflict (user_id, name, type) do update set monthly_limit = excluded.monthly_limit, icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_learning;

  insert into public.categories (user_id, name, type, icon, color, monthly_limit)
  values (v_user, 'صحة', 'expense', 'heart', '#e11d48', 800)
  on conflict (user_id, name, type) do update set monthly_limit = excluded.monthly_limit, icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_health;

  insert into public.categories (user_id, name, type, icon, color, monthly_limit)
  values (v_user, 'اشتراكات', 'expense', 'receipt', '#475569', 420)
  on conflict (user_id, name, type) do update set monthly_limit = excluded.monthly_limit, icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_subs;

  insert into public.categories (user_id, name, type, icon, color)
  values (v_user, 'راتب', 'income', 'coins', '#059669')
  on conflict (user_id, name, type) do update set icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_salary;

  insert into public.categories (user_id, name, type, icon, color)
  values (v_user, 'عمل حر', 'income', 'briefcase', '#2563eb')
  on conflict (user_id, name, type) do update set icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_freelance;

  insert into public.categories (user_id, name, type, icon, color)
  values (v_user, 'عوائد استثمار', 'income', 'trend', '#7c3aed')
  on conflict (user_id, name, type) do update set icon = excluded.icon, color = excluded.color, updated_at = now()
  returning id into v_cat_invest_income;

  insert into public.incomes (user_id, account_id, category_id, title, amount, currency, received_at, source, notes)
  values
    (v_user, v_bank, v_cat_salary, 'راتب الشهر', 14500, 'SAR', date_trunc('month', current_date)::date + 1, 'الشركة', '[DEMO] دخل شهري ثابت'),
    (v_user, v_bank, v_cat_freelance, 'مراجعة اختبار أداء لمشروع خارجي', 2400, 'SAR', current_date - 6, 'عميل مستقل', '[DEMO] دخل عمل حر'),
    (v_user, v_invest_wallet, v_cat_invest_income, 'توزيع أرباح صندوق', 318.5, 'SAR', current_date - 10, 'محفظة الاستثمار', '[DEMO] دخل استثمار');

  insert into public.expenses (user_id, account_id, category_id, title, amount, currency, spent_at, payment_method, notes)
  values
    (v_user, v_stc, v_cat_food, 'قهوة صباحية', 14, 'SAR', current_date, 'Apple Pay', '[DEMO] مصروف سريع من الجوال'),
    (v_user, v_bank, v_cat_food, 'غداء عمل', 46, 'SAR', current_date, 'بطاقة', '[DEMO] وجبة خارجية'),
    (v_user, v_cash, v_cat_transport, 'مواقف', 8, 'SAR', current_date, 'كاش', '[DEMO] تنقل يومي'),
    (v_user, v_bank, v_cat_home, 'مشتريات منزلية', 186.75, 'SAR', current_date - 1, 'بطاقة', '[DEMO] سوبرماركت'),
    (v_user, v_stc, v_cat_transport, 'بنزين', 92, 'SAR', current_date - 2, 'Apple Pay', '[DEMO] تعبئة سيارة'),
    (v_user, v_bank, v_cat_learning, 'كورس اختبار أداء', 179, 'SAR', current_date - 3, 'بطاقة', '[DEMO] استثمار في التعلم'),
    (v_user, v_bank, v_cat_health, 'اشتراك نادي', 260, 'SAR', current_date - 4, 'بطاقة', '[DEMO] صحة ولياقة'),
    (v_user, v_bank, v_cat_subs, 'اشتراك أدوات إنتاجية', 49, 'SAR', current_date - 5, 'بطاقة', '[DEMO] اشتراك شهري'),
    (v_user, v_cash, v_cat_food, 'سناك صحي', 22, 'SAR', current_date - 6, 'كاش', '[DEMO] وجبة خفيفة'),
    (v_user, v_bank, v_cat_home, 'فاتورة كهرباء', 312.4, 'SAR', current_date - 8, 'تحويل', '[DEMO] فاتورة منزلية'),
    (v_user, v_stc, v_cat_transport, 'أجرة تطبيق توصيل', 37, 'SAR', current_date - 9, 'Apple Pay', '[DEMO] تنقل'),
    (v_user, v_bank, v_cat_food, 'عشاء عائلي', 138, 'SAR', current_date - 11, 'بطاقة', '[DEMO] مناسبة عائلية');

  insert into public.budgets (user_id, category_id, month, planned_amount, warning_percentage, notes)
  values
    (v_user, v_cat_food, date_trunc('month', current_date)::date, 1600, 80, '[DEMO] ميزانية أكل شهرية'),
    (v_user, v_cat_transport, date_trunc('month', current_date)::date, 900, 75, '[DEMO] ميزانية مواصلات'),
    (v_user, v_cat_learning, date_trunc('month', current_date)::date, 700, 85, '[DEMO] ميزانية تعلم')
  on conflict (user_id, category_id, month) do update set planned_amount = excluded.planned_amount, warning_percentage = excluded.warning_percentage, notes = excluded.notes, updated_at = now();

  insert into public.subscriptions (user_id, account_id, name, amount, currency, cycle, next_payment_at, is_active, notes)
  values
    (v_user, v_bank, 'Notion / Productivity', 38, 'SAR', 'شهري', current_date + 6, true, '[DEMO] اشتراك إنتاجية'),
    (v_user, v_bank, 'منصة كورسات', 59, 'SAR', 'شهري', current_date + 12, true, '[DEMO] اشتراك تعلم'),
    (v_user, v_stc, 'تخزين سحابي', 11, 'SAR', 'شهري', current_date + 18, true, '[DEMO] اشتراك ملفات');

  insert into public.nutrition_targets (user_id, calories, protein, carbs, fat, water_ml, starts_at, is_active)
  values (v_user, 2200, 150, 220, 70, 2600, current_date - 14, true);

  insert into public.meals (user_id, meal_type, name, calories, protein, carbs, fat, quality, meal_at, notes)
  values
    (v_user, 'فطور', 'بيضتين مع خبز بر وشاي', 430, 28, 42, 16, 'جيد', now() - interval '6 hours', '[DEMO] وجبة متوازنة'),
    (v_user, 'غداء', 'دجاج مشوي مع رز وسلطة', 720, 52, 82, 18, 'ممتاز', now() - interval '2 hours', '[DEMO] وجبة عالية البروتين'),
    (v_user, 'سناك', 'زبادي يوناني وتوت', 210, 18, 22, 4, 'ممتاز', now() - interval '1 hours', '[DEMO] سناك صحي'),
    (v_user, 'عشاء', 'تونة وخضار', 360, 38, 18, 12, 'جيد', now() - interval '1 day', '[DEMO] عشاء خفيف'),
    (v_user, 'غداء', 'لحم مشوي وبطاطس', 810, 48, 65, 35, 'متوسط', now() - interval '2 days', '[DEMO] سعرات أعلى من المعتاد');

  insert into public.weight_logs (user_id, weight, body_fat, logged_at, notes)
  values
    (v_user, 86.4, 24.5, current_date - 14, '[DEMO] بداية المتابعة'),
    (v_user, 85.9, 24.2, current_date - 7, '[DEMO] تحسن بسيط'),
    (v_user, 85.6, 24.0, current_date, '[DEMO] آخر وزن')
  on conflict (user_id, logged_at) do update set weight = excluded.weight, body_fat = excluded.body_fat, notes = excluded.notes, updated_at = now();

  insert into public.water_logs (user_id, amount_ml, logged_at, notes)
  values
    (v_user, 750, current_date, '[DEMO] صباحًا'),
    (v_user, 900, current_date, '[DEMO] بعد الظهر'),
    (v_user, 600, current_date, '[DEMO] مساءً'),
    (v_user, 2200, current_date - 1, '[DEMO] إجمالي تقريبي'),
    (v_user, 2500, current_date - 2, '[DEMO] يوم ملتزم');

  insert into public.workouts (user_id, workout_type, duration_minutes, calories, effort, workout_at, notes)
  values
    (v_user, 'مشي سريع', 42, 260, 'متوسط', current_date, '[DEMO] 6200 خطوة'),
    (v_user, 'تمارين مقاومة', 55, 410, 'مرتفع', current_date - 2, '[DEMO] صدر وكتف'),
    (v_user, 'كارديو خفيف', 25, 180, 'متوسط', current_date - 5, '[DEMO] دراجة');

  insert into public.sleep_logs (user_id, hours, quality, slept_at, notes)
  values
    (v_user, 7.2, 'جيدة', current_date, '[DEMO] نوم مستقر'),
    (v_user, 6.1, 'متوسطة', current_date - 1, '[DEMO] نوم أقل بسبب عمل متأخر'),
    (v_user, 7.8, 'ممتازة', current_date - 2, '[DEMO] نوم ممتاز')
  on conflict (user_id, slept_at) do update set hours = excluded.hours, quality = excluded.quality, notes = excluded.notes, updated_at = now();

  insert into public.courses (user_id, title, provider, field, status, priority, start_date, target_end_date, total_lessons, completed_lessons, notes)
  values (v_user, 'Performance Testing with k6', 'Udemy', 'Software Testing', 'جاري', 'عالية', current_date - 18, current_date + 22, 42, 17, '[DEMO] كورس مرتبط بالمسار المهني')
  returning id into v_course_k6;

  insert into public.courses (user_id, title, provider, field, status, priority, start_date, target_end_date, total_lessons, completed_lessons, notes)
  values (v_user, 'بناء تطبيقات بدون كود باستخدام AppSheet', 'YouTube', 'No-Code', 'جاري', 'متوسطة', current_date - 8, current_date + 18, 28, 11, '[DEMO] للاستفادة من أفكار الأتمتة')
  returning id into v_course_appsheet;

  insert into public.course_lessons (user_id, course_id, title, status, duration_minutes, completed_at, notes)
  values
    (v_user, v_course_k6, 'مقدمة عن اختبار الأداء', 'مكتمل', 24, current_date - 12, '[DEMO] درس مكتمل'),
    (v_user, v_course_k6, 'كتابة أول سيناريو k6', 'مكتمل', 38, current_date - 9, '[DEMO] تطبيق عملي'),
    (v_user, v_course_k6, 'تحليل النتائج والـ Thresholds', 'جاري', 45, null, '[DEMO] يحتاج مراجعة'),
    (v_user, v_course_appsheet, 'تصميم الجداول والعلاقات', 'مكتمل', 31, current_date - 4, '[DEMO] درس no-code'),
    (v_user, v_course_appsheet, 'UX للإدخال السريع', 'جاري', 28, null, '[DEMO] مهم للجوال');

  insert into public.books (user_id, title, author, field, status, priority, total_pages, current_page, start_date, target_end_date, summary, apply_notes)
  values (v_user, 'Explore It!', 'Elisabeth Hendrickson', 'Exploratory Testing', 'أقرأ الآن', 'عالية', 186, 62, current_date - 9, current_date + 21, '[DEMO] كتاب لتحسين التفكير الاختباري.', 'تطبيق جلسات استكشاف على مشروع Life OS')
  returning id into v_book_explore;

  insert into public.books (user_id, title, author, field, status, priority, total_pages, current_page, start_date, target_end_date, summary, apply_notes)
  values (v_user, 'Lessons Learned in Software Testing', 'Kaner, Bach, Pettichord', 'Software Testing', 'للقراءة', 'عالية', 320, 0, null, current_date + 60, '[DEMO] كتاب مرجعي للدروس العملية.', 'قراءة فصلين أسبوعيًا وتلخيص الأفكار')
  returning id into v_book_lessons;

  insert into public.reading_logs (user_id, book_id, pages_read, minutes, read_at, notes)
  values
    (v_user, v_book_explore, 18, 35, current_date - 3, '[DEMO] فصل عن Charters'),
    (v_user, v_book_explore, 22, 45, current_date - 1, '[DEMO] فصل عن Tours'),
    (v_user, v_book_explore, 12, 25, current_date, '[DEMO] مراجعة سريعة');

  insert into public.goals (user_id, title, area, status, priority, start_date, due_date, target_value, current_value, unit, why, notes)
  values (v_user, 'إنهاء كورس k6 وتطبيقه على مشروع حقيقي', 'تعلم', 'جاري', 'عالية', current_date - 18, current_date + 22, 42, 17, 'درس', 'رفع مستوى اختبار الأداء', '[DEMO] هدف تعلم')
  returning id into v_goal_learning;

  insert into public.goals (user_id, title, area, status, priority, start_date, due_date, target_value, current_value, unit, why, notes)
  values (v_user, 'خفض مصروفات الأكل خارج البيت 20%', 'مال', 'جاري', 'متوسطة', date_trunc('month', current_date)::date, (date_trunc('month', current_date)::date + interval '1 month - 1 day')::date, 1600, 720, 'SAR', 'زيادة الادخار دون ضغط كبير', '[DEMO] هدف مالي')
  returning id into v_goal_money;

  insert into public.goals (user_id, title, area, status, priority, start_date, due_date, target_value, current_value, unit, why, notes)
  values (v_user, 'الوصول إلى وزن 84 كجم', 'صحة', 'جاري', 'عالية', current_date - 14, current_date + 45, 84, 85.6, 'kg', 'تحسين الطاقة والصحة', '[DEMO] هدف صحة')
  returning id into v_goal_health;

  insert into public.tasks (user_id, goal_id, title, priority, status, due_date, notes)
  values
    (v_user, v_goal_learning, 'كتابة سيناريو k6 لتسجيل الدخول', 'عالية', 'جاري العمل', current_date + 2, '[DEMO] مهمة تعلم'),
    (v_user, v_goal_learning, 'تلخيص درس Thresholds', 'متوسطة', 'جديدة', current_date + 3, '[DEMO] مهمة تعلم'),
    (v_user, v_goal_money, 'تجهيز وجبات 3 أيام بدل الطلب', 'عالية', 'جديدة', current_date + 1, '[DEMO] مهمة مالية وصحية'),
    (v_user, v_goal_health, 'مشي 6000 خطوة', 'متوسطة', 'مكتملة', current_date, '[DEMO] مهمة صحة'),
    (v_user, null, 'مراجعة لوحة التقارير مساءً', 'متوسطة', 'جديدة', current_date, '[DEMO] مهمة تشغيل النظام');

  insert into public.habits (user_id, title, frequency, target_value, unit, is_active)
  values (v_user, 'قراءة 20 دقيقة', 'يومي', 20, 'دقيقة', true)
  returning id into v_habit_reading;

  insert into public.habits (user_id, title, frequency, target_value, unit, is_active)
  values (v_user, 'مياه 2.6 لتر', 'يومي', 2600, 'مل', true)
  returning id into v_habit_water;

  insert into public.habits (user_id, title, frequency, target_value, unit, is_active)
  values (v_user, 'مشي 6000 خطوة', 'يومي', 6000, 'خطوة', true)
  returning id into v_habit_walk;

  insert into public.habit_logs (user_id, habit_id, logged_at, value, status, notes)
  values
    (v_user, v_habit_reading, current_date, 25, 'تم', '[DEMO] قراءة اليوم'),
    (v_user, v_habit_water, current_date, 2250, 'جزئي', '[DEMO] باقي كوبين'),
    (v_user, v_habit_walk, current_date, 6200, 'تم', '[DEMO] مشي مكتمل');

  insert into public.monthly_reviews (user_id, month, score, wins, lessons, next_actions)
  values (v_user, date_trunc('month', current_date)::date, 8, 'بدأت نظام Life OS وسجلت أول بيانات يومية', '[DEMO] النظام مفيد فقط إذا كان الإدخال سريعًا.', 'تبسيط النماذج ومراجعة التقرير أسبوعيًا')
  on conflict (user_id, month) do update set score = excluded.score, wins = excluded.wins, lessons = excluded.lessons, next_actions = excluded.next_actions, updated_at = now();

  insert into public.investments (user_id, account_id, asset_name, asset_type, symbol, quantity, buy_price, current_price, amount_invested, current_value, currency, risk_level, purchased_at, notes)
  values (v_user, v_invest_wallet, 'صندوق مؤشر عالمي', 'صناديق', 'INDEX', 75, 102.5, 108.2, 7687.5, 8115, 'SAR', 'متوسط', current_date - 120, '[DEMO] استثمار طويل الأجل')
  returning id into v_invest_index;

  insert into public.investments (user_id, account_id, asset_name, asset_type, symbol, quantity, buy_price, current_price, amount_invested, current_value, currency, risk_level, purchased_at, notes)
  values (v_user, v_invest_wallet, 'صكوك قصيرة الأجل', 'صناديق', 'SUKUK', 110, 100, 101.4, 11000, 11154, 'SAR', 'منخفض', current_date - 75, '[DEMO] دخل ثابت منخفض المخاطر')
  returning id into v_invest_sukuk;

  insert into public.investment_transactions (user_id, investment_id, transaction_type, quantity, price, fees, transaction_at, notes)
  values
    (v_user, v_invest_index, 'شراء', 50, 101, 5, current_date - 120, '[DEMO] شراء أول'),
    (v_user, v_invest_index, 'شراء', 25, 105.5, 5, current_date - 45, '[DEMO] تعزيز مركز'),
    (v_user, v_invest_sukuk, 'شراء', 110, 100, 0, current_date - 75, '[DEMO] صكوك');

  insert into public.inbox_items (user_id, title, item_type, area, priority, source, processing_status, decision, notes)
  values
    (v_user, 'فكرة تحسين صفحة التقارير الشهرية', 'فكرة', 'شخصي', 'عالية', 'مراجعة أسبوعية', 'جديد', null, '[DEMO] إضافة مقارنة آخر 3 أشهر'),
    (v_user, 'شراء ميزان مطبخ', 'مهمة', 'صحة', 'متوسطة', 'خطة غذائية', 'جديد', null, '[DEMO] يساعد على حساب السعرات'),
    (v_user, 'مراجعة كورس k6 قبل نهاية الأسبوع', 'تعلم', 'عمل', 'عالية', 'خطة تعلم', 'قيد المراجعة', 'جدولة جلسة مساء الثلاثاء', '[DEMO] عنصر صندوق مراجعة');

  insert into public.daily_plans (user_id, plan_date, day_name, main_focus, top_three, energy_level, score, reflection)
  values (v_user, current_date, 'اليوم', 'تثبيت نظام حياتي والالتزام بإدخال بسيط', 'تسجيل المصروفات
إنهاء درس k6
مشي 6000 خطوة', 'مرتفع', 8, '[DEMO] يوم جيد للانطلاق بدون تعقيد')
  on conflict (user_id, plan_date) do update set main_focus = excluded.main_focus, top_three = excluded.top_three, energy_level = excluded.energy_level, score = excluded.score, reflection = excluded.reflection, updated_at = now();

  insert into public.time_blocks (user_id, title, area, start_at, end_at, planned_minutes, actual_minutes, focus_score, notes)
  values
    (v_user, 'تعلم k6', 'تعلم', now() - interval '5 hours', now() - interval '4 hours', 60, 55, 8, '[DEMO] جلسة مركزة'),
    (v_user, 'مراجعة المصروفات', 'مال', now() - interval '2 hours', now() - interval '90 minutes', 30, 25, 7, '[DEMO] مراجعة سريعة'),
    (v_user, 'تخطيط الغد', 'شخصي', now() + interval '3 hours', null, 20, 0, 0, '[DEMO] مخطط');

  insert into public.projects (user_id, name, area, status, priority, start_date, due_date, progress, why, success_criteria)
  values (v_user, 'نظام إدارة حياتي الشخصية', 'شخصي', 'جاري', 'حرجة', current_date - 7, current_date + 30, 35, '[DEMO] أحتاج نظامًا موحدًا بدل التشتت بين التطبيقات.', 'استخدام يومي لمدة شهر، ولوحة واضحة للجوال واللابتوب')
  returning id into v_project_lifeos;

  insert into public.project_milestones (user_id, project_id, title, status, due_date, notes)
  values
    (v_user, v_project_lifeos, 'تشغيل قاعدة البيانات', 'مكتمل', current_date - 1, '[DEMO] تم تجهيز schema'),
    (v_user, v_project_lifeos, 'تحسين UI/UX', 'جاري', current_date + 2, '[DEMO] نسخة تصميم فاتحة'),
    (v_user, v_project_lifeos, 'تجربة PWA على الجوال', 'جديد', current_date + 4, '[DEMO] تثبيت على الشاشة الرئيسية');

  insert into public.journal_entries (user_id, entry_date, title, mood, gratitude, lessons, content)
  values (v_user, current_date, 'بداية منظمة', 'جيد', 'الصحة، فرصة التعلم، وضوح الخطة', 'أفضل نظام هو الذي أستخدمه كل يوم.', '[DEMO] اليوم ركزت على بناء نظام بسيط ومتدرج. أهم ملاحظة: لا أريد إدخالًا طويلًا حتى لا أترك التطبيق.');

  insert into public.mood_logs (user_id, logged_at, mood_score, energy_score, stress_score, sleep_quality, trigger, notes)
  values
    (v_user, current_date, 8, 7, 3, 'جيدة', 'تقدم واضح في المشروع', '[DEMO] مزاج جيد'),
    (v_user, current_date - 1, 6, 5, 6, 'متوسطة', 'ضغط عمل', '[DEMO] توتر متوسط'),
    (v_user, current_date - 2, 7, 8, 4, 'ممتازة', 'نوم كافي', '[DEMO] طاقة عالية');

  insert into public.people (user_id, full_name, relationship_type, email, phone, company, last_contact_at, next_follow_up_at, notes)
  values
    (v_user, 'محمد صالح', 'عمل', 'mohamed@example.com', '+966500000001', 'عميل مستقل', current_date - 3, current_date + 4, '[DEMO] متابعة عرض اختبار الأداء'),
    (v_user, 'سارة علي', 'مدرب', 'sara@example.com', '+966500000002', 'منصة تعلم', current_date - 8, current_date + 14, '[DEMO] سؤال عن خطة التعلم'),
    (v_user, 'أحمد خالد', 'صديق', null, '+966500000003', null, current_date - 15, current_date + 10, '[DEMO] اتصال شهري');

  insert into public.documents (user_id, title, document_type, related_area, file_url, expires_at, tags, notes)
  values
    (v_user, 'شهادة كورس أساسيات الاختبار', 'شهادة', 'تعلم', 'https://example.com/certificate-testing', null, 'تعلم، اختبار', '[DEMO] رابط تجريبي'),
    (v_user, 'إيصال اشتراك النادي', 'إيصال', 'صحة', null, current_date + 25, 'صحة، اشتراك', '[DEMO] مرفق سيتم رفعه لاحقًا'),
    (v_user, 'خطة ميزانية الشهر', 'رابط', 'مال', 'https://example.com/monthly-budget', null, 'ميزانية', '[DEMO] رابط تخطيط');

  insert into public.recipes (user_id, name, meal_type, calories, protein, carbs, fat, prep_minutes, ingredients, steps)
  values
    (v_user, 'دجاج مشوي مع رز وخضار', 'غداء', 650, 45, 70, 18, 30, 'دجاج، رز، خضار، زيت زيتون، بهارات', '[DEMO] تتبيل الدجاج ثم الشوي وتجهيز الرز والخضار.'),
    (v_user, 'زبادي يوناني بالشوفان', 'فطور', 420, 32, 48, 10, 8, 'زبادي، شوفان، توت، عسل', '[DEMO] خلط المكونات وتقديمها باردة.'),
    (v_user, 'تونة وسلطة حمص', 'عشاء', 390, 36, 32, 11, 12, 'تونة، حمص، خس، خيار، ليمون', '[DEMO] وصفة عشاء سريعة.');

  insert into public.meal_plans (user_id, planned_date, meal_type, meal_name, target_calories, is_prepared, notes)
  values
    (v_user, current_date, 'غداء', 'دجاج مشوي مع رز وخضار', 650, 'نعم', '[DEMO] جاهزة في الثلاجة'),
    (v_user, current_date + 1, 'فطور', 'زبادي يوناني بالشوفان', 420, 'لا', '[DEMO] يحتاج شراء توت'),
    (v_user, current_date + 1, 'عشاء', 'تونة وسلطة حمص', 390, 'لا', '[DEMO] عشاء خفيف');

  insert into public.grocery_items (user_id, item_name, category, quantity, unit, estimated_price, status, notes)
  values
    (v_user, 'صدور دجاج', 'بروتين', 2, 'كيلو', 54, 'مطلوب', '[DEMO] للوجبات الأسبوعية'),
    (v_user, 'زبادي يوناني', 'ألبان', 6, 'علبة', 36, 'مطلوب', '[DEMO] فطور وسناك'),
    (v_user, 'خضار مشكلة', 'خضار', 1, 'سلة', 28, 'تم الشراء', '[DEMO] تم شراؤها'),
    (v_user, 'شوفان', 'كارب', 1, 'عبوة', 19, 'مطلوب', '[DEMO] للفطور');

  insert into public.debts (user_id, title, party, debt_type, total_amount, paid_amount, due_date, status, notes)
  values
    (v_user, 'قسط جهاز لابتوب', 'متجر إلكترونيات', 'قسط', 4200, 2100, current_date + 9, 'مفتوح', '[DEMO] قسط شهري'),
    (v_user, 'مبلغ مستحق من عميل', 'محمد صالح', 'لي', 1800, 0, current_date + 15, 'مفتوح', '[DEMO] مستحقات عمل حر');

  insert into public.asset_items (user_id, name, asset_type, purchase_date, purchase_price, current_value, warranty_until, location, notes)
  values
    (v_user, 'MacBook Pro', 'جهاز', current_date - 420, 8500, 6200, current_date + 310, 'المكتب', '[DEMO] جهاز العمل الرئيسي'),
    (v_user, 'دراجة رياضية', 'رياضة', current_date - 90, 1200, 950, current_date + 275, 'البيت', '[DEMO] للاستخدام المنزلي');

  insert into public.home_inventory (user_id, item_name, category, quantity, min_quantity, unit, location, expires_at, notes)
  values
    (v_user, 'قهوة', 'مطبخ', 2, 1, 'عبوة', 'المطبخ', null, '[DEMO] متوفر'),
    (v_user, 'علب تونة', 'مطبخ', 5, 3, 'علبة', 'المخزن', current_date + 180, '[DEMO] بروتين سريع'),
    (v_user, 'منظف ملابس', 'منزل', 1, 1, 'عبوة', 'غرفة الغسيل', null, '[DEMO] اقترب من النفاد');

  insert into public.saving_goals (user_id, title, target_amount, current_amount, monthly_contribution, target_date, priority, notes)
  values
    (v_user, 'صندوق طوارئ 6 أشهر', 45000, 18500, 2500, current_date + 330, 'عالية', '[DEMO] هدف أمان مالي'),
    (v_user, 'ميزانية سفر قصيرة', 6500, 1200, 900, current_date + 150, 'متوسطة', '[DEMO] هدف سفر');

  insert into public.career_actions (user_id, action_date, title, action_type, status, impact_score, notes)
  values
    (v_user, current_date - 2, 'تطبيق سيناريو اختبار أداء على Login API', 'تطبيق عملي', 'جاري', 8, '[DEMO] متعلق بالـ QA'),
    (v_user, current_date + 3, 'تحديث السيرة الذاتية بمشروع Life OS', 'مسار مهني', 'مخطط', 7, '[DEMO] إبراز المشروع');

  insert into public.skills (user_id, name, category, current_level, target_level, practice_plan, notes)
  values
    (v_user, 'اختبار الأداء باستخدام k6', 'اختبار برمجيات', 4, 8, 'سيناريو عملي أسبوعيًا ومراجعة النتائج', '[DEMO] مهارة أساسية'),
    (v_user, 'تصميم UX للمنتجات الداخلية', 'تصميم منتج', 3, 7, 'تحليل تطبيقات يومية وتحسين تدفق الإدخال', '[DEMO] لتحسين التطبيق'),
    (v_user, 'إدارة Supabase RLS', 'Backend', 4, 8, 'مراجعة السياسات وكتابة اختبارات يدوية', '[DEMO] أمان البيانات');

  insert into public.certificates (user_id, title, issuer, field, issued_at, expires_at, credential_url, notes)
  values
    (v_user, 'ISTQB Foundation - Demo', 'ASTQB', 'Software Testing', current_date - 600, null, 'https://example.com/istqb-demo', '[DEMO] شهادة تجريبية'),
    (v_user, 'Performance Testing Essentials', 'Udemy', 'Performance', current_date - 90, null, 'https://example.com/performance-demo', '[DEMO] شهادة تعلم');

  insert into public.relationships_logs (user_id, person_name, contact_at, contact_type, quality_score, next_step, notes)
  values
    (v_user, 'محمد صالح', current_date - 3, 'مكالمة', 8, 'إرسال ملخص العرض', '[DEMO] تواصل عمل'),
    (v_user, 'أحمد خالد', current_date - 15, 'رسالة', 7, 'تحديد لقاء قهوة', '[DEMO] متابعة صديق');

  insert into public.travel_plans (user_id, destination, purpose, start_date, end_date, budget, status, checklist, notes)
  values
    (v_user, 'الرياض', 'عمل', current_date + 25, current_date + 27, 1800, 'مخطط', 'حجز فندق
مراجعة جدول الاجتماعات
تجهيز اللابتوب', '[DEMO] رحلة قصيرة'),
    (v_user, 'أبها', 'ترفيه', current_date + 95, current_date + 99, 4200, 'فكرة', 'بحث عن السكن
خطة الأماكن
ميزانية أكل', '[DEMO] فكرة سفر');

  insert into public.idea_bank (user_id, title, area, potential_score, effort_score, status, description, next_action)
  values
    (v_user, 'تحويل Life OS إلى SaaS عربي مصغر', 'عمل', 9, 8, 'للدراسة', '[DEMO] فكرة منتج مبنية على النظام الشخصي الحالي.', 'عمل Landing Page بسيطة'),
    (v_user, 'قالب AppSheet بديل للنسخة الخفيفة', 'تعلم', 7, 5, 'خام', '[DEMO] نسخة بدون كود لمن يريد بداية أسرع.', 'رسم جداول Google Sheets');

  insert into public.decision_logs (user_id, decision_date, title, area, confidence_score, expected_outcome, alternatives, review_date, actual_outcome)
  values
    (v_user, current_date - 5, 'بناء Life OS كـ PWA بدل AppSheet', 'شخصي', 8, '[DEMO] مرونة أعلى وتصميم احترافي وقابلية توسع أكبر.', 'AppSheet، Google Sheets فقط، Notion', current_date + 55, null),
    (v_user, current_date - 1, 'اعتماد واجهة فاتحة مريحة بدل داكنة', 'تصميم', 9, '[DEMO] قراءة أفضل واستخدام أطول بدون إجهاد.', 'ثيم داكن، ثيم مختلط', current_date + 21, null);

  insert into public.rituals (user_id, title, ritual_type, trigger, duration_minutes, steps, is_active)
  values
    (v_user, 'روتين بداية اليوم', 'صباحي', 'بعد القهوة', 20, '[DEMO] مراجعة مخطط اليوم
تحديد أهم 3 مهام
تسجيل الوزن والمياه', 'نعم'),
    (v_user, 'إغلاق اليوم', 'مسائي', 'قبل النوم', 15, '[DEMO] تسجيل المصروفات
مراجعة المهام
كتابة ملاحظة يومية', 'نعم');

  insert into public.weekly_reviews (user_id, week_start, score, wins, problems, lessons, next_week_focus)
  values (v_user, date_trunc('week', current_date)::date, 8, 'تقدم واضح في النظام والتعلم', 'كثرة الوحدات قد تشتت في البداية', '[DEMO] ابدأ بثلاث وحدات يومية فقط.', 'المال، الصحة، التعلم')
  on conflict (user_id, week_start) do update set score = excluded.score, wins = excluded.wins, problems = excluded.problems, lessons = excluded.lessons, next_week_focus = excluded.next_week_focus, updated_at = now();

  insert into public.quarterly_reviews (user_id, quarter_start, score, wins, lessons, next_quarter_focus)
  values (v_user, date_trunc('quarter', current_date)::date, 7, 'بناء نظام شخصي واضح', '[DEMO] القياس اليومي أفضل من التخطيط الطويل.', 'تحسين الالتزام وربط الأهداف بالمهام')
  on conflict (user_id, quarter_start) do update set score = excluded.score, wins = excluded.wins, lessons = excluded.lessons, next_quarter_focus = excluded.next_quarter_focus, updated_at = now();

  insert into public.yearly_reviews (user_id, year_number, score, theme, wins, lessons, next_year_goals)
  values (v_user, extract(year from current_date)::integer, 8, 'وضوح وانضباط', 'بدأت بناء Life OS شخصي', '[DEMO] النظام القوي يبدأ بعادة إدخال بسيطة.', 'تثبيت الصحة، رفع الدخل، إنهاء مسار QA')
  on conflict (user_id, year_number) do update set score = excluded.score, theme = excluded.theme, wins = excluded.wins, lessons = excluded.lessons, next_year_goals = excluded.next_year_goals, updated_at = now();

  insert into public.import_jobs (user_id, job_name, target_table, source_format, status, rows_count, notes)
  values (v_user, 'استيراد مصروفات CSV', 'expenses', 'CSV', 'مخطط', 250, '[DEMO] اختبار استيراد بيانات قديمة');

  insert into public.export_jobs (user_id, job_name, export_format, status, file_url, rows_count, notes)
  values (v_user, 'تصدير نسخة شهرية', 'JSON', 'مكتمل', 'https://example.com/export-demo.json', 520, '[DEMO] نسخة تجريبية');

  insert into public.automation_rules (user_id, name, module, trigger_type, condition_text, action_text, is_active)
  values
    (v_user, 'تذكير الميزانية عند 80%', 'finance', 'حد مالي', '[DEMO] إذا تجاوز بند الأكل 80% من الميزانية', 'أظهر تنبيه داخل النظام', 'نعم'),
    (v_user, 'مراجعة كتاب كل 3 أيام', 'books', 'تاريخ', '[DEMO] إذا لم توجد قراءة خلال 3 أيام', 'أضف مهمة قراءة', 'نعم');

  insert into public.notification_rules (user_id, title, channel, frequency, next_run_at, is_active, message)
  values
    (v_user, 'تذكير تسجيل المصروفات', 'داخل التطبيق', 'يومي', now() + interval '8 hours', 'نعم', '[DEMO] لا تنس تسجيل مصروفات اليوم قبل النوم.'),
    (v_user, 'مراجعة أسبوعية', 'داخل التطبيق', 'أسبوعي', now() + interval '5 days', 'نعم', '[DEMO] راجع المال والصحة والتعلم يوم الجمعة.');

  insert into public.app_settings (key, value, description)
  values
    ('demo_seed_last_run', jsonb_build_object('user_id', v_user, 'seeded_at', now(), 'version', 'realistic-v3'), 'آخر تشغيل لبيانات Demo الواقعية')
  on conflict (key) do update set value = excluded.value, description = excluded.description, updated_at = now();

  raise notice 'تم إدخال بيانات Demo واقعية للمستخدم %', v_user;
end $$;
