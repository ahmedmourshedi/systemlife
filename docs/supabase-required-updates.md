# Supabase Required Updates

هذه التعديلات مطلوبة بعد تحويل المشروع لاستخدام شخص واحد مع صفحة إعداد شخصية.

## 1. تشغيل جدول تفضيلات الاستخدام

افتح Supabase SQL Editor وشغل الملف:

```text
database/personal-preferences.sql
```

هذا ينشئ جدول:

```text
public.personal_preferences
```

وظيفته حفظ:

- أهم 3 مجالات تتابعها.
- إظهار أو إخفاء الصحة.
- إظهار أو إخفاء الاستثمار.
- إظهار أو إخفاء التعلم.
- إظهار أو إخفاء القراءة.
- إظهار أو إخفاء العلاقات.
- إظهار أو إخفاء السفر.
- إظهار أو إخفاء وحدات البيت.

## 2. بعد تشغيل SQL

افتح:

```text
http://localhost:3000/app/setup
```

ثم احفظ إعداداتك.

بعد الحفظ، القائمة الجانبية ستتغير حسب اختياراتك.

## 3. لو ظهر خطأ set_updated_at

شغل أولًا:

```text
database/schema.sql
```

أو:

```text
database/mega-extension.sql
```

لأن trigger جدول التفضيلات يعتمد على الدالة:

```text
public.set_updated_at()
```
