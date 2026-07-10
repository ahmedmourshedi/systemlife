# خريطة قاعدة البيانات

## طبقة المستخدم

كل جدول مستخدم يحتوي على `user_id`، ويتم عزله عبر Row Level Security.

أمثلة:

- `expenses`
- `incomes`
- `tasks`
- `goals`
- `courses`
- `books`
- `inbox_items`
- `daily_plans`
- `time_blocks`
- `projects`
- `journal_entries`
- `mood_logs`
- `people`
- `documents`
- `recipes`
- `meal_plans`
- `grocery_items`
- `debts`
- `asset_items`
- `home_inventory`
- `saving_goals`
- `career_actions`
- `skills`
- `certificates`
- `relationships_logs`
- `travel_plans`
- `idea_bank`
- `decision_logs`
- `rituals`
- `weekly_reviews`
- `automation_rules`
- `notification_rules`

## طبقة الأدمن

الجداول الإدارية لا تعرض إلا للأدمن عبر `public.is_admin()`:

- `admin_audit_logs`
- `system_modules`
- `data_quality_checks`
- `module_templates`
- `backup_jobs`
- `security_events`
- `system_announcements`

## الحماية

كل جدول مستخدم يستخدم سياسة:

```sql
user_id = auth.uid() or public.is_admin()
```

كل جدول إداري يستخدم سياسة:

```sql
public.is_admin()
```
