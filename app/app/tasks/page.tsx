import { createHabitAction, createHabitLogAction, createTaskAction, toggleTaskAction } from "@/app/actions";
import Link from "next/link";
import { AppIcon } from "@/components/icons";
import { SimpleList } from "@/components/record-list";
import { EmptyState, Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { priorities } from "@/lib/constants";
import { getTasksData } from "@/lib/data";
import { formatDate, formatNumber, safeText } from "@/lib/utils";

export const metadata = {
  title: "المهام والعادات"
};

export default async function TasksPage() {
  const data = await getTasksData();
  const openTasks = data.tasks.filter((row) => row.status !== "مكتملة").length;
  const completedTasks = data.tasks.filter((row) => row.status === "مكتملة").length;
  const habitsDoneToday = data.habitLogs.filter((row) => row.status === "تم").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="إدارة اليوم"
        title="المهام والعادات"
        description="حول أهدافك إلى مهام، وحول نواياك اليومية إلى عادات قابلة للقياس."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/app/quick-add?type=task" className="btn-secondary justify-center">
          <AppIcon name="bolt" className="h-5 w-5" />
          مهمة سريعة
        </Link>
        <a href="#task-form" className="btn-secondary justify-center">
          <AppIcon name="checkCircle" className="h-5 w-5" />
          مهمة بتفاصيل
        </a>
        <a href="#habit-form" className="btn-secondary justify-center">
          <AppIcon name="flame" className="h-5 w-5" />
          عادة جديدة
        </a>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="مهام مفتوحة" value={formatNumber(openTasks)} icon="pin" />
        <StatCard title="مهام مكتملة" value={formatNumber(completedTasks)} icon="checkCircle" tone="good" />
        <StatCard title="عادات منفذة اليوم" value={formatNumber(habitsDoneToday)} icon="flame" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <FormCard title="إضافة مهمة" description="مهمة قصيرة، واضحة، ولها تاريخ إنجاز إن أمكن.">
          <form id="task-form" action={createTaskAction} className="grid gap-4 sm:grid-cols-2 scroll-mt-28">
            <Field label="عنوان المهمة">
              <input className="input" name="title" required placeholder="ماذا يجب أن تنجز؟" />
            </Field>
            <Field label="الأولوية">
              <select className="input" name="priority" defaultValue="متوسطة">
                {priorities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="الحالة">
              <select className="input" name="status" defaultValue="جديدة">
                <option>جديدة</option>
                <option>جاري العمل</option>
                <option>مكتملة</option>
                <option>مؤجلة</option>
              </select>
            </Field>
            <Field label="تاريخ الاستحقاق">
              <input className="input" name="due_date" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="ملاحظات">
                <textarea className="input min-h-24" name="notes" placeholder="تفاصيل اختيارية" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ المهمة</SubmitButton>
            </div>
          </form>
        </FormCard>

        <FormCard title="إضافة عادة وتسجيلها" description="يمكنك إضافة عادة ثم تسجيل تنفيذها اليومي.">
          <div className="space-y-6">
            <form id="habit-form" action={createHabitAction} className="grid gap-4 sm:grid-cols-2 scroll-mt-28">
              <Field label="اسم العادة">
                <input className="input" name="title" required placeholder="قراءة، مشي، مياه..." />
              </Field>
              <Field label="التكرار">
                <select className="input" name="frequency" defaultValue="يومي">
                  <option>يومي</option>
                  <option>أسبوعي</option>
                  <option>شهري</option>
                </select>
              </Field>
              <Field label="الهدف">
                <input className="input" name="target_value" type="number" defaultValue={1} min="0" />
              </Field>
              <Field label="الوحدة">
                <input className="input" name="unit" defaultValue="مرة" />
              </Field>
              <div className="sm:col-span-2">
                <SubmitButton>إضافة العادة</SubmitButton>
              </div>
            </form>

            <form action={createHabitLogAction} className="grid gap-4 sm:grid-cols-2">
              <Field label="العادة">
                <select className="input" name="habit_id" required>
                  <option value="">اختر عادة</option>
                  {data.habits.map((habit) => <option key={String(habit.id)} value={String(habit.id)}>{String(habit.title)}</option>)}
                </select>
              </Field>
              <Field label="القيمة">
                <input className="input" name="value" type="number" defaultValue={1} min="0" />
              </Field>
              <Field label="الحالة">
                <select className="input" name="status" defaultValue="تم">
                  <option>تم</option>
                  <option>جزئي</option>
                  <option>لم يتم</option>
                </select>
              </Field>
              <Field label="التاريخ">
                <input className="input" name="logged_at" type="date" />
              </Field>
              <div className="sm:col-span-2">
                <SubmitButton>تسجيل العادة</SubmitButton>
              </div>
            </form>
          </div>
        </FormCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="card">
          <h2 className="mb-5 text-xl font-extrabold text-slate-950">قائمة المهام</h2>
          {data.tasks.length === 0 ? (
            <EmptyState title="لا توجد مهام بعد" />
          ) : (
            <div className="space-y-3">
              {data.tasks.map((task) => (
                <div key={String(task.id)} className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-950">{safeText(task.title)}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {safeText(task.priority)} • {safeText(task.status)} • {formatDate(String(task.due_date ?? ""))}
                      </p>
                    </div>
                    <form action={toggleTaskAction}>
                      <input type="hidden" name="task_id" value={String(task.id)} />
                      <input type="hidden" name="next_status" value={task.status === "مكتملة" ? "جاري العمل" : "مكتملة"} />
                      <button className="btn-secondary px-4 py-2 text-xs">
                        {task.status === "مكتملة" ? "إعادة فتح" : "إنهاء"}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <SimpleList title="عادات اليوم" rows={data.habitLogs} primaryKey="status" secondaryKey="logged_at" empty="لم تسجل عادات اليوم بعد" />
      </section>
    </div>
  );
}
