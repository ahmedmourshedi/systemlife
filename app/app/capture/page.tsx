import Link from "next/link";
import { createQuickAddAction } from "@/app/actions";
import { AppIcon } from "@/components/icons";
import { Field, FormCard, SectionHeader, SubmitButton } from "@/components/ui";
import { priorities } from "@/lib/constants";

export const metadata = {
  title: "التقاط سريع"
};

export default async function CapturePage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="التقاط دون تصنيف"
        title="التقاط سريع"
        description="اكتب أي فكرة أو مهمة أو قرار بسرعة. التصنيف الحقيقي يتم لاحقًا من صندوق المراجعة."
        icon="bolt"
        action={
          <Link href="/app/inbox" className="btn-secondary">
            <AppIcon name="inbox" className="h-5 w-5" />
            صندوق المراجعة
          </Link>
        }
      />

      <FormCard title="عنصر جديد للمراجعة" description="العنوان فقط يكفي. باقي الحقول اختيارية.">
        <form action={createQuickAddAction} className="space-y-5">
          <input type="hidden" name="entry_type" value="note" />
          <Field label="ما الذي تريد التقاطه؟">
            <input className="input text-lg font-bold" name="title" placeholder="مثال: راجع اشتراك النادي، فكرة تقرير، قرار شراء..." required autoFocus />
          </Field>

          <details className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-slate-700">تفاصيل اختيارية</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="النوع">
                <select className="input" name="item_type" defaultValue="ملاحظة">
                  <option>ملاحظة</option>
                  <option>فكرة</option>
                  <option>مهمة</option>
                  <option>مصروف</option>
                  <option>قرار</option>
                  <option>تعلم</option>
                  <option>رابط</option>
                </select>
              </Field>
              <Field label="المجال">
                <select className="input" name="area" defaultValue="شخصي">
                  <option>شخصي</option>
                  <option>مال</option>
                  <option>صحة</option>
                  <option>تعلم</option>
                  <option>عمل</option>
                  <option>بيت</option>
                  <option>علاقات</option>
                </select>
              </Field>
              <Field label="الأولوية">
                <select className="input" name="priority" defaultValue="متوسطة">
                  {priorities.map((priority) => <option key={priority}>{priority}</option>)}
                </select>
              </Field>
              <Field label="ملاحظات" className="md:col-span-2">
                <textarea className="input min-h-28" name="notes" placeholder="تفاصيل تساعدك عند المراجعة لاحقًا" />
              </Field>
            </div>
          </details>

          <div className="sticky bottom-24 z-10 rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-premium backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <SubmitButton>حفظ في صندوق المراجعة</SubmitButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
