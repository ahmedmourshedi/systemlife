import { createInvestmentAction, createInvestmentTransactionAction } from "@/app/actions";
import { SimpleList } from "@/components/record-list";
import { EmptyState, Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { investmentTypes } from "@/lib/constants";
import { getCurrentUserProfile, getInvestmentsData } from "@/lib/data";
import { formatCurrency, formatNumber, safeText, sumBy, toNumber } from "@/lib/utils";

export const metadata = {
  title: "الاستثمار"
};

export default async function InvestmentsPage() {
  const context = await getCurrentUserProfile();
  const currency = context?.profile.currency ?? "SAR";
  const data = await getInvestmentsData();
  const totalInvested = sumBy(data.investments, (row) => row.amount_invested);
  const currentValue = sumBy(data.investments, (row) => row.current_value);
  const profitLoss = currentValue - totalInvested;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="محفظة الاستثمار"
        title="الاستثمار"
        description="سجل الاستثمارات يدويًا بدون حفظ أي كلمات مرور أو مفاتيح محافظ. هذا القسم للمتابعة والتحليل وليس لتنفيذ أوامر شراء."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="إجمالي المستثمر" value={formatCurrency(totalInvested, currency)} icon="bank" />
        <StatCard title="القيمة الحالية" value={formatCurrency(currentValue, currency)} icon="trend" tone="good" />
        <StatCard title="الربح أو الخسارة" value={formatCurrency(profitLoss, currency)} icon="scale" tone={profitLoss >= 0 ? "good" : "danger"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <FormCard title="إضافة أصل استثماري" description="أدخل الأصل، الكمية، سعر الشراء والقيمة الحالية يدويًا.">
          <form action={createInvestmentAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="اسم الأصل">
              <input className="input" name="asset_name" required placeholder="صندوق، سهم، ذهب..." />
            </Field>
            <Field label="نوع الأصل">
              <select className="input" name="asset_type" defaultValue="أسهم">
                {investmentTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="الرمز">
              <input className="input" name="symbol" placeholder="اختياري" />
            </Field>
            <Field label="الحساب أو المحفظة">
              <input className="input" name="account_name" defaultValue="محفظة الاستثمار" />
            </Field>
            <Field label="الكمية">
              <input className="input" name="quantity" type="number" step="0.0001" min="0" />
            </Field>
            <Field label="سعر الشراء">
              <input className="input" name="buy_price" type="number" step="0.01" min="0" />
            </Field>
            <Field label="المبلغ المستثمر">
              <input className="input" name="amount_invested" type="number" step="0.01" min="0" />
            </Field>
            <Field label="القيمة الحالية">
              <input className="input" name="current_value" type="number" step="0.01" min="0" />
            </Field>
            <Field label="السعر الحالي">
              <input className="input" name="current_price" type="number" step="0.01" min="0" />
            </Field>
            <Field label="مستوى المخاطرة">
              <select className="input" name="risk_level" defaultValue="متوسط">
                <option>منخفض</option>
                <option>متوسط</option>
                <option>عالي</option>
              </select>
            </Field>
            <Field label="العملة">
              <input className="input" name="currency" defaultValue={currency} />
            </Field>
            <Field label="تاريخ الشراء">
              <input className="input" name="purchased_at" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="ملاحظات">
                <textarea className="input min-h-24" name="notes" placeholder="سبب الشراء، الخطة، المخاطر" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ الاستثمار</SubmitButton>
            </div>
          </form>
        </FormCard>

        <FormCard title="تسجيل عملية استثمار" description="سجل شراء أو بيع أو توزيعات مرتبطة بأصل موجود.">
          <form action={createInvestmentTransactionAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="الأصل">
              <select className="input" name="investment_id" required>
                <option value="">اختر أصل</option>
                {data.investments.map((item) => <option key={String(item.id)} value={String(item.id)}>{String(item.asset_name)}</option>)}
              </select>
            </Field>
            <Field label="نوع العملية">
              <select className="input" name="transaction_type" defaultValue="شراء">
                <option>شراء</option>
                <option>بيع</option>
                <option>توزيع أرباح</option>
                <option>تعديل</option>
              </select>
            </Field>
            <Field label="الكمية">
              <input className="input" name="quantity" type="number" step="0.0001" min="0" />
            </Field>
            <Field label="السعر">
              <input className="input" name="price" type="number" step="0.01" min="0" />
            </Field>
            <Field label="الرسوم">
              <input className="input" name="fees" type="number" step="0.01" min="0" />
            </Field>
            <Field label="التاريخ">
              <input className="input" name="transaction_at" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <SubmitButton>حفظ العملية</SubmitButton>
            </div>
          </form>
        </FormCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="card">
          <h2 className="mb-5 text-xl font-extrabold text-slate-950">الأصول الاستثمارية</h2>
          {data.investments.length === 0 ? (
            <EmptyState title="لا توجد استثمارات بعد" />
          ) : (
            <div className="space-y-3">
              {data.investments.map((item) => {
                const itemProfit = toNumber(item.current_value) - toNumber(item.amount_invested);

                return (
                  <article key={String(item.id)} className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-slate-950">{safeText(item.asset_name)}</p>
                        <p className="mt-1 text-xs text-slate-500">{safeText(item.asset_type)} • {safeText(item.risk_level)}</p>
                      </div>
                      <span className="pill">{safeText(item.symbol, "بدون رمز")}</span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <p className="text-slate-500">المستثمر <span className="block font-bold text-slate-950">{formatCurrency(item.amount_invested, String(item.currency ?? currency))}</span></p>
                      <p className="text-slate-500">الحالي <span className="block font-bold text-slate-950">{formatCurrency(item.current_value, String(item.currency ?? currency))}</span></p>
                      <p className="text-slate-500">النتيجة <span className="block font-bold text-teal-700">{formatCurrency(itemProfit, String(item.currency ?? currency))}</span></p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <SimpleList title="آخر العمليات" rows={data.transactions} primaryKey="transaction_type" secondaryKey="transaction_at" empty="لا توجد عمليات بعد" />
      </section>
    </div>
  );
}
