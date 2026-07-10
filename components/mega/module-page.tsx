import Link from "next/link";
import { createGenericRecordAction, deleteGenericRecordAction } from "@/app/actions";
import { AppIcon } from "@/components/icons";
import { EmptyState, Field, FormCard, SectionHeader, StatCard, SubmitButton } from "@/components/ui";
import { getModuleRecords } from "@/lib/mega/data";
import { getModuleConfig, type ModuleConfig, type ModuleField, type ModuleKey } from "@/lib/mega/module-registry";
import type { Row } from "@/lib/types";
import { cn, formatNumber, safeText, toNumber } from "@/lib/utils";

function defaultInputValue(field: ModuleField) {
  if (typeof field.defaultValue === "boolean") return field.defaultValue ? "true" : "false";
  if (field.defaultValue === undefined || field.defaultValue === null) return "";
  return String(field.defaultValue);
}

function renderField(field: ModuleField) {
  const common = {
    name: field.name,
    required: field.required,
    placeholder: field.placeholder,
    defaultValue: defaultInputValue(field),
    min: field.min,
    max: field.max,
    step: field.step
  };

  if (field.type === "textarea") {
    return <textarea className="input min-h-32" {...common} />;
  }

  if (field.type === "select") {
    return (
      <select className="input" name={field.name} required={field.required} defaultValue={defaultInputValue(field)}>
        <option value="">اختر...</option>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700">
        <input name={field.name} type="checkbox" defaultChecked={Boolean(field.defaultValue)} className="h-5 w-5 accent-teal-600" />
        <span>{field.placeholder ?? "نعم"}</span>
      </label>
    );
  }

  return <input className="input" type={field.type} {...common} />;
}

function FieldGrid({ config }: { config: ModuleConfig }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="module_key" value={config.key} />
      {config.fields.map((field) => (
        <Field key={field.name} label={field.label} className={cn(field.full ? "md:col-span-2" : "")}>
          {renderField(field)}
        </Field>
      ))}
    </div>
  );
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return formatNumber(value);
  if (typeof value === "boolean") return value ? "نعم" : "لا";
  if (typeof value === "string") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return (
        <Link className="text-teal-700 underline underline-offset-4 hover:text-teal-900" href={value} target="_blank">
          فتح الرابط
        </Link>
      );
    }
    if (value.length > 90) return `${value.slice(0, 90)}...`;
    return value;
  }
  return JSON.stringify(value);
}

function RecordCards({ config, records }: { config: ModuleConfig; records: Row[] }) {
  if (!records.length) {
    return <EmptyState title="لا توجد سجلات بعد" description="ابدأ بإضافة أول سجل من النموذج الموجود في هذه الصفحة." />;
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <article key={String(record.id)} className="rounded-[1.45rem] border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <AppIcon name={config.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-teal-700">{config.shortTitle}</p>
                <h3 className="mt-1 truncate text-lg font-extrabold text-slate-950">
                  {safeText((record.title ?? record.name ?? record.full_name ?? record.item_name ?? record.destination) as string, "سجل")}
                </h3>
              </div>
            </div>
            <form action={deleteGenericRecordAction}>
              <input type="hidden" name="module_key" value={config.key} />
              <input type="hidden" name="record_id" value={String(record.id)} />
              <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
                حذف
              </button>
            </form>
          </div>
          <dl className="grid gap-3 md:grid-cols-2">
            {config.listFields.map((fieldName) => (
              <div key={fieldName} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                <dt className="text-[11px] font-extrabold text-slate-400">{config.listLabels?.[fieldName] ?? fieldName}</dt>
                <dd className="mt-1 text-sm font-bold text-slate-800">{formatValue(record[fieldName])}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

function DataQualityNotice({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
      <p className="font-extrabold">تنبيه قاعدة بيانات</p>
      <p className="mt-1">قد تكون جداول هذه الوحدة غير منشأة بعد. شغل ملف database/schema.sql كاملًا داخل Supabase، ثم أعد تحميل الصفحة.</p>
      <p className="mt-2 text-xs text-amber-700">تفاصيل تقنية: {error}</p>
    </div>
  );
}

export async function MegaModulePage({
  moduleKey,
  message,
  error
}: {
  moduleKey: ModuleKey;
  message?: string;
  error?: string;
}) {
  const config = getModuleConfig(moduleKey);
  const data = await getModuleRecords(moduleKey);

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="وحدة متقدمة" title={config.title} description={config.description} icon={config.icon} />

      {message ? <div className="rounded-[1.25rem] border border-teal-200 bg-teal-50 p-4 text-sm font-extrabold text-teal-800">{message}</div> : null}
      {error ? <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm font-extrabold text-rose-700">{error}</div> : null}
      <DataQualityNotice error={data.error} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="إجمالي السجلات" value={formatNumber(data.count)} icon={config.icon} />
        {data.stats.slice(0, 2).map((stat) => (
          <StatCard key={stat.label} title={stat.label} value={formatNumber(toNumber(stat.value))} icon="pin" />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.4fr)]">
        <FormCard title={config.formTitle} description={config.formDescription}>
          <form action={createGenericRecordAction} className="space-y-5">
            <FieldGrid config={config} />
            <SubmitButton>حفظ في {config.shortTitle}</SubmitButton>
          </form>
        </FormCard>

        <section className="card">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">آخر السجلات</h2>
              <p className="mt-2 text-sm font-medium leading-7 text-slate-600">عرض سريع لأحدث البيانات داخل هذه الوحدة.</p>
            </div>
            <span className="pill">{formatNumber(data.records.length)} معروض</span>
          </div>
          <RecordCards config={config} records={data.records} />
        </section>
      </section>
    </div>
  );
}
