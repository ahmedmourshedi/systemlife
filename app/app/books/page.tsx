import { createBookAction, createReadingLogAction } from "@/app/actions";
import { ProgressList, SimpleList } from "@/components/record-list";
import { Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { priorities } from "@/lib/constants";
import { getBooksData } from "@/lib/data";
import { formatNumber, progress, sumBy } from "@/lib/utils";

export const metadata = {
  title: "الكتب والقراءة"
};

export default async function BooksPage() {
  const data = await getBooksData();
  const activeBooks = data.books.filter((row) => row.status === "أقرأ الآن").length;
  const completedBooks = data.books.filter((row) => row.status === "مكتمل").length;
  const pagesRead = sumBy(data.readingLogs, (row) => row.pages_read);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="نظام القراءة"
        title="الكتب والقراءة"
        description="مكتبة شخصية للكتب التي قرأتها، التي تقرأها الآن، والكتب التي يجب أن تقرأها مع ملخصات وتطبيق عملي."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="أقرأ الآن" value={formatNumber(activeBooks)} icon="book" />
        <StatCard title="كتب مكتملة" value={formatNumber(completedBooks)} icon="flag" tone="good" />
        <StatCard title="صفحات مسجلة" value={formatNumber(pagesRead)} icon="pen" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <FormCard title="إضافة كتاب" description="أضف الكتاب وسبب قراءته وكيف ستطبقه في حياتك أو عملك.">
          <form action={createBookAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="اسم الكتاب">
              <input className="input" name="title" required placeholder="مثال: Explore It!" />
            </Field>
            <Field label="المؤلف">
              <input className="input" name="author" placeholder="اسم المؤلف" />
            </Field>
            <Field label="المجال">
              <input className="input" name="field" placeholder="اختبار برمجيات، مال، تطوير ذات..." />
            </Field>
            <Field label="الحالة">
              <select className="input" name="status" defaultValue="للقراءة">
                <option>للقراءة</option>
                <option>أقرأ الآن</option>
                <option>مكتمل</option>
                <option>متوقف</option>
                <option>مرجع مهم</option>
              </select>
            </Field>
            <Field label="الأولوية">
              <select className="input" name="priority" defaultValue="متوسطة">
                {priorities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="عدد الصفحات">
              <input className="input" name="total_pages" type="number" min="0" />
            </Field>
            <Field label="الصفحة الحالية">
              <input className="input" name="current_page" type="number" min="0" />
            </Field>
            <Field label="تاريخ الانتهاء المتوقع">
              <input className="input" name="target_end_date" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="ملخص أولي">
                <textarea className="input min-h-24" name="summary" placeholder="أهم الأفكار أو سبب القراءة" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="كيف أطبقه؟">
                <textarea className="input min-h-24" name="apply_notes" placeholder="كيف ستطبق أفكار الكتاب؟" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ الكتاب</SubmitButton>
            </div>
          </form>
        </FormCard>

        <FormCard title="تسجيل قراءة" description="سجل عدد الصفحات والمدة وملاحظات الجلسة.">
          <form action={createReadingLogAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="الكتاب">
              <select className="input" name="book_id" required>
                <option value="">اختر كتاب</option>
                {data.books.map((book) => <option key={String(book.id)} value={String(book.id)}>{String(book.title)}</option>)}
              </select>
            </Field>
            <Field label="الصفحات المقروءة">
              <input className="input" name="pages_read" type="number" min="0" required />
            </Field>
            <Field label="المدة بالدقائق">
              <input className="input" name="minutes" type="number" min="0" />
            </Field>
            <Field label="التاريخ">
              <input className="input" name="read_at" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="ملاحظات">
                <textarea className="input min-h-28" name="notes" placeholder="اقتباس، فكرة، تطبيق عملي" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ القراءة</SubmitButton>
            </div>
          </form>
        </FormCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ProgressList title="مكتبة الكتب" rows={data.books} currentKey="current_page" totalKey="total_pages" />
        <SimpleList title="سجل القراءة" rows={data.readingLogs} primaryKey="notes" secondaryKey="read_at" empty="لا يوجد سجل قراءة بعد" />
      </section>
    </div>
  );
}
