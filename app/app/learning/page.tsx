import { createCourseAction, createLessonAction } from "@/app/actions";
import { ProgressList, SimpleList } from "@/components/record-list";
import { Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { priorities, statuses } from "@/lib/constants";
import { getLearningData } from "@/lib/data";
import { formatNumber, progress } from "@/lib/utils";

export const metadata = {
  title: "الكورسات والتعلم"
};

export default async function LearningPage() {
  const data = await getLearningData();
  const activeCourses = data.courses.filter((row) => row.status === "جاري").length;
  const completedCourses = data.courses.filter((row) => row.status === "مكتمل").length;
  const averageProgress =
    data.courses.length === 0
      ? 0
      : data.courses.reduce((total, row) => total + progress(row.completed_lessons, row.total_lessons), 0) / data.courses.length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="نظام التعلم"
        title="الكورسات والتعلم"
        description="تابع الكورسات التي أخذتها، التي تدرسها الآن، وما يجب أن تطبقه عمليًا بعد كل درس."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="كورسات جارية" value={formatNumber(activeCourses)} icon="graduation" />
        <StatCard title="كورسات مكتملة" value={formatNumber(completedCourses)} icon="award" tone="good" />
        <StatCard title="متوسط التقدم" value={`${Math.round(averageProgress)}%`} icon="trend" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <FormCard title="إضافة كورس" description="سجل الكورس، المجال، المنصة، عدد الدروس وخطة الانتهاء.">
          <form action={createCourseAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="اسم الكورس">
              <input className="input" name="title" required placeholder="مثال: Performance Testing with k6" />
            </Field>
            <Field label="المنصة">
              <input className="input" name="provider" placeholder="Udemy، YouTube، Coursera" />
            </Field>
            <Field label="المجال">
              <input className="input" name="field" placeholder="Software Testing، AppSheet..." />
            </Field>
            <Field label="الحالة">
              <select className="input" name="status" defaultValue="جاري">
                {statuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="الأولوية">
              <select className="input" name="priority" defaultValue="متوسطة">
                {priorities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="عدد الدروس">
              <input className="input" name="total_lessons" type="number" min="0" />
            </Field>
            <Field label="دروس منتهية">
              <input className="input" name="completed_lessons" type="number" min="0" />
            </Field>
            <Field label="تاريخ الانتهاء المتوقع">
              <input className="input" name="target_end_date" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="ملاحظات وتطبيق عملي">
                <textarea className="input min-h-28" name="notes" placeholder="ماذا ستطبق بعد الكورس؟" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ الكورس</SubmitButton>
            </div>
          </form>
        </FormCard>

        <FormCard title="تسجيل درس" description="اربط الدرس بكورس واكتب ما تعلمته وما طبقته.">
          <form action={createLessonAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="الكورس">
              <select className="input" name="course_id" required>
                <option value="">اختر كورس</option>
                {data.courses.map((course) => <option key={String(course.id)} value={String(course.id)}>{String(course.title)}</option>)}
              </select>
            </Field>
            <Field label="اسم الدرس">
              <input className="input" name="title" required placeholder="عنوان الدرس" />
            </Field>
            <Field label="الحالة">
              <select className="input" name="status" defaultValue="مكتمل">
                <option>جاري</option>
                <option>مكتمل</option>
                <option>يحتاج مراجعة</option>
              </select>
            </Field>
            <Field label="المدة بالدقائق">
              <input className="input" name="duration_minutes" type="number" min="0" />
            </Field>
            <Field label="تاريخ الإكمال">
              <input className="input" name="completed_at" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="ملاحظات">
                <textarea className="input min-h-28" name="notes" placeholder="ملخص، روابط، تطبيق عملي" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ الدرس</SubmitButton>
            </div>
          </form>
        </FormCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ProgressList title="قائمة الكورسات" rows={data.courses} currentKey="completed_lessons" totalKey="total_lessons" />
        <SimpleList title="آخر الدروس" rows={data.lessons} primaryKey="title" secondaryKey="status" empty="لا توجد دروس بعد" />
      </section>
    </div>
  );
}
