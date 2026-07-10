import Link from "next/link";
import { getDashboardData, getCurrentUserProfile } from "@/lib/data";
import { getPersonalPreferences } from "@/lib/preferences";
import { formatCurrency, formatNumber, safeText } from "@/lib/utils";
import { ProgressList, SimpleList, MoneyList } from "@/components/record-list";
import { SectionHeader, StatCard } from "@/components/ui";
import { AppIcon, type IconName } from "@/components/icons";

export const metadata = {
  title: "مركز اليوم"
};

function QuickAction({
  href,
  icon,
  title,
  detail,
  tone = "teal"
}: {
  href: string;
  icon: IconName;
  title: string;
  detail: string;
  tone?: "teal" | "sky" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    teal: "border-teal-200 bg-teal-50/80 text-teal-900 hover:border-teal-300",
    sky: "border-sky-200 bg-sky-50/80 text-sky-900 hover:border-sky-300",
    emerald: "border-emerald-200 bg-emerald-50/80 text-emerald-900 hover:border-emerald-300",
    amber: "border-amber-200 bg-amber-50/80 text-amber-900 hover:border-amber-300",
    rose: "border-rose-200 bg-rose-50/80 text-rose-900 hover:border-rose-300"
  }[tone];

  const iconTones = {
    teal: "bg-white text-teal-700 ring-teal-100",
    sky: "bg-white text-sky-700 ring-sky-100",
    emerald: "bg-white text-emerald-700 ring-emerald-100",
    amber: "bg-white text-amber-700 ring-amber-100",
    rose: "bg-white text-rose-700 ring-rose-100"
  }[tone];

  return (
    <Link href={href} className={`group flex min-h-28 items-start gap-3 rounded-[1.35rem] border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft ${tones}`}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 transition group-hover:scale-105 ${iconTones}`}>
        <AppIcon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-base font-extrabold leading-6">{title}</span>
        <span className="mt-1 block text-xs font-bold leading-6 opacity-75">{detail}</span>
      </span>
    </Link>
  );
}

function AttentionItem({
  href,
  icon,
  title,
  detail,
  tone = "default"
}: {
  href: string;
  icon: IconName;
  title: string;
  detail: string;
  tone?: "default" | "warning" | "danger" | "good";
}) {
  const tones = {
    default: "border-slate-200 bg-white/85 text-slate-700",
    warning: "border-amber-200 bg-amber-50/80 text-amber-900",
    danger: "border-rose-200 bg-rose-50/80 text-rose-900",
    good: "border-emerald-200 bg-emerald-50/80 text-emerald-900"
  }[tone];

  const iconTones = {
    default: "bg-slate-50 text-slate-600 ring-slate-100",
    warning: "bg-white text-amber-700 ring-amber-100",
    danger: "bg-white text-rose-700 ring-rose-100",
    good: "bg-white text-emerald-700 ring-emerald-100"
  }[tone];

  return (
    <Link href={href} className={`flex items-start gap-3 rounded-[1.2rem] border p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white ${tones}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconTones}`}>
        <AppIcon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-extrabold">{title}</span>
        <span className="mt-1 block text-xs font-bold leading-6 opacity-75">{detail}</span>
      </span>
    </Link>
  );
}

function SetupNotice({ tableMissing, setupCompleted }: { tableMissing: boolean; setupCompleted: boolean }) {
  if (!tableMissing && setupCompleted) return null;

  return (
    <section className="rounded-[1.35rem] border border-amber-200 bg-amber-50/90 p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-amber-900">إعداد النظام الشخصي لم يكتمل بعد</p>
          <p className="mt-1 text-sm font-bold leading-7 text-amber-800">
            أكمل صفحة الإعداد لاختيار الوحدات التي تظهر في القائمة وضبط العملة وأهداف الصحة.
          </p>
          {tableMissing ? (
            <p className="mt-2 text-xs font-bold text-amber-700">
              شغل ملف database/personal-preferences.sql في Supabase حتى يتم حفظ الاختيارات.
            </p>
          ) : null}
        </div>
        <Link href="/app/setup" className="btn-secondary shrink-0 justify-center">
          <AppIcon name="settings" className="h-5 w-5" />
          إعداد نظامي
        </Link>
      </div>
    </section>
  );
}

export default async function AppHomePage() {
  const context = await getCurrentUserProfile();
  const { summary, recentExpenses, recentTasks, recentCourses, recentBooks } = await getDashboardData();
  const setupState = context ? await getPersonalPreferences(context.user.id) : null;
  const currency = context?.profile.currency ?? "SAR";
  const waterTarget = Number(context?.profile.daily_water_ml ?? 2500);
  const calorieTarget = Number(context?.profile.daily_calories ?? 2200);
  const waterProgress = waterTarget > 0 ? Math.round((summary.waterToday / waterTarget) * 100) : 0;
  const calorieProgress = calorieTarget > 0 ? Math.round((summary.todayCalories / calorieTarget) * 100) : 0;
  const needsWater = summary.waterToday === 0 || waterProgress < 60;
  const needsCalories = summary.todayCalories === 0;
  const manyOpenTasks = summary.openTasks >= 5;
  const spendingWatch = summary.monthlyIncome > 0 && summary.monthlyExpenses / summary.monthlyIncome >= 0.75;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="حسابي الشخصي"
        title={`أهلًا ${safeText(context?.profile.full_name, "بك")}`}
        description="هذه الصفحة تجمع أهم مؤشرات يومك وتضع الإدخال السريع والمتابعة اليومية في البداية حتى لا تضيع بين الوحدات."
      />

      {setupState ? <SetupNotice tableMissing={setupState.tableMissing} setupCompleted={setupState.preferences.setup_completed} /> : null}

      <section className="space-y-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold text-teal-700">إدخال سريع</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-950">ماذا تريد أن تسجل الآن؟</h2>
          </div>
          <Link href="/app/quick-add" className="btn-secondary">
            <AppIcon name="bolt" className="h-4 w-4" />
            فتح الإضافة السريعة
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <QuickAction href="/app/quick-add?type=expense" icon="receipt" title="مصروف" detail="مبلغ وتصنيف وحساب" tone="rose" />
          <QuickAction href="/app/quick-add?type=income" icon="coins" title="دخل" detail="راتب أو دخل إضافي" tone="emerald" />
          <QuickAction href="/app/quick-add?type=task" icon="checkCircle" title="مهمة" detail="شيء تريد إنجازه" tone="sky" />
          <QuickAction href="/app/quick-add?type=note" icon="bolt" title="ملاحظة" detail="فكرة أو رابط أو قرار" tone="teal" />
          <QuickAction href="/app/quick-add?type=water" icon="droplet" title="مياه" detail="تحديث شرب اليوم" tone="sky" />
          <QuickAction href="/app/quick-add?type=meal" icon="salad" title="وجبة" detail="سعرات أو وجبة سريعة" tone="amber" />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-slate-500">متابعة اليوم</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-950">يحتاج انتباهك</h2>
            </div>
            <AppIcon name="pin" className="h-6 w-6 text-teal-700" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {manyOpenTasks ? (
              <AttentionItem href="/app/tasks" icon="checkCircle" title="راجع المهام المفتوحة" detail={`${formatNumber(summary.openTasks)} مهام لم تكتمل بعد`} tone="warning" />
            ) : (
              <AttentionItem href="/app/tasks" icon="checkCircle" title="المهام تحت السيطرة" detail={`${formatNumber(summary.openTasks)} مهام مفتوحة فقط`} tone="good" />
            )}
            {needsWater ? (
              <AttentionItem href="/app/health" icon="droplet" title="سجل المياه" detail={`${formatNumber(summary.waterToday)} مل من هدف ${formatNumber(waterTarget)} مل`} tone="warning" />
            ) : (
              <AttentionItem href="/app/health" icon="droplet" title="تقدم جيد في المياه" detail={`${formatNumber(waterProgress)}% من هدف اليوم`} tone="good" />
            )}
            {needsCalories ? (
              <AttentionItem href="/app/health" icon="salad" title="لم تسجل وجبات اليوم" detail="أضف وجبة واحدة لتظهر مؤشرات الصحة" tone="default" />
            ) : (
              <AttentionItem href="/app/health" icon="salad" title="السعرات مسجلة" detail={`${formatNumber(calorieProgress)}% من هدف السعرات`} tone={calorieProgress > 115 ? "warning" : "good"} />
            )}
            {spendingWatch ? (
              <AttentionItem href="/app/finance" icon="wallet" title="راقب المصروفات" detail="المصروفات اقتربت من الدخل المسجل" tone="danger" />
            ) : (
              <AttentionItem href="/app/finance" icon="wallet" title="الوضع المالي واضح" detail={`صافي الادخار ${formatCurrency(summary.monthlySavings, currency)}`} tone={summary.monthlySavings >= 0 ? "good" : "warning"} />
            )}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-sky-50 p-4 shadow-soft sm:p-6">
          <p className="text-xs font-extrabold text-teal-700">بداية عملية</p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-950">أفضل 3 خطوات الآن</h2>
          <div className="mt-5 space-y-3">
            <Link href="/app/planner" className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-white/80 p-3 text-sm font-extrabold text-slate-800 transition hover:border-teal-200 hover:bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700">1</span>
              اكتب أهم 3 نتائج لليوم
            </Link>
            <Link href="/app/finance" className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-white/80 p-3 text-sm font-extrabold text-slate-800 transition hover:border-teal-200 hover:bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700">2</span>
              سجل آخر مصروف أو دخل
            </Link>
            <Link href="/app/tasks" className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-white/80 p-3 text-sm font-extrabold text-slate-800 transition hover:border-teal-200 hover:bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">3</span>
              أغلق مهمة واحدة فقط
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="مصروفات الشهر" value={formatCurrency(summary.monthlyExpenses, currency)} description="إجمالي المصروفات المسجلة منذ بداية الشهر." icon="expense" />
        <StatCard title="دخل الشهر" value={formatCurrency(summary.monthlyIncome, currency)} description="إجمالي الدخل المسجل منذ بداية الشهر." icon="coins" tone="good" />
        <StatCard title="صافي الادخار" value={formatCurrency(summary.monthlySavings, currency)} description="الدخل ناقص المصروفات لهذا الشهر." icon="bank" tone={summary.monthlySavings >= 0 ? "good" : "danger"} />
        <StatCard title="مصروفات اليوم" value={formatCurrency(summary.todayExpenses, currency)} description="ما تم تسجيله اليوم فقط." icon="receipt" />
        <StatCard title="سعرات اليوم" value={formatNumber(summary.todayCalories)} description="إجمالي السعرات المسجلة اليوم." icon="salad" />
        <StatCard title="مياه اليوم" value={`${formatNumber(summary.waterToday)} مل`} description="كمية المياه المسجلة اليوم." icon="droplet" />
        <StatCard title="المهام المفتوحة" value={formatNumber(summary.openTasks)} description="مهام لم تكتمل بعد." icon="checkCircle" tone={summary.openTasks > 8 ? "warning" : "default"} />
        <StatCard title="قيمة الاستثمار" value={formatCurrency(summary.investmentValue, currency)} description="القيمة الحالية المسجلة لمحفظتك." icon="trend" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <MoneyList title="آخر مصروفات الشهر" rows={recentExpenses} amountKey="amount" dateKey="spent_at" />
        <SimpleList title="أقرب المهام المفتوحة" rows={recentTasks} primaryKey="title" secondaryKey="priority" empty="لا توجد مهام مفتوحة" />
        <ProgressList title="الكورسات الجارية" rows={recentCourses} currentKey="completed_lessons" totalKey="total_lessons" />
        <ProgressList title="الكتب الحالية" rows={recentBooks} currentKey="current_page" totalKey="total_pages" />
      </section>
    </div>
  );
}
