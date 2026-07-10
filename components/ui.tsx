import Link from "next/link";
import { AppIcon, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  icon
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: IconName;
}) {
  return (
    <header className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 shadow-premium backdrop-blur-xl sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-teal-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {icon ? (
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 text-teal-700 ring-1 ring-teal-100">
                <AppIcon name={icon} className="h-6 w-6" />
              </span>
            ) : null}
            {eyebrow ? (
              <p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-800 shadow-inner-soft sm:text-sm">
                {eyebrow}
              </p>
            ) : null}
          </div>
          <h1 className="max-w-5xl text-balance text-2xl font-extrabold tracking-tight text-slate-950 xs:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-4xl text-sm font-medium leading-7 text-slate-600 sm:text-base sm:leading-8">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="relative shrink-0 [&>*]:w-full sm:[&>*]:w-auto">{action}</div> : null}
      </div>
    </header>
  );
}

export function StatCard({
  title,
  value,
  description,
  icon,
  tone = "default"
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: IconName;
  tone?: "default" | "good" | "warning" | "danger";
}) {
  const toneClass = {
    default: "border-slate-200 bg-white/90",
    good: "border-emerald-200 bg-emerald-50/75",
    warning: "border-amber-200 bg-amber-50/75",
    danger: "border-rose-200 bg-rose-50/75"
  }[tone];

  const iconClass = {
    default: "bg-sky-50 text-sky-700 ring-sky-100",
    good: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    warning: "bg-amber-50 text-amber-700 ring-amber-100",
    danger: "bg-rose-50 text-rose-700 ring-rose-100"
  }[tone];

  return (
    <article className={cn("group relative min-w-0 overflow-hidden rounded-[1.55rem] border p-4 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-premium sm:p-5", toneClass)}>
      <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-teal-100/50 blur-2xl transition group-hover:bg-sky-100/70" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold text-slate-500 sm:text-sm">{title}</p>
          <p className="mt-3 break-words text-2xl font-extrabold text-slate-950 sm:text-3xl">{value}</p>
        </div>
        {icon ? (
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-inner-soft ring-1 sm:h-12 sm:w-12", iconClass)}>
            <AppIcon name={icon} className="h-6 w-6" />
          </div>
        ) : null}
      </div>
      {description ? <p className="relative mt-4 text-xs font-medium leading-6 text-slate-500 sm:text-sm sm:leading-7">{description}</p> : null}
    </article>
  );
}

export function FormCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-premium">
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-1 h-9 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-teal-500 to-sky-600" />
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">{title}</h2>
          {description ? <p className="mt-2 text-sm font-medium leading-7 text-slate-600">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-slate-300 bg-slate-50/75 p-6 text-center sm:p-8">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
        <AppIcon name="empty" className="h-6 w-6" />
      </div>
      <p className="text-lg font-extrabold text-slate-950">{title}</p>
      {description ? <p className="mt-2 text-sm font-medium leading-7 text-slate-500">{description}</p> : null}
    </div>
  );
}

export function ProgressBar({
  value,
  label
}: {
  value: number;
  label?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-slate-500">
        <span>{label ?? "التقدم"}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 shadow-inner-soft">
        <div className="h-full rounded-full bg-gradient-to-l from-teal-500 to-sky-600" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

export function QuickLink({
  href,
  icon,
  title,
  description
}: {
  href: string;
  icon: IconName;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group block min-h-full rounded-[1.55rem] border border-slate-200 bg-white/90 p-4 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:border-teal-200 hover:bg-white hover:shadow-premium sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 text-teal-700 shadow-inner-soft ring-1 ring-teal-100 transition group-hover:scale-105 group-hover:text-sky-700">
          <AppIcon name={icon} className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="font-extrabold text-slate-950 sm:text-lg">{title}</h3>
          <p className="mt-2 text-sm font-medium leading-7 text-slate-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function Field({
  label,
  children,
  className
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block min-w-0", className)}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function SubmitButton({ children = "حفظ" }: { children?: React.ReactNode }) {
  return <button className="btn-primary w-full">{children}</button>;
}
