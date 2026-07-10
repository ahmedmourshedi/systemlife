import Link from "next/link";
import { AppIcon } from "@/components/icons";
import { getAdminData } from "@/lib/data";
import { getAdminMegaOverview } from "@/lib/mega/data";
import { SectionHeader, StatCard } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const metadata = {
  title: "إدارة النظام"
};

export default async function AdminHomePage() {
  const [data, modules] = await Promise.all([getAdminData(), getAdminMegaOverview()]);
  const activeGoals = data.goals.filter((goal) => goal.status !== "مكتمل").length;
  const openTasks = data.tasks.filter((task) => task.status !== "مكتملة").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="إدارة شخصية"
        title="إدارة النظام"
        description="مكان مختصر لصيانة نظامك الشخصي: جودة البيانات، القوالب، النسخ الاحتياطي، سجل التدقيق، والأمان."
        icon="shield"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="الحسابات الشخصية" value={formatNumber(data.profiles.length)} icon="user" />
        <StatCard title="دخل النظام هذا الشهر" value={formatCurrency(data.monthlyIncome)} icon="coins" tone="good" />
        <StatCard title="مصروفات النظام هذا الشهر" value={formatCurrency(data.monthlyExpenses)} icon="expense" />
        <StatCard title="مهام مفتوحة" value={formatNumber(openTasks)} icon="checkCircle" />
        <StatCard title="أهداف نشطة" value={formatNumber(activeGoals)} icon="target" />
        <StatCard title="كورسات مسجلة" value={formatNumber(data.courses.length)} icon="graduation" />
        <StatCard title="كتب مسجلة" value={formatNumber(data.books.length)} icon="book" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <Link key={module.key} href={module.href} className="card block transition hover:-translate-y-1 hover:border-teal-200">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <AppIcon name={module.icon} className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-slate-950">{module.title}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{module.description}</p>
                <p className="mt-3 text-xs font-bold text-teal-700">{module.count} سجل</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Link href="/admin/settings" className="card block transition hover:-translate-y-1 hover:border-teal-200">
          <h2 className="text-xl font-extrabold text-slate-950">إعدادات النظام</h2>
          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">قائمة فحص التشغيل، البيئة، قاعدة البيانات، والنشر على Vercel.</p>
        </Link>
        <Link href="/app/import-export" className="card block transition hover:-translate-y-1 hover:border-teal-200">
          <h2 className="text-xl font-extrabold text-slate-950">التصدير والاستيراد</h2>
          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">تنزيل نسخة JSON، تجهيز CSV، وفحص صحة التطبيق.</p>
        </Link>
      </section>
    </div>
  );
}
