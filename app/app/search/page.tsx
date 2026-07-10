import Link from "next/link";
import { AppIcon } from "@/components/icons";
import { EmptyState, Field, FormCard, SectionHeader } from "@/components/ui";
import { getSearchSnapshot } from "@/lib/mega/data";
import { safeText } from "@/lib/utils";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const results = await getSearchSnapshot(q);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="بحث موحد"
        title="البحث داخل نظام حياتك"
        description="ابحث في الوحدات المتقدمة مثل الأفكار، المشاريع، الوثائق، السفر، العلاقات، المراجعات، والالتقاط السريع."
        icon="search"
      />

      <FormCard title="ابحث عن أي شيء" description="اكتب كلمة أو رقم أو جزء من ملاحظة وستظهر النتائج من جميع الوحدات المتقدمة.">
        <form className="grid gap-4 md:grid-cols-[1fr_auto]" action="/app/search">
          <Field label="كلمة البحث">
            <input className="input" name="q" defaultValue={q} placeholder="مثال: كورس، فاتورة، مشروع، قراءة" />
          </Field>
          <div className="flex items-end">
            <button className="btn-primary w-full md:w-auto">بحث</button>
          </div>
        </form>
      </FormCard>

      <section className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-950">النتائج</h2>
          <span className="pill">{results.length} نتيجة</span>
        </div>
        {!q ? <EmptyState title="ابدأ بكتابة كلمة بحث" description="البحث لا يعمل إلا بعد إدخال كلمة واحدة على الأقل." /> : null}
        {q && !results.length ? <EmptyState title="لا توجد نتائج" description="جرب كلمة أقصر أو راجع أن الجداول تم إنشاؤها في Supabase." /> : null}
        <div className="space-y-3">
          {results.map((item, index) => (
            <Link key={`${item.moduleKey}-${index}`} href={item.href} className="block rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <AppIcon name={item.icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-teal-700">{item.title}</p>
                  <h3 className="mt-1 truncate font-extrabold text-slate-950">{safeText((item.row.title ?? item.row.name ?? item.row.full_name ?? item.row.item_name) as string, "سجل مطابق")}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-500">{item.matchedText}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
