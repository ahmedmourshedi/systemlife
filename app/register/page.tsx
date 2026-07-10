import Link from "next/link";
import { signUpAction } from "@/app/actions";
import { AppIcon, BrandMark } from "@/components/icons";

type SearchParams = Record<string, string | string[] | undefined>;

function param(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const error = param(params, "error");

  return (
    <main className="grid min-h-screen place-items-center px-3 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-premium backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-4 sm:p-8 lg:p-10">
          <div className="mb-8 text-center lg:text-right">
            <BrandMark className="mx-auto mb-4 h-16 w-16 lg:mx-0" />
            <p className="mb-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-800">بداية النظام</p>
            <h1 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">إنشاء حساب</h1>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">ابدأ نظامك الشخصي ببياناتك الخاصة في مكان واحد محمي ومنظم.</p>
          </div>

          {error ? <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div> : null}

          <form action={signUpAction} className="space-y-4">
            <label className="block">
              <span className="label">الاسم الكامل</span>
              <input className="input" name="full_name" required placeholder="اكتب اسمك" />
            </label>
            <label className="block">
              <span className="label">البريد الإلكتروني</span>
              <input className="input" type="email" name="email" required placeholder="you@example.com" />
            </label>
            <label className="block">
              <span className="label">كلمة المرور</span>
              <input className="input" type="password" name="password" required minLength={6} placeholder="6 أحرف على الأقل" />
            </label>
            <button className="btn-primary w-full">إنشاء الحساب</button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            لديك حساب؟{" "}
            <Link href="/login" className="font-extrabold text-teal-700 hover:text-teal-900">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        <div className="relative hidden min-h-[38rem] overflow-hidden border-r border-slate-200 bg-gradient-to-br from-sky-50 via-teal-50 to-amber-50 p-8 lg:block">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-teal-200/50 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <h2 className="max-w-md text-5xl font-extrabold leading-tight text-slate-950">ابنِ نسختك الشخصية من Life OS.</h2>
              <p className="mt-5 max-w-lg text-base font-medium leading-8 text-slate-600">
                حساب واحد يكفي لإدارة يومك ومالك وصحتك وأهدافك، مع أدوات صيانة بسيطة لمراقبة جودة النظام ونسخه الاحتياطي.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "تسجيل يومي سريع",
                "إدارة أهداف ومهام",
                "تقارير مالية وصحية",
                "واجهة عربية RTL"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm font-extrabold text-slate-700 shadow-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100"><AppIcon name="check" className="h-4 w-4" /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
