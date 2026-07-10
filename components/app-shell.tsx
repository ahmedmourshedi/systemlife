import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { BrandMark, AppIcon } from "@/components/icons";
import { MobileNavLinks, NavLinks } from "@/components/nav-links";
import type { PersonalPreferences, Profile } from "@/lib/types";
import { safeText } from "@/lib/utils";

export function AppShell({
  profile,
  preferences,
  children
}: {
  profile: Profile;
  preferences?: PersonalPreferences;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bottom-safe lg:pb-0">
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-[18.5rem] border-l border-slate-200/90 bg-white/90 p-4 shadow-premium backdrop-blur-2xl lg:block 2xl:w-80">
        <Link href="/app" className="mb-6 flex items-center gap-3 rounded-[1.55rem] border border-slate-200 bg-white/85 p-3 shadow-sm transition hover:border-teal-200 hover:bg-white">
          <BrandMark className="h-12 w-12" />
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-slate-950">نظام حياتي</p>
            <p className="truncate text-xs font-bold text-slate-500">منصة إدارة الحياة الشخصية</p>
          </div>
        </Link>

        <div className="h-[calc(100vh-13.5rem)] overflow-y-auto pl-1 pr-0.5"><NavLinks role={profile.role} preferences={preferences} /></div>

        <div className="absolute bottom-4 left-4 right-4 rounded-[1.55rem] border border-slate-200 bg-white/90 p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-sm font-extrabold text-teal-700 ring-1 ring-teal-100">
              {safeText(profile.full_name, "م").slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-950">{safeText(profile.full_name, "مستخدم")}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{safeText(profile.email, "بدون بريد")}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="pill">حساب شخصي</span>
            <form action={signOutAction}>
              <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
                <AppIcon name="logout" className="h-4 w-4" />
                خروج
              </button>
            </form>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/90 px-3 py-3 shadow-sm backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/app" className="flex min-w-0 items-center gap-2 rounded-2xl px-1 py-1">
            <BrandMark className="h-10 w-10 rounded-2xl" />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-950">نظام حياتي</p>
              <p className="truncate text-[11px] font-bold text-slate-500">PWA عربي متجاوب</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-extrabold text-slate-600 xs:inline-flex">
              حساب شخصي
            </span>
            <form action={signOutAction}>
              <button className="btn-secondary min-h-10 px-3 py-2 text-xs">
                <AppIcon name="logout" className="h-4 w-4" />
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="lg:mr-[18.5rem] 2xl:mr-80">
        <div className="mx-auto max-w-[92rem] px-3 py-4 xs:px-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 2xl:px-10">{children}</div>
      </main>

      <MobileNavLinks role={profile.role} preferences={preferences} />
    </div>
  );
}
