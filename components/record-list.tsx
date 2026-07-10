import { EmptyState } from "@/components/ui";
import { formatCurrency, formatDate, progress, safeText } from "@/lib/utils";
import type { Row } from "@/lib/types";

export function MoneyList({
  title,
  rows,
  amountKey,
  dateKey
}: {
  title: string;
  rows: Row[];
  amountKey: string;
  dateKey: string;
}) {
  return (
    <section className="card-premium">
      <h2 className="mb-5 text-xl font-extrabold text-slate-950 sm:text-2xl">{title}</h2>
      {rows.length === 0 ? (
        <EmptyState title="لا توجد سجلات بعد" description="ابدأ بإضافة أول سجل من النموذج الموجود في الصفحة." />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={String(row.id)} className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-slate-950">{safeText(row.title)}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{formatDate(String(row[dateKey] ?? ""))}</p>
                </div>
                <p className="shrink-0 whitespace-nowrap font-extrabold text-teal-700">{formatCurrency(row[amountKey], String(row.currency ?? "SAR"))}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function SimpleList({
  title,
  rows,
  primaryKey = "title",
  secondaryKey,
  empty = "لا توجد سجلات بعد"
}: {
  title: string;
  rows: Row[];
  primaryKey?: string;
  secondaryKey?: string;
  empty?: string;
}) {
  return (
    <section className="card-premium">
      <h2 className="mb-5 text-xl font-extrabold text-slate-950 sm:text-2xl">{title}</h2>
      {rows.length === 0 ? (
        <EmptyState title={empty} />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={String(row.id)} className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50">
              <p className="truncate font-extrabold text-slate-950">{safeText(row[primaryKey])}</p>
              {secondaryKey ? <p className="mt-1 text-xs font-bold text-slate-500">{safeText(row[secondaryKey])}</p> : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProgressList({
  title,
  rows,
  currentKey,
  totalKey,
  primaryKey = "title"
}: {
  title: string;
  rows: Row[];
  currentKey: string;
  totalKey: string;
  primaryKey?: string;
}) {
  return (
    <section className="card-premium">
      <h2 className="mb-5 text-xl font-extrabold text-slate-950 sm:text-2xl">{title}</h2>
      {rows.length === 0 ? (
        <EmptyState title="لا توجد عناصر نشطة" />
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={String(row.id)} className="rounded-[1.25rem] border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50">
              <p className="mb-3 truncate font-extrabold text-slate-950">{safeText(row[primaryKey])}</p>
              <div>
                <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                  <span>التقدم</span>
                  <span>
                    {String(row[currentKey] ?? 0)} / {String(row[totalKey] ?? 0)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200 shadow-inner-soft">
                  <div className="h-2.5 rounded-full bg-gradient-to-l from-teal-500 to-sky-600" style={{ width: `${progress(row[currentKey], row[totalKey])}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
