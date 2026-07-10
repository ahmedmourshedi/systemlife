import { AppIcon } from "@/components/icons";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="card max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
          <AppIcon name="offline" className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950">أنت غير متصل بالإنترنت</h1>
        <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
          بعض الصفحات الأساسية متاحة، لكن مزامنة البيانات تحتاج اتصالًا بالإنترنت. ارجع للتطبيق بعد عودة الاتصال.
        </p>
      </section>
    </main>
  );
}
