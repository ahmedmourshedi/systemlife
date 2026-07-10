import { SectionHeader } from "@/components/ui";

export const metadata = {
  title: "إعدادات النظام"
};

const checklist = [
  "إنشاء مشروع Supabase.",
  "تشغيل ملف database/schema.sql داخل SQL Editor.",
  "تشغيل database/create-demo-auth-users.sql لإنشاء الحساب الشخصي.",
  "تشغيل database/first-admin.sql للتأكد من صلاحية إدارة النظام.",
  "إضافة متغيرات البيئة داخل .env.local وداخل Vercel.",
  "تشغيل npm install ثم npm run dev محليًا.",
  "اختبار إضافة مصروف، وجبة، كورس، كتاب، مهمة وهدف.",
  "تشغيل database/realistic-demo-seed.sql فقط إذا أردت بيانات Demo واقعية.",
  "نشر المشروع على Vercel.",
  "فتح الموقع من الجوال واختيار Add to Home Screen."
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="تشغيل النظام"
        title="إعدادات النظام"
        description="هذه الصفحة إدارية لتتبع خطوات التشغيل والنشر وتجهيز بيانات العرض التجريبية."
        icon="settings"
      />

      <section className="card">
        <h2 className="text-xl font-extrabold text-slate-950">قائمة فحص التشغيل</h2>
        <div className="mt-6 space-y-3">
          {checklist.map((item, index) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-sky-600 text-sm font-extrabold text-white">
                {index + 1}
              </span>
              <p className="text-sm font-medium leading-7 text-slate-600">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-extrabold text-slate-950">متغيرات البيئة المطلوبة</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-left text-xs leading-6 text-slate-100" dir="ltr">{`NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=`}</pre>
        </div>
        <div className="card">
          <h2 className="text-xl font-extrabold text-slate-950">ملاحظة أمنية</h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            لا تحفظ كلمات مرور البنوك أو مفاتيح المحافظ أو بيانات حساسة داخل التطبيق. استخدم النظام للتسجيل والتحليل والمتابعة فقط.
          </p>
        </div>
      </section>
    </div>
  );
}
