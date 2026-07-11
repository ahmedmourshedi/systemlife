import Link from "next/link";
import { createExpenseAction, createIncomeAction, createTransferAction } from "@/app/actions";
import { AppIcon } from "@/components/icons";
import { MoneyList, SimpleList } from "@/components/record-list";
import { EmptyState, Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { expenseCategories, incomeCategories } from "@/lib/constants";
import { getFinanceData, getCurrentUserProfile } from "@/lib/data";
import { formatCurrency, sumBy, todayISO } from "@/lib/utils";

export const metadata = {
  title: "المال والمصروفات"
};

export default async function FinancePage() {
  const context = await getCurrentUserProfile();
  const currency = context?.profile.currency ?? "SAR";
  const data = await getFinanceData();
  const totalExpenses = sumBy(data.expenses, (row) => row.amount);
  const totalIncome = sumBy(data.incomes, (row) => row.amount);
  const availableCash = sumBy(data.accounts, (row) => row.available_balance ?? row.balance);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="النظام المالي"
        title="المال والمصروفات"
        description="سجل المصروف أو الدخل بأقل عدد حقول. التفاصيل المتقدمة موجودة فقط عند الحاجة."
        icon="wallet"
        action={
          <Link href="/app/quick-add?type=expense" className="btn-primary">
            <AppIcon name="bolt" className="h-5 w-5" />
            إضافة سريعة
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="مصروفات الشهر" value={formatCurrency(totalExpenses, currency)} icon="expense" />
        <StatCard title="دخل الشهر" value={formatCurrency(totalIncome, currency)} icon="coins" tone="good" />
        <StatCard title="صافي الشهر" value={formatCurrency(totalIncome - totalExpenses, currency)} icon="bank" tone={totalIncome - totalExpenses >= 0 ? "good" : "danger"} />
        <StatCard title="Available balance" value={formatCurrency(availableCash, currency)} icon="wallet" tone={availableCash >= 0 ? "good" : "warning"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <FormCard title="مصروف جديد" description="الأساسي فقط: العنوان، المبلغ، التصنيف. التاريخ اليوم والعملة من إعداداتك.">
          <form action={createExpenseAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="العنوان">
                <input className="input" name="title" placeholder="غداء، بنزين، اشتراك..." required />
              </Field>
              <Field label="المبلغ">
                <input className="input" name="amount" type="number" step="0.01" min="0.01" required />
              </Field>
              <Field label="التصنيف">
                <select className="input" name="category_name" defaultValue={expenseCategories[0]}>
                  {expenseCategories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="طريقة الدفع">
                <select className="input" name="payment_method" defaultValue="بطاقة">
                  <option>بطاقة</option>
                  <option>كاش</option>
                  <option>Apple Pay</option>
                  <option>تحويل</option>
                </select>
              </Field>
            </div>

            <details className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <summary className="cursor-pointer text-sm font-extrabold text-slate-700">تفاصيل متقدمة اختيارية</summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="الحساب">
                  <input className="input" name="account_name" defaultValue="الحساب الرئيسي" />
                </Field>
                <Field label="التاريخ">
                  <input className="input" name="spent_at" type="date" defaultValue={todayISO()} />
                </Field>
                <Field label="العملة">
                  <input className="input" name="currency" defaultValue={currency} />
                </Field>
                <Field label="ملاحظات">
                  <input className="input" name="notes" placeholder="اختياري" />
                </Field>
              </div>
            </details>

            <div className="sticky bottom-24 z-10 rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-premium backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <SubmitButton>حفظ المصروف</SubmitButton>
            </div>
          </form>
        </FormCard>

        <FormCard title="دخل جديد" description="سجل الراتب أو أي دخل إضافي بسرعة، والتفاصيل تظل اختيارية.">
          <form action={createIncomeAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="العنوان">
                <input className="input" name="title" placeholder="راتب، مشروع، عائد..." required />
              </Field>
              <Field label="المبلغ">
                <input className="input" name="amount" type="number" step="0.01" min="0.01" required />
              </Field>
              <Field label="التصنيف">
                <select className="input" name="category_name" defaultValue={incomeCategories[0]}>
                  {incomeCategories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="المصدر">
                <input className="input" name="source" defaultValue="غير محدد" />
              </Field>
            </div>

            <details className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <summary className="cursor-pointer text-sm font-extrabold text-slate-700">تفاصيل متقدمة اختيارية</summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="الحساب">
                  <input className="input" name="account_name" defaultValue="الحساب الرئيسي" />
                </Field>
                <Field label="تاريخ الاستلام">
                  <input className="input" name="received_at" type="date" defaultValue={todayISO()} />
                </Field>
                <Field label="العملة">
                  <input className="input" name="currency" defaultValue={currency} />
                </Field>
                <Field label="ملاحظات">
                  <input className="input" name="notes" placeholder="اختياري" />
                </Field>
              </div>
            </details>

            <div className="sticky bottom-24 z-10 rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-premium backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <SubmitButton>حفظ الدخل</SubmitButton>
            </div>
          </form>
        </FormCard>
      </section>

      <FormCard title="Account transfer" description="Move money between two accounts atomically. Transfers are not counted as income or expenses.">
        {data.accounts.length < 2 ? (
          <EmptyState title="At least two accounts are required" description="Create another account before recording a transfer." />
        ) : (
          <form action={createTransferAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="From account">
                <select className="input" name="source_account_id" required>
                  {data.accounts.map((account) => (
                    <option key={String(account.id)} value={String(account.id)}>
                      {String(account.name ?? "")}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="To account">
                <select className="input" name="destination_account_id" required defaultValue={String(data.accounts[1]?.id ?? "")}>
                  {data.accounts.map((account) => (
                    <option key={String(account.id)} value={String(account.id)}>
                      {String(account.name ?? "")}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Amount">
                <input className="input" name="amount" type="number" step="0.01" min="0.01" required />
              </Field>
              <Field label="Date">
                <input className="input" name="transfer_at" type="date" defaultValue={todayISO()} />
              </Field>
              <Field label="Fee">
                <input className="input" name="fee" type="number" step="0.01" min="0" defaultValue="0" />
              </Field>
              <Field label="Currency">
                <input className="input" name="currency" defaultValue={currency} />
              </Field>
              <Field label="Notes" className="sm:col-span-2">
                <input className="input" name="notes" placeholder="Optional" />
              </Field>
            </div>
            <SubmitButton>Save transfer</SubmitButton>
          </form>
        )}
      </FormCard>

      <section className="grid gap-6 xl:grid-cols-2">
        <MoneyList title="مصروفات الشهر" rows={data.expenses} amountKey="amount" dateKey="spent_at" />
        <MoneyList title="دخل الشهر" rows={data.incomes} amountKey="amount" dateKey="received_at" />
        <MoneyList title="Unified financial transactions" rows={data.transactions} amountKey="amount" dateKey="transaction_date" />
        <MoneyList title="Monthly transfers" rows={data.transfers.map((row) => ({ ...row, title: "Account transfer" }))} amountKey="amount" dateKey="transfer_at" />
        <SimpleList title="الحسابات النشطة" rows={data.accounts} primaryKey="name" secondaryKey="kind" empty="لا توجد حسابات بعد" />
        <SimpleList title="الاشتراكات القادمة" rows={data.subscriptions} primaryKey="name" secondaryKey="next_payment_at" empty="لا توجد اشتراكات نشطة" />
      </section>
    </div>
  );
}
