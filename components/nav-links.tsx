"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AppIcon } from "@/components/icons";
import { navigationItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { NavigationItem, PersonalPreferences, UserRole } from "@/lib/types";

const groupOrder = ["الرئيسية", "المال", "الصحة والبيت", "الإنتاجية", "التعلم والعمل", "العلاقات والسفر", "النظام", "الإدارة"];
const primaryMobileHrefs = ["/app", "/app/quick-add", "/app/planner", "/app/finance"];

const hiddenByPreference: Array<{ key: keyof PersonalPreferences; hrefs: string[] }> = [
  { key: "show_health", hrefs: ["/app/health", "/app/mood"] },
  { key: "show_investments", hrefs: ["/app/investments", "/app/savings", "/app/assets"] },
  { key: "show_learning", hrefs: ["/app/learning", "/app/skills", "/app/certificates"] },
  { key: "show_books", hrefs: ["/app/books"] },
  { key: "show_relationships", hrefs: ["/app/people", "/app/relationships"] },
  { key: "show_travel", hrefs: ["/app/travel", "/app/documents"] },
  { key: "show_home", hrefs: ["/app/inventory", "/app/recipes", "/app/meal-plan", "/app/grocery"] }
];

function getVisibleItems(role: UserRole, preferences?: PersonalPreferences) {
  const hidden = new Set<string>();

  if (preferences) {
    hiddenByPreference.forEach((setting) => {
      if (preferences[setting.key] === false) {
        setting.hrefs.forEach((href) => hidden.add(href));
      }
    });
  }

  return navigationItems.filter((item) => (!item.adminOnly || role === "admin") && !hidden.has(item.href));
}

function isActive(pathname: string, item: NavigationItem) {
  return pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
}

function groupItems(items: NavigationItem[]) {
  const knownGroups = new Set(groupOrder);
  const groups = groupOrder
    .map((group) => ({ group, items: items.filter((item) => item.group === group) }))
    .filter((group) => group.items.length > 0);
  const otherItems = items.filter((item) => !knownGroups.has(item.group));

  if (otherItems.length > 0) {
    groups.push({ group: "أخرى", items: otherItems });
  }

  return groups;
}

export function NavLinks({ role, preferences }: { role: UserRole; preferences?: PersonalPreferences }) {
  const pathname = usePathname();
  const groups = useMemo(() => groupItems(getVisibleItems(role, preferences)), [role, preferences]);

  return (
    <nav className="space-y-6 pb-3">
      {groups.map(({ group, items }) => (
        <section key={group} className="space-y-2">
          <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{group}</p>
          <div className="space-y-1.5">
            {items.map((item) => {
              const active = isActive(pathname, item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-extrabold transition",
                    active
                      ? "bg-gradient-to-l from-teal-600 via-sky-600 to-cyan-600 text-white shadow-brand"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  )}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition", active ? "bg-white/20 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200 group-hover:text-teal-700")} aria-hidden>
                    <AppIcon name={item.icon} className="h-[1.125rem] w-[1.125rem]" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}

export function MobileNavLinks({ role, preferences }: { role: UserRole; preferences?: PersonalPreferences }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visibleItems = useMemo(() => getVisibleItems(role, preferences), [role, preferences]);
  const primaryItems = primaryMobileHrefs
    .map((href) => visibleItems.find((item) => item.href === href))
    .filter((item): item is NavigationItem => Boolean(item));
  const groups = useMemo(() => groupItems(visibleItems), [visibleItems]);
  const primaryActive = primaryItems.some((item) => isActive(pathname, item));

  return (
    <>
      <Link
        href="/app/quick-add"
        className="fixed bottom-24 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-sky-600 text-white shadow-brand ring-4 ring-white/80 transition hover:scale-105 lg:hidden"
        aria-label="إضافة سريعة"
      >
        <AppIcon name="bolt" className="h-7 w-7" />
      </Link>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-[1.55rem] border border-slate-200 bg-white/95 p-2 shadow-premium backdrop-blur-2xl lg:hidden" style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}>
        {primaryItems.map((item) => {
          const active = isActive(pathname, item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-extrabold transition",
                active ? "bg-gradient-to-b from-teal-600 to-sky-600 text-white shadow-brand" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              )}
            >
              <AppIcon name={item.icon} className="h-5 w-5" />
              <span className="max-w-full truncate">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-extrabold transition",
            !primaryActive ? "bg-teal-50 text-teal-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
          )}
          aria-label="فتح القائمة الكاملة"
          aria-expanded={open}
        >
          <AppIcon name="menu" className="h-5 w-5" />
          <span>القائمة</span>
        </button>
      </nav>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" type="button" aria-label="إغلاق القائمة" onClick={() => setOpen(false)} />
          <section className="mobile-sheet absolute inset-x-0 bottom-0 max-h-[86vh] overflow-hidden rounded-t-[2rem] border-t border-slate-200 bg-white/96 shadow-premium backdrop-blur-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 p-4 backdrop-blur">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-extrabold text-slate-950">القائمة</p>
                  <p className="mt-1 text-xs text-slate-500">الوحدات مرتبة حسب المجال، وتظهر حسب إعداداتك.</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost h-11 w-11 px-0" aria-label="إغلاق">
                  <AppIcon name="close" className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(86vh-7.8rem)] overflow-y-auto px-4 py-5">
              <div className="space-y-6">
                {groups.map(({ group, items }) => (
                  <section key={group}>
                    <p className="mb-3 px-1 text-xs font-extrabold text-slate-400">{group}</p>
                    <div className="grid grid-cols-2 gap-2 xs:grid-cols-3">
                      {items.map((item) => {
                        const active = isActive(pathname, item);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex min-h-24 flex-col justify-between rounded-2xl border p-3 text-sm font-extrabold transition",
                              active
                                ? "border-teal-200 bg-gradient-to-br from-teal-50 to-sky-50 text-teal-900 shadow-sm"
                                : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-900"
                            )}
                          >
                            <AppIcon name={item.icon} className="h-6 w-6" />
                            <span className="leading-5">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
