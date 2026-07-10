import { upsertDailyPlanAction } from "@/app/actions";
import { Field, FormCard, SectionHeader, SubmitButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { formatDate, safeText, todayISO } from "@/lib/utils";
import type { Row } from "@/lib/types";

export const metadata = {
  title: "مخطط اليوم"
};

export default async function PlannerPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const today = todayISO();

  const { data } = await supabase
    .from("daily_plans")
    .select("*")
    .order("plan_date", { ascending: false })
    .limit(7);

  const plans = (data ?? []) as Row[];
  const todayPlan = plans.find((plan) => String(plan.plan_date) === today);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="تخطيط بسيط"
        title="مخطط اليوم"
        description="اكتب تركيز اليوم وأهم 3 نتائج فقط. التفاصيل المتقدمة اختيارية وتظهر عند الحاجة."
        icon="calendar"
      />

      {params.message ? <div className="rounded-[1.25rem] border border-teal-200 bg-teal-50 p-4 text-sm font-extrabold text-teal-800">{params.message}</div> : null}
      {params.error ? <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm font-extrabold text-rose-700">{params.error}</div> : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.2fr)]">
        <FormCard title="خطة اليوم" description="ابدأ بالضروري فقط: تركيز واحد وثلاث نتائج. هذا يكفي للاستخدام اليومي.">
          <form action={upsertDailyPlanAction} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="التاريخ">
                <input className="input" name="plan_date" type="date" defaultValue={String(todayPlan?.plan_date ?? today)} required />
              </Field>
              <Field label="طاقة اليوم">
                <select className="input" name="energy_level" defaultValue={safeText(todayPlan?.energy_level, "متوسط")}>
                  <option>منخفض</option>
                  <option>متوسط</option>
                  <option>مرتفع</option>
                </select>
              </Field>
              <Field label="تركيز اليوم" className="md:col-span-2">
                <input className="input" name="main_focus" defaultValue={safeText(todayPlan?.main_focus)} placeholder="ما أهم نتيجة تجعل اليوم ناجحًا؟" required />
              </Field>
              <Field label="أهم 3 نتائج" className="md:col-span-2">
                <textarea className="input min-h-32" name="top_three" defaultValue={safeText(todayPlan?.top_three)} placeholder={"1. \n2. \n3. "} />
              </Field>
            </div>

            <details className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <summary className="cursor-pointer text-sm font-extrabold text-slate-700">تفاصيل متقدمة اختيارية</summary>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="اسم اليوم">
                  <input className="input" name="day_name" defaultValue={safeText(todayPlan?.day_name, "اليوم")} />
                </Field>
                <Field label="تقييم اليوم">
                  <input className="input" name="score" type="number" min="0" max="10" defaultValue={Number(todayPlan?.score ?? 7)} />
                </Field>
                <Field label="مراجعة آخر اليوم" className="md:col-span-2">
                  <textarea className="input min-h-28" name="reflection" defaultValue={safeText(todayPlan?.reflection)} placeholder="اختياري بعد نهاية اليوم" />
                </Field>
              </div>
            </details>

            <div className="sticky bottom-24 z-10 rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-premium backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <SubmitButton>حفظ مخطط اليوم</SubmitButton>
            </div>
          </form>
        </FormCard>

        <section className="card">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-slate-950">آخر الخطط</h2>
            <p className="mt-2 text-sm font-medium leading-7 text-slate-600">مراجعة سريعة لخطط آخر أيام بدون جداول كبيرة.</p>
          </div>
          <div className="space-y-3">
            {plans.map((plan) => (
              <article key={String(plan.id)} className="rounded-[1.35rem] border border-slate-200 bg-white/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold text-teal-700">{formatDate(String(plan.plan_date ?? ""))}</p>
                    <h3 className="mt-2 text-base font-extrabold text-slate-950">{safeText(plan.main_focus, "بدون تركيز")}</h3>
                  </div>
                  <span className="pill">{safeText(plan.energy_level, "متوسط")}</span>
                </div>
                {plan.top_three ? <p className="mt-3 whitespace-pre-line text-sm font-medium leading-7 text-slate-600">{safeText(plan.top_three)}</p> : null}
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
