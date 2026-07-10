import Link from "next/link";
import { updatePersonalSetupAction } from "@/app/actions";
import { AppIcon } from "@/components/icons";
import { Field, FormCard, SectionHeader, SubmitButton } from "@/components/ui";
import { getCurrentUserProfile } from "@/lib/data";
import { getPersonalPreferences, preferenceLabels } from "@/lib/preferences";

export const metadata = {
  title: "إعداد نظامي الشخصي"
};

const focusAreas = ["المال", "الصحة", "المهام", "الأهداف", "التعلم", "القراءة", "الاستثمار", "العلاقات", "البيت"];

export default async function SetupPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  const context = await getCurrentUserProfile();
  const profile = context?.profile;
  const { preferences, tableMissing } = context
    ? await getPersonalPreferences(context.user.id)
    : { preferences: null, tableMissing: true };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="بداية الاستخدام"
        title="إعداد نظامي الشخصي"
        description="اختر ما يهمك فقط. الهدف أن تصبح القائمة أخف، والإدخال اليومي أقصر، والواجهة مناسبة لاستخدام شخص واحد."
        icon="settings"
        action={
          <Link href="/app" className="btn-secondary">
            <AppIcon name="home" className="h-5 w-5" />
            مركز اليوم
          </Link>
        }
      />

      {tableMissing ? (
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-900">
          جدول تفضيلات الاستخدام غير موجود في قاعدة البيانات الحالية. شغل ملف <span className="font-extrabold">database/personal-preferences.sql</span> داخل Supabase SQL Editor حتى يتم حفظ الاختيارات.
        </div>
      ) : null}
      {params.message ? <div className="rounded-[1.25rem] border border-teal-200 bg-teal-50 p-4 text-sm font-extrabold text-teal-800">{params.message}</div> : null}
      {params.error ? <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm font-extrabold text-rose-700">{params.error}</div> : null}

      <FormCard title="اختياراتي الأساسية" description="هذه القيم تستخدم كافتراضيات في النماذج ولوحة اليوم.">
        <form action={updatePersonalSetupAction} className="space-y-7">
          <section className="grid gap-4 md:grid-cols-2">
            <Field label="العملة">
              <select className="input" name="currency" defaultValue={profile?.currency ?? "SAR"}>
                <option>SAR</option>
                <option>USD</option>
                <option>EGP</option>
                <option>AED</option>
              </select>
            </Field>
            <Field label="المنطقة الزمنية">
              <input className="input" name="timezone" defaultValue={profile?.timezone ?? "Asia/Riyadh"} />
            </Field>
            <Field label="هدف المياه اليومي بالمل">
              <input className="input" name="daily_water_ml" type="number" min="0" step="50" defaultValue={profile?.daily_water_ml ?? 2500} />
            </Field>
            <Field label="هدف السعرات اليومي">
              <input className="input" name="daily_calories" type="number" min="0" step="50" defaultValue={profile?.daily_calories ?? 2200} />
            </Field>
          </section>

          <section>
            <h2 className="mb-3 text-base font-extrabold text-slate-950">أهم 3 مجالات أتابعها</h2>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {focusAreas.map((area) => (
                <label key={area} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm font-extrabold text-slate-700">
                  <input
                    type="checkbox"
                    name="focus_areas"
                    value={area}
                    defaultChecked={preferences?.focus_areas.includes(area)}
                    className="h-5 w-5 accent-teal-600"
                  />
                  {area}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs font-bold text-slate-500">اختر حتى 3. لو اخترت أكثر سيتم حفظ أول 3 فقط.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-extrabold text-slate-950">الوحدات التي تظهر في القائمة</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {preferenceLabels.map((item) => (
                <label key={item.key} className="rounded-[1.25rem] border border-slate-200 bg-white/85 p-4 shadow-sm">
                  <span className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name={item.key}
                      defaultChecked={Boolean(preferences?.[item.key])}
                      className="mt-1 h-5 w-5 accent-teal-600"
                    />
                    <span>
                      <span className="block text-sm font-extrabold text-slate-950">{item.label}</span>
                      <span className="mt-1 block text-xs font-bold leading-6 text-slate-500">{item.description}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="sticky bottom-24 z-10 rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-premium backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <SubmitButton>حفظ إعداد نظامي</SubmitButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
