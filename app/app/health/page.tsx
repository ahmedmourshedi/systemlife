import { createMealAction, createWaterAction, createWeightAction, createWorkoutAction } from "@/app/actions";
import Link from "next/link";
import { AppIcon } from "@/components/icons";
import { SimpleList } from "@/components/record-list";
import { Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { mealTypes } from "@/lib/constants";
import { getCurrentUserProfile, getHealthData } from "@/lib/data";
import { formatNumber, safeText, sumBy } from "@/lib/utils";

export const metadata = {
  title: "الأكل والصحة"
};

export default async function HealthPage() {
  const context = await getCurrentUserProfile();
  const data = await getHealthData();
  const todayCalories = sumBy(data.meals.filter((row) => String(row.meal_at ?? "").slice(0, 10) === new Date().toISOString().slice(0, 10)), (row) => row.calories);
  const waterToday = sumBy(data.water, (row) => row.amount_ml);
  const latestWeight = data.weights[0]?.weight;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="الصحة اليومية"
        title="الأكل والصحة"
        description="سجل الوجبات، السعرات، البروتين، المياه، الوزن والتمارين حتى ترى العلاقة بين عاداتك وصحتك."
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/app/quick-add?type=water" className="btn-secondary justify-center">
          <AppIcon name="droplet" className="h-5 w-5" />
          تسجيل مياه
        </Link>
        <Link href="/app/quick-add?type=meal" className="btn-secondary justify-center">
          <AppIcon name="salad" className="h-5 w-5" />
          تسجيل وجبة
        </Link>
        <a href="#weight-form" className="btn-secondary justify-center">
          <AppIcon name="scale" className="h-5 w-5" />
          تسجيل وزن
        </a>
        <a href="#workout-form" className="btn-secondary justify-center">
          <AppIcon name="run" className="h-5 w-5" />
          تسجيل تمرين
        </a>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="سعرات اليوم" value={formatNumber(todayCalories)} icon="flame" />
        <StatCard title="هدف السعرات" value={formatNumber(context?.profile.daily_calories ?? 2200)} icon="target" />
        <StatCard title="مياه اليوم" value={`${formatNumber(waterToday)} مل`} icon="droplet" />
        <StatCard title="آخر وزن" value={latestWeight ? `${formatNumber(latestWeight)} كجم` : "غير مسجل"} icon="scale" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <FormCard title="تسجيل وجبة" description="سجل وجبتك بسرعة مع السعرات والماكروز الأساسية.">
          <form action={createMealAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="نوع الوجبة">
              <select className="input" name="meal_type" defaultValue="غداء">
                {mealTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </Field>
            <Field label="اسم الأكل">
              <input className="input" name="name" placeholder="رز ودجاج، سلطة..." required />
            </Field>
            <Field label="السعرات">
              <input className="input" name="calories" type="number" min="0" />
            </Field>
            <Field label="البروتين">
              <input className="input" name="protein" type="number" min="0" step="0.1" />
            </Field>
            <Field label="الكارب">
              <input className="input" name="carbs" type="number" min="0" step="0.1" />
            </Field>
            <Field label="الدهون">
              <input className="input" name="fat" type="number" min="0" step="0.1" />
            </Field>
            <Field label="التقييم">
              <select className="input" name="quality" defaultValue="جيد">
                <option>ممتاز</option>
                <option>جيد</option>
                <option>متوسط</option>
                <option>سيئ</option>
              </select>
            </Field>
            <Field label="الوقت">
              <input className="input" name="meal_at" type="datetime-local" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="ملاحظات">
                <input className="input" name="notes" placeholder="اختياري" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ الوجبة</SubmitButton>
            </div>
          </form>
        </FormCard>

        <FormCard title="وزن ومياه وتمرين" description="سجل المؤشرات السريعة التي تؤثر على الصحة يوميًا.">
          <div className="space-y-6">
            <form id="weight-form" action={createWeightAction} className="grid gap-4 sm:grid-cols-3 scroll-mt-28">
              <Field label="الوزن">
                <input className="input" name="weight" type="number" step="0.1" min="0" required />
              </Field>
              <Field label="نسبة الدهون">
                <input className="input" name="body_fat" type="number" step="0.1" min="0" />
              </Field>
              <Field label="التاريخ">
                <input className="input" name="logged_at" type="date" />
              </Field>
              <div className="sm:col-span-3">
                <SubmitButton>حفظ الوزن</SubmitButton>
              </div>
            </form>

            <form action={createWaterAction} className="grid gap-4 sm:grid-cols-3">
              <Field label="كمية المياه بالمل">
                <input className="input" name="amount_ml" type="number" defaultValue={250} min="0" />
              </Field>
              <Field label="التاريخ">
                <input className="input" name="logged_at" type="date" />
              </Field>
              <div className="flex items-end">
                <SubmitButton>حفظ المياه</SubmitButton>
              </div>
            </form>

            <form id="workout-form" action={createWorkoutAction} className="grid gap-4 sm:grid-cols-2 scroll-mt-28">
              <Field label="نوع التمرين">
                <input className="input" name="workout_type" placeholder="مشي، جيم، كارديو" />
              </Field>
              <Field label="المدة بالدقائق">
                <input className="input" name="duration_minutes" type="number" min="0" />
              </Field>
              <Field label="السعرات">
                <input className="input" name="calories" type="number" min="0" />
              </Field>
              <Field label="المجهود">
                <select className="input" name="effort" defaultValue="متوسط">
                  <option>خفيف</option>
                  <option>متوسط</option>
                  <option>عالي</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <SubmitButton>حفظ التمرين</SubmitButton>
              </div>
            </form>
          </div>
        </FormCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SimpleList title="آخر الوجبات" rows={data.meals} primaryKey="name" secondaryKey="quality" empty="لا توجد وجبات بعد" />
        <SimpleList title="سجل الوزن" rows={data.weights} primaryKey="weight" secondaryKey="logged_at" empty="لا يوجد سجل وزن" />
        <SimpleList title="آخر التمارين" rows={data.workouts} primaryKey="workout_type" secondaryKey="effort" empty="لا توجد تمارين بعد" />
        <SimpleList title="النوم" rows={data.sleep} primaryKey="hours" secondaryKey="quality" empty="لم يتم تسجيل النوم بعد" />
      </section>
    </div>
  );
}
