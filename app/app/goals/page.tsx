import Link from "next/link";
import { createGoalAction, createMonthlyReviewAction, createTaskAction } from "@/app/actions";
import { AppIcon } from "@/components/icons";
import { SimpleList } from "@/components/record-list";
import { EmptyState, Field, FormCard, ProgressBar, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { goalAreas, priorities, statuses } from "@/lib/constants";
import { getGoalsData } from "@/lib/data";
import { formatDate, formatNumber, progress, safeText } from "@/lib/utils";

export const metadata = {
  title: "الأهداف"
};

export default async function GoalsPage() {
  const data = await getGoalsData();
  const activeGoals = data.goals.filter((row) => row.status !== "مكتمل").length;
  const completedGoals = data.goals.filter((row) => row.status === "مكتمل").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="نظام الأهداف"
        title="الأهداف"
        description="اكتب الهدف بسرعة، ثم أضف المقاييس والتفاصيل فقط عندما تحتاجها."
        icon="target"
        action={
          <Link href="/app/quick-add?type=task" className="btn-secondary">
            <AppIcon name="checkCircle" className="h-5 w-5" />
            مهمة سريعة
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="أهداف نشطة" value={formatNumber(activeGoals)} icon="target" />
        <StatCard title="أهداف مكتملة" value={formatNumber(completedGoals)} icon="flag" tone="good" />
        <StatCard title="مراجعات شهرية" value={formatNumber(data.reviews.length)} icon="compass" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <FormCard title="هدف جديد" description="ابدأ بعنوان ومجال فقط. القياسات والتواريخ اختيارية.">
          <form action={createGoalAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="عنوان الهدف">
                <input className="input" name="title" required placeholder="مثال: إنهاء كورس k6" />
              </Field>
              <Field label="المجال">
                <select className="input" name="area" defaultValue="شخصي">
                  {goalAreas.map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="الأولوية">
                <select className="input" name="priority" defaultValue="متوسطة">
                  {priorities.map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="تاريخ الانتهاء">
                <input className="input" name="due_date" type="date" />
              </Field>
            </div>

            <details className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <summary className="cursor-pointer text-sm font-extrabold text-slate-700">تفاصيل وقياسات اختيارية</summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="الحالة">
                  <select className="input" name="status" defaultValue="جاري">
                    {statuses.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="الوحدة">
                  <input className="input" name="unit" defaultValue="%" />
                </Field>
                <Field label="القيمة الحالية">
                  <input className="input" name="current_value" type="number" defaultValue={0} />
                </Field>
                <Field label="القيمة المستهدفة">
                  <input className="input" name="target_value" type="number" defaultValue={100} />
                </Field>
                <Field label="لماذا هذا الهدف مهم؟" className="sm:col-span-2">
                  <textarea className="input min-h-24" name="why" placeholder="السبب الحقيقي وراء الهدف" />
                </Field>
              </div>
            </details>

            <div className="sticky bottom-24 z-10 rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-premium backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <SubmitButton>حفظ الهدف</SubmitButton>
            </div>
          </form>
        </FormCard>

        <FormCard title="خطوة تنفيذية" description="حوّل الهدف إلى مهمة صغيرة قابلة للتنفيذ.">
          <form action={createTaskAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="الهدف">
              <select className="input" name="goal_id">
                <option value="">بدون هدف</option>
                {data.goals.map((goal) => <option key={String(goal.id)} value={String(goal.id)}>{String(goal.title)}</option>)}
              </select>
            </Field>
            <Field label="عنوان المهمة">
              <input className="input" name="title" required placeholder="خطوة عملية" />
            </Field>
            <Field label="الأولوية">
              <select className="input" name="priority" defaultValue="متوسطة">
                {priorities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="تاريخ الاستحقاق">
              <input className="input" name="due_date" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ المهمة</SubmitButton>
            </div>
          </form>

          <details className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-slate-700">مراجعة شهرية اختيارية</summary>
            <form action={createMonthlyReviewAction} className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="شهر المراجعة">
                <input className="input" name="month" type="date" />
              </Field>
              <Field label="تقييم الشهر من 10">
                <input className="input" name="score" type="number" min="0" max="10" defaultValue={7} />
              </Field>
              <Field label="الإنجازات" className="sm:col-span-2">
                <textarea className="input min-h-20" name="wins" placeholder="ما الذي نجح؟" />
              </Field>
              <Field label="الدروس" className="sm:col-span-2">
                <textarea className="input min-h-20" name="lessons" placeholder="ما الذي تعلمته؟" />
              </Field>
              <Field label="خطوات الشهر القادم" className="sm:col-span-2">
                <textarea className="input min-h-20" name="next_actions" placeholder="ماذا ستفعل بعد ذلك؟" />
              </Field>
              <div className="sm:col-span-2">
                <SubmitButton>حفظ المراجعة</SubmitButton>
              </div>
            </form>
          </details>
        </FormCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="card">
          <h2 className="mb-5 text-xl font-extrabold text-slate-950">قائمة الأهداف</h2>
          {data.goals.length === 0 ? (
            <EmptyState title="لا توجد أهداف بعد" />
          ) : (
            <div className="space-y-4">
              {data.goals.map((goal) => (
                <article key={String(goal.id)} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-extrabold text-slate-950">{safeText(goal.title)}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {safeText(goal.area)} • {safeText(goal.status)} • {formatDate(String(goal.due_date ?? ""))}
                      </p>
                    </div>
                    <span className="pill">{safeText(goal.priority)}</span>
                  </div>
                  <ProgressBar value={progress(goal.current_value, goal.target_value)} label="نسبة التقدم" />
                </article>
              ))}
            </div>
          )}
        </section>

        <SimpleList title="المراجعات الشهرية" rows={data.reviews} primaryKey="wins" secondaryKey="month" empty="لا توجد مراجعات بعد" />
      </section>
    </div>
  );
}
