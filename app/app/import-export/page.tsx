import Link from "next/link";
import { MegaModulePage } from "@/components/mega/module-page";
import { FormCard } from "@/components/ui";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="space-y-8">
      <FormCard title="تصدير سريع" description="نزّل نسخة JSON من بيانات الوحدات المتقدمة الخاصة بك. التصدير يعتمد على صلاحيات Supabase وRLS.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary" href="/api/export" target="_blank">تحميل نسخة JSON</Link>
          <Link className="btn-secondary" href="/api/health" target="_blank">فحص صحة التطبيق</Link>
        </div>
      </FormCard>
      <MegaModulePage moduleKey="importExport" message={params.message} error={params.error} />
    </div>
  );
}
