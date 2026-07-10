import { AppIcon } from "@/components/icons";
import { getBooksData, getDashboardData, getFinanceData, getGoalsData, getHealthData, getInvestmentsData, getLearningData, getCurrentUserProfile } from "@/lib/data";
import { getMegaOverview } from "@/lib/mega/data";
import { SectionHeader, StatCard } from "@/components/ui";
import { formatCurrency, formatNumber, progress, sumBy } from "@/lib/utils";

export const metadata = {
  title: "التقارير"
};

export default async function ReportsPage() {
  const context = await getCurrentUserProfile();
  const currency = context?.profile.currency ?? "SAR";

  const [dashboard, finance, health, learning, books, goals, investments, megaModules] = await Promise.all([
    getDashboardData(),
    getFinanceData(),
    getHealthData(),
    getLearningData(),
    getBooksData(),
    getGoalsData(),
    getInvestmentsData(),
    getMegaOverview()
  ]);

  const totalCalories = sumBy(health.meals, (row) => row.calories);
  const totalProtein = sumBy(health.meals, (row) => row.protein);
  const totalLessons = sumBy(learning.courses, (row) => row.total_lessons);
  const completedLessons = sumBy(learning.courses, (row) => row.completed_lessons);
  const totalPages = sumBy(books.books, (row) => row.total_pages);
  const currentPages = sumBy(books.books, (row) => row.current_page);
  const invested = sumBy(investments.investments, (row) => row.amount_invested);
  const currentValue = sumBy(investments.investments, (row) => row.current_value);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="تحليل شامل"
        title="التقارير"
        description="هذه الصفحة تجمع مؤشرات المال، الصحة، التعلم، القراءة، الأهداف والاستثمار في مكان واحد."
        icon="chart"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="مصروفات الشهر" value={formatCurrency(dashboard.summary.monthlyExpenses, currency)} icon="expense" />
        <StatCard title="دخل الشهر" value={formatCurrency(dashboard.summary.monthlyIncome, currency)} icon="coins" tone="good" />
        <StatCard title="صافي الادخار" value={formatCurrency(dashboard.summary.monthlySavings, currency)} icon="bank" tone={dashboard.summary.monthlySavings >= 0 ? "good" : "danger"} />
        <StatCard title="عدد الحسابات" value={formatNumber(finance.accounts.length)} icon="wallet" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="إجمالي السعرات المسجلة" value={formatNumber(totalCalories)} icon="flame" />
        <StatCard title="إجمالي البروتين" value={`${formatNumber(totalProtein)} جرام`} icon="protein" />
        <StatCard title="سجل الوزن" value={formatNumber(health.weights.length)} icon="scale" />
        <StatCard title="التمارين المسجلة" value={formatNumber(health.workouts.length)} icon="run" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="تقدم الكورسات" value={`${Math.round(progress(completedLessons, totalLessons))}%`} icon="graduation" />
        <StatCard title="الدروس المكتملة" value={`${formatNumber(completedLessons)} / ${formatNumber(totalLessons)}`} icon="checkCircle" />
        <StatCard title="تقدم القراءة" value={`${Math.round(progress(currentPages, totalPages))}%`} icon="book" />
        <StatCard title="جلسات القراءة" value={formatNumber(books.readingLogs.length)} icon="pen" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="الأهداف النشطة" value={formatNumber(goals.goals.filter((row) => row.status !== "مكتمل").length)} icon="target" />
        <StatCard title="المهام المرتبطة بالأهداف" value={formatNumber(goals.tasks.length)} icon="puzzle" />
        <StatCard title="قيمة الاستثمار" value={formatCurrency(currentValue, currency)} icon="trend" tone="good" />
        <StatCard title="نتيجة الاستثمار" value={formatCurrency(currentValue - invested, currency)} icon="scale" tone={currentValue - invested >= 0 ? "good" : "danger"} />
      </section>

      <section className="card">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">مؤشرات وحدات Mega</h2>
            <p className="mt-2 text-sm font-medium text-slate-600">نظرة سريعة على السجلات داخل الوحدات المتقدمة الجديدة.</p>
          </div>
          <span className="pill">{formatNumber(megaModules.length)} وحدة</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {megaModules.slice(0, 12).map((module) => (
            <div key={module.key} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 font-bold text-slate-950">
                  <AppIcon name={module.icon} className="h-5 w-5 shrink-0 text-teal-700" />
                  <span className="truncate">{module.title}</span>
                </span>
                <span className="pill">{formatNumber(module.count)}</span>
              </div>
              {module.error ? <p className="mt-2 text-xs text-amber-700">يحتاج تشغيل الجداول</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-extrabold text-slate-950">قراءة سريعة للمال</h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            إذا كان صافي الادخار موجبًا فأنت تسير في اتجاه جيد. راقب أعلى التصنيفات صرفًا داخل صفحة المال وابدأ بخفض بند واحد فقط كل شهر.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-extrabold text-slate-950">قراءة سريعة للصحة</h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            قوة هذا النظام تظهر بعد أسبوعين من التسجيل المستمر؛ ستبدأ في رؤية العلاقة بين الأكل، المياه، النوم، الوزن والتمارين.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-extrabold text-slate-950">قراءة سريعة للتعلم</h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            لا تجعل الكورسات مجرد مشاهدة. استخدم حقل الملاحظات والتطبيق العملي لتحويل كل درس إلى تجربة حقيقية.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-extrabold text-slate-950">قراءة سريعة للأهداف</h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            الهدف بدون مهمة يتحول إلى أمنية. اربط كل هدف بثلاث مهام على الأقل، وراجعها في نهاية كل شهر.
          </p>
        </div>
      </section>
    </div>
  );
}
