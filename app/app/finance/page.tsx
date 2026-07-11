import Link from "next/link";
import { createExpenseAction, createIncomeAction, createTransferAction, recordSubscriptionPaymentAction } from "@/app/actions";
import { AppIcon } from "@/components/icons";
import { MoneyList, SimpleList } from "@/components/record-list";
import { EmptyState, Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { expenseCategories, incomeCategories } from "@/lib/constants";
import { getFinanceData, getCurrentUserProfile } from "@/lib/data";
import type { Row } from "@/lib/types";
import { formatCurrency, formatDate, safeText, sumBy, todayISO, toNumber } from "@/lib/utils";

export const metadata = {
  title: "المال والمصروفات"
};

export default async function FinancePage({
  searchParams
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
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

      {params.message ? <div className="rounded-[1.25rem] border border-teal-200 bg-teal-50 p-4 text-sm font-extrabold text-teal-800">{params.message}</div> : null}
      {params.error ? <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm font-extrabold text-rose-700">{params.error}</div> : null}
      {data.error ? (
        <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-900">
          Some finance tables are not available yet. Run database/migrations/003_subscription_budget_planning.sql.
          <p className="mt-1 text-xs text-amber-700">{data.error}</p>
        </div>
      ) : null}

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
        <BudgetStatus budgets={data.budgets} expenses={data.budgetExpenses} currency={currency} />
        <SubscriptionPaymentForm subscriptions={data.subscriptions} accounts={data.accounts} currency={currency} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <MoneyList title="مصروفات الشهر" rows={data.expenses} amountKey="amount" dateKey="spent_at" />
        <MoneyList title="دخل الشهر" rows={data.incomes} amountKey="amount" dateKey="received_at" />
        <MoneyList title="Unified financial transactions" rows={data.transactions} amountKey="amount" dateKey="transaction_date" />
        <MoneyList title="Monthly transfers" rows={data.transfers.map((row) => ({ ...row, title: "Account transfer" }))} amountKey="amount" dateKey="transfer_at" />
        <MoneyList title="Subscription payments" rows={data.subscriptionPayments.map(formatSubscriptionPaymentRow)} amountKey="amount" dateKey="paid_at" />
        <SimpleList title="الحسابات النشطة" rows={data.accounts} primaryKey="name" secondaryKey="kind" empty="لا توجد حسابات بعد" />
        <SimpleList title="الاشتراكات القادمة" rows={data.subscriptions} primaryKey="name" secondaryKey="next_payment_at" empty="لا توجد اشتراكات نشطة" />
      </section>
    </div>
  );
}

function BudgetStatus({ budgets, expenses, currency }: { budgets: Row[]; expenses: Row[]; currency: string }) {
  if (!budgets.length) {
    return <EmptyState title="No budgets yet" description="Create monthly budgets to compare planned and actual spending." />;
  }

  return (
    <section className="card-premium">
      <h2 className="mb-5 text-xl font-extrabold text-slate-950 sm:text-2xl">Budget status</h2>
      <div className="space-y-3">
        {budgets.map((budget) => {
          const planned = toNumber(budget.planned_amount);
          const actual = sumBy(expenses.filter((expense) => expense.category_id === budget.category_id), (expense) => expense.amount);
          const percentage = planned > 0 ? Math.min(999, Math.round((actual / planned) * 100)) : 0;
          const remaining = planned - actual;

          return (
            <article key={String(budget.id)} className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-4 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-950">{safeText((budget.category as Row | undefined)?.name, "Budget")}</h3>
                  <p className="mt-1 text-xs font-bold text-slate-500">Month: {formatDate(String(budget.month ?? ""))}</p>
                </div>
                <span className={percentage >= toNumber(budget.warning_percentage, 80) ? "inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700 shadow-inner-soft" : "pill"}>{percentage}%</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <BudgetMetric label="Planned" value={formatCurrency(planned, currency)} />
                <BudgetMetric label="Actual" value={formatCurrency(actual, currency)} />
                <BudgetMetric label="Remaining" value={formatCurrency(remaining, currency)} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function BudgetMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      <dt className="text-[11px] font-extrabold text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-extrabold text-slate-800">{value}</dd>
    </div>
  );
}

function SubscriptionPaymentForm({ subscriptions, accounts, currency }: { subscriptions: Row[]; accounts: Row[]; currency: string }) {
  if (!subscriptions.length || !accounts.length) {
    return <EmptyState title="No active subscriptions or accounts" description="Add an active subscription and account before recording a payment." />;
  }

  return (
    <FormCard title="Pay subscription" description="Recording a subscription payment updates the account balance, expenses, unified transactions, and next payment date.">
      <form action={recordSubscriptionPaymentAction} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subscription">
            <select className="input" name="subscription_id" required>
              {subscriptions.map((subscription) => (
                <option key={String(subscription.id)} value={String(subscription.id)}>
                  {safeText(subscription.name)} - {formatCurrency(subscription.amount, String(subscription.currency ?? currency))}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Account">
            <select className="input" name="account_id" required>
              {accounts.map((account) => (
                <option key={String(account.id)} value={String(account.id)}>
                  {safeText(account.name)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Amount override">
            <input className="input" name="amount" type="number" step="0.01" min="0.01" placeholder="Use saved amount if empty" />
          </Field>
          <Field label="Paid at">
            <input className="input" name="paid_at" type="date" defaultValue={todayISO()} />
          </Field>
          <Field label="Currency">
            <input className="input" name="currency" defaultValue={currency} />
          </Field>
          <Field label="Notes">
            <input className="input" name="notes" placeholder="Optional" />
          </Field>
        </div>
        <SubmitButton>Record subscription payment</SubmitButton>
      </form>
    </FormCard>
  );
}

function formatSubscriptionPaymentRow(row: Row) {
  const subscription = row.subscription as Row | null | undefined;
  const account = row.account as Row | null | undefined;

  return {
    ...row,
    title: `${safeText(subscription?.name, "Subscription")} - ${safeText(account?.name, "Account")}`
  };
}
