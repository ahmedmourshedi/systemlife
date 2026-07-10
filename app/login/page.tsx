import Link from "next/link";
import { signInAction } from "@/app/actions";
import { AppIcon, BrandMark } from "@/components/icons";

type SearchParams = Record<string, string | string[] | undefined>;

function param(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const error = param(params, "error");
  const message = param(params, "message");
  const next = param(params, "next") ?? "/app";

  return (
    <main className="grid min-h-screen place-items-center px-3 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-premium backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[38rem] overflow-hidden border-l border-slate-200 bg-gradient-to-br from-teal-50 via-sky-50 to-amber-50 p-8 lg:block">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl" />
          <div className="absolute -bottom-28 left-0 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <BrandMark className="mb-8 h-16 w-16" />
              <h1 className="max-w-md text-5xl font-extrabold leading-tight text-slate-950">منصة واحدة لإدارة حياتك بوضوح.</h1>
              <p className="mt-5 max-w-lg text-base font-medium leading-8 text-slate-600">
                مال، صحة، كورسات، كتب، أهداف، مهام، استثمار، علاقات، مراجعات وتقارير — كلها داخل PWA عربي متجاوب ومريح للعين.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["bolt", "إدخال سريع"],
                ["chart", "تقارير واضحة"],
                ["shield", "صلاحيات محمية"],
                ["phone", "تجربة جوال"]
              ].map(([icon, item]) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm font-extrabold text-slate-700 shadow-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100"><AppIcon name={icon} className="h-5 w-5" /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 lg:p-10">
          <div className="mb-8 text-center lg:text-right">
            <BrandMark className="mx-auto mb-4 h-16 w-16 lg:mx-0" />
            <p className="mb-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-800">مرحبًا بعودتك</p>
            <h1 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">تسجيل الدخول</h1>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">ادخل إلى لوحة التحكم الشخصية لإدارة كل جوانب حياتك.</p>
          </div>

          {error ? <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div> : null}
          {message ? <div className="mb-4 rounded-2xl border border-teal-200 bg-teal-50 p-3 text-sm font-bold text-teal-800">{message}</div> : null}

          <form action={signInAction} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="label">البريد الإلكتروني</span>
              <input className="input" type="email" name="email" required placeholder="you@example.com" />
            </label>
            <label className="block">
              <span className="label">كلمة المرور</span>
              <input className="input" type="password" name="password" required minLength={6} placeholder="••••••••" />
            </label>
            <button className="btn-primary w-full">دخول</button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-extrabold text-teal-700 hover:text-teal-900">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
