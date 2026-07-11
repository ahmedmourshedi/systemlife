import { createDebtAction, recordDebtRepaymentAction } from "@/app/actions";
import { MoneyList } from "@/components/record-list";
import { EmptyState, Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { getCurrentUserProfile, getDebtData } from "@/lib/data";
import type { Row } from "@/lib/types";
import { formatCurrency, formatDate, safeText, sumBy, todayISO, toNumber } from "@/lib/utils";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  const context = await getCurrentUserProfile();
  const currency = context?.profile.currency ?? "SAR";
  const data = await getDebtData();
  const openDebts = data.debts.filter((debt) => safeText(debt.status, "") !== "مدفوع");
  const totalDebt = sumBy(openDebts, (debt) => debt.total_amount);
  const totalPaid = sumBy(openDebts, (debt) => debt.paid_amount);
  const remaining = totalDebt - totalPaid;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="إدارة مالية"
        title="الديون والسلف"
        description="سجل الدين مرة واحدة بدون تغيير الرصيد، ثم سجل السداد الفعلي من حسابك أو إليه."
        icon="receipt"
      />

      {params.message ? <div className="rounded-[1.25rem] border border-teal-200 bg-teal-50 p-4 text-sm font-extrabold text-teal-800">{params.message}</div> : null}
      {params.error ? <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm font-extrabold text-rose-700">{params.error}</div> : null}
      {data.error ? (
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-900">
          شغل Migration الديون أولًا: <span className="font-extrabold">database/migrations/002_debt_repayments.sql</span>
          <p className="mt-1 text-xs text-amber-700">{data.error}</p>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="الديون المفتوحة" value={openDebts.length} icon="receipt" />
        <StatCard title="إجمالي الأصل" value={formatCurrency(totalDebt, currency)} icon="wallet" />
        <StatCard title="المسدد" value={formatCurrency(totalPaid, currency)} icon="checkCircle" tone="good" />
        <StatCard title="المتبقي" value={formatCurrency(remaining, currency)} icon="alert" tone={remaining > 0 ? "warning" : "good"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <FormCard title="إضافة دين أو سلفة" description="لا يغير هذا النموذج رصيد الحساب؛ هو فقط يثبت أصل الدين والمتبقي.">
          <form action={createDebtAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="العنوان">
                <input className="input" name="title" placeholder="قسط، سلفة، فاتورة..." required />
              </Field>
              <Field label="الطرف">
                <input className="input" name="party" placeholder="اسم الشخص أو الجهة" />
              </Field>
              <Field label="النوع">
                <select className="input" name="debt_type" defaultValue="عليّ">
                  <option>عليّ</option>
                  <option>لي</option>
                  <option>قسط</option>
                  <option>فاتورة</option>
                </select>
              </Field>
              <Field label="المبلغ الأصلي">
                <input className="input" name="total_amount" type="number" step="0.01" min="0.01" required />
              </Field>
              <Field label="مدفوع سابقًا">
                <input className="input" name="paid_amount" type="number" step="0.01" min="0" defaultValue="0" />
              </Field>
              <Field label="العملة">
                <input className="input" name="currency" defaultValue={currency} />
              </Field>
              <Field label="تاريخ الدين">
                <input className="input" name="debt_date" type="date" defaultValue={todayISO()} />
              </Field>
              <Field label="تاريخ الاستحقاق">
                <input className="input" name="due_date" type="date" />
              </Field>
              <Field label="ملاحظات" className="sm:col-span-2">
                <textarea className="input min-h-24" name="notes" placeholder="اختياري" />
              </Field>
            </div>
            <SubmitButton>حفظ الدين</SubmitButton>
          </form>
        </FormCard>

        <FormCard title="تسجيل دفعة سداد" description="السداد هو الحركة المالية الفعلية: يزيد الرصيد إذا كان المال لك، وينقص الرصيد إذا كان الدين عليك.">
          {openDebts.length === 0 || data.accounts.length === 0 ? (
            <EmptyState title="لا يوجد دين مفتوح أو حساب نشط" description="أضف دينًا وحسابًا ماليًا قبل تسجيل السداد." />
          ) : (
            <form action={recordDebtRepaymentAction} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="الدين">
                  <select className="input" name="debt_id" required>
                    {openDebts.map((debt) => (
                      <option key={String(debt.id)} value={String(debt.id)}>
                        {safeText(debt.title)} - متبقي {formatCurrency(toNumber(debt.total_amount) - toNumber(debt.paid_amount), String(debt.currency ?? currency))}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="الحساب">
                  <select className="input" name="account_id" required>
                    {data.accounts.map((account) => (
                      <option key={String(account.id)} value={String(account.id)}>
                        {safeText(account.name)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="المبلغ">
                  <input className="input" name="amount" type="number" step="0.01" min="0.01" required />
                </Field>
                <Field label="تاريخ السداد">
                  <input className="input" name="paid_at" type="date" defaultValue={todayISO()} />
                </Field>
                <Field label="العملة">
                  <input className="input" name="currency" defaultValue={currency} />
                </Field>
                <Field label="ملاحظات">
                  <input className="input" name="notes" placeholder="اختياري" />
                </Field>
              </div>
              <SubmitButton>تسجيل السداد</SubmitButton>
            </form>
          )}
        </FormCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DebtCards debts={data.debts} currency={currency} />
        <MoneyList title="سجل السداد" rows={data.repayments.map(formatRepaymentRow)} amountKey="amount" dateKey="paid_at" />
      </section>
    </div>
  );
}

function DebtCards({ debts, currency }: { debts: Row[]; currency: string }) {
  if (!debts.length) {
    return <EmptyState title="لا توجد ديون بعد" description="ابدأ بإضافة أول دين أو سلفة من النموذج." />;
  }

  return (
    <section className="card-premium">
      <h2 className="mb-5 text-xl font-extrabold text-slate-950 sm:text-2xl">الديون الحالية</h2>
      <div className="space-y-3">
        {debts.map((debt) => {
          const total = toNumber(debt.total_amount);
          const paid = toNumber(debt.paid_amount);
          const remaining = Math.max(0, total - paid);

          return (
            <article key={String(debt.id)} className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950">{safeText(debt.title)}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">{safeText(debt.party)} - {safeText(debt.debt_type)}</p>
                </div>
                <span className="pill">{safeText(debt.status)}</span>
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <DebtMetric label="الأصل" value={formatCurrency(total, String(debt.currency ?? currency))} />
                <DebtMetric label="المسدد" value={formatCurrency(paid, String(debt.currency ?? currency))} />
                <DebtMetric label="المتبقي" value={formatCurrency(remaining, String(debt.currency ?? currency))} />
              </dl>
              <p className="mt-3 text-xs font-bold text-slate-500">استحقاق: {formatDate(String(debt.due_date ?? ""))}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DebtMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      <dt className="text-[11px] font-extrabold text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-extrabold text-slate-800">{value}</dd>
    </div>
  );
}

function formatRepaymentRow(row: Row) {
  const debt = row.debt as Row | null | undefined;
  const account = row.account as Row | null | undefined;

  return {
    ...row,
    title: `${safeText(debt?.title, "سداد دين")} - ${safeText(account?.name, "حساب")}`
  };
}
