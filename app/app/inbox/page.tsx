import { processInboxItemAction } from "@/app/actions";
import { AppIcon } from "@/components/icons";
import { EmptyState, Field, SectionHeader, SubmitButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/data";
import { expenseCategories, priorities } from "@/lib/constants";
import { formatDate, safeText } from "@/lib/utils";
import type { Row } from "@/lib/types";

export const metadata = {
  title: "صندوق المراجعة"
};

const activeStatuses = new Set(["جديد", "قيد المراجعة", "مؤجل", "", "undefined"]);

function ActionForm({
  item,
  actionType,
  label,
  children
}: {
  item: Row;
  actionType: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <form action={processInboxItemAction} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      <input type="hidden" name="item_id" value={String(item.id)} />
      <input type="hidden" name="action_type" value={actionType} />
      <input type="hidden" name="title" value={safeText(item.title)} />
      <input type="hidden" name="notes" value={safeText(item.notes)} />
      <input type="hidden" name="priority" value={safeText(item.priority, "متوسطة")} />
      <input type="hidden" name="area" value={safeText(item.area, "شخصي")} />
      {children}
      <button className="btn-secondary w-full justify-center px-4 py-2 text-xs">{label}</button>
    </form>
  );
}

export default async function InboxPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  const context = await getCurrentUserProfile();
  const currency = context?.profile.currency ?? "SAR";
  const supabase = await createClient();

  const { data } = await supabase
    .from("inbox_items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const items = ((data ?? []) as Row[]).filter((item) => {
    const status = safeText(item.processing_status);
    return activeStatuses.has(status) || !["مؤرشف", "تم التصنيف", "محذوف"].includes(status);
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Workflow"
        title="صندوق المراجعة"
        description="كل شيء التقطته بسرعة يظهر هنا. حوّله لمهمة أو هدف أو مصروف أو قرار، أو أرشفه إذا لم يعد مهمًا."
        icon="inbox"
      />

      {params.message ? <div className="rounded-[1.25rem] border border-teal-200 bg-teal-50 p-4 text-sm font-extrabold text-teal-800">{params.message}</div> : null}
      {params.error ? <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm font-extrabold text-rose-700">{params.error}</div> : null}

      {items.length === 0 ? (
        <EmptyState title="صندوق المراجعة فارغ" description="استخدم الإضافة السريعة أو الالتقاط السريع، ثم ارجع هنا لتصنيف العناصر." />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {items.map((item) => (
            <article key={String(item.id)} className="rounded-[1.55rem] border border-slate-200 bg-white/90 p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <AppIcon name="inbox" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-extrabold text-slate-950">{safeText(item.title)}</h2>
                  <p className="mt-2 text-xs font-bold leading-6 text-slate-500">
                    {safeText(item.item_type, "عنصر")} • {safeText(item.area, "شخصي")} • {safeText(item.priority, "متوسطة")} • {formatDate(String(item.created_at ?? ""))}
                  </p>
                  {item.notes ? <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{safeText(item.notes)}</p> : null}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <ActionForm item={item} actionType="task" label="تحويل إلى مهمة">
                  <Field label="تاريخ الاستحقاق">
                    <input className="input" name="due_date" type="date" />
                  </Field>
                </ActionForm>

                <ActionForm item={item} actionType="goal" label="تحويل إلى هدف">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="المستهدف">
                      <input className="input" name="target_value" type="number" defaultValue={100} min="0" />
                    </Field>
                    <Field label="الوحدة">
                      <input className="input" name="unit" defaultValue="%" />
                    </Field>
                  </div>
                </ActionForm>

                <ActionForm item={item} actionType="expense" label="تحويل إلى مصروف">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="المبلغ">
                      <input className="input" name="amount" type="number" min="0" step="0.01" required />
                    </Field>
                    <Field label="التصنيف">
                      <select className="input" name="category_name" defaultValue={expenseCategories[0]}>
                        {expenseCategories.map((category) => <option key={category}>{category}</option>)}
                      </select>
                    </Field>
                  </div>
                  <input type="hidden" name="currency" value={currency} />
                </ActionForm>

                <ActionForm item={item} actionType="decision" label="تحويل إلى قرار">
                  <Field label="درجة الثقة">
                    <input className="input" name="confidence_score" type="number" min="0" max="10" defaultValue={7} />
                  </Field>
                </ActionForm>

                <ActionForm item={item} actionType="archive" label="أرشفة">
                  <input type="hidden" name="decision" value="أرشفة" />
                </ActionForm>

                <form action={processInboxItemAction} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                  <input type="hidden" name="item_id" value={String(item.id)} />
                  <input type="hidden" name="action_type" value="task" />
                  <input type="hidden" name="title" value={safeText(item.title)} />
                  <Field label="أولوية سريعة">
                    <select className="input" name="priority" defaultValue={safeText(item.priority, "متوسطة")}>
                      {priorities.map((priority) => <option key={priority}>{priority}</option>)}
                    </select>
                  </Field>
                  <button className="btn-secondary mt-3 w-full justify-center px-4 py-2 text-xs">مهمة بأولوية</button>
                </form>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
