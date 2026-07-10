"use client";

import { useMemo, useState } from "react";
import { createQuickAddAction } from "@/app/actions";
import { AppIcon, type IconName } from "@/components/icons";
import { Field, SubmitButton } from "@/components/ui";
import { expenseCategories, incomeCategories, mealTypes, priorities } from "@/lib/constants";

type EntryType = "expense" | "income" | "task" | "note" | "water" | "meal";
type Suggestions = {
  expenseCategories: string[];
  incomeCategories: string[];
  accounts: string[];
};

const entryTypes: Array<{ value: EntryType; label: string; icon: IconName; hint: string }> = [
  { value: "expense", label: "مصروف", icon: "receipt", hint: "مبلغ خرج من حسابك" },
  { value: "income", label: "دخل", icon: "coins", hint: "راتب أو دخل إضافي" },
  { value: "task", label: "مهمة", icon: "checkCircle", hint: "شيء تريد إنجازه" },
  { value: "note", label: "ملاحظة", icon: "bolt", hint: "فكرة أو رابط أو قرار" },
  { value: "water", label: "مياه", icon: "droplet", hint: "كمية شرب اليوم" },
  { value: "meal", label: "وجبة", icon: "salad", hint: "وجبة وسعرات" }
];

const noteTypes = ["ملاحظة", "فكرة", "مهمة", "رابط", "قرار", "تعلم"];
const areas = ["شخصي", "مال", "صحة", "تعلم", "عمل", "علاقات", "بيت", "سفر"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultTitle(type: EntryType) {
  const titles: Record<EntryType, string> = {
    expense: "",
    income: "",
    task: "",
    note: "",
    water: "مياه",
    meal: ""
  };
  return titles[type];
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function SuggestionChips({ values, onPick }: { values: string[]; onPick: (value: string) => void }) {
  if (!values.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onPick(value)}
          className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-800 transition hover:border-teal-200 hover:bg-teal-100"
        >
          {value}
        </button>
      ))}
    </div>
  );
}

export function QuickAddForm({
  initialType = "expense",
  currency = "SAR",
  suggestions
}: {
  initialType?: EntryType;
  currency?: string;
  suggestions?: Suggestions;
}) {
  const [entryType, setEntryType] = useState<EntryType>(initialType);
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState(suggestions?.accounts[0] ?? "الحساب الرئيسي");
  const [paymentMethod, setPaymentMethod] = useState("بطاقة");
  const [source, setSource] = useState("غير محدد");

  const categories = useMemo(() => {
    const recent = entryType === "income" ? suggestions?.incomeCategories ?? [] : suggestions?.expenseCategories ?? [];
    const defaults = entryType === "income" ? incomeCategories : expenseCategories;
    return unique([...recent, ...defaults]);
  }, [entryType, suggestions]);

  const activeCategory = category || categories[0] || "عام";

  function switchType(type: EntryType) {
    setEntryType(type);
    setCategory("");
  }

  return (
    <form action={createQuickAddAction} className="space-y-6">
      <input type="hidden" name="entry_type" value={entryType} />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {entryTypes.map((type) => {
          const active = entryType === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => switchType(type.value)}
              className={`min-h-24 rounded-[1.25rem] border p-4 text-right shadow-sm transition hover:-translate-y-0.5 ${
                active ? "border-teal-300 bg-teal-50 text-teal-950 ring-4 ring-teal-500/10" : "border-slate-200 bg-white/85 text-slate-700 hover:border-teal-200 hover:bg-white"
              }`}
            >
              <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ${active ? "bg-white text-teal-700 ring-teal-100" : "bg-slate-50 text-slate-500 ring-slate-100"}`}>
                <AppIcon name={type.icon} className="h-5 w-5" />
              </span>
              <span className="block text-base font-extrabold">{type.label}</span>
              <span className="mt-1 block text-xs font-bold leading-6 opacity-70">{type.hint}</span>
            </button>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {entryType !== "water" ? (
          <Field label={entryType === "meal" ? "اسم الوجبة" : "العنوان"}>
            <input className="input" name="title" required defaultValue={defaultTitle(entryType)} placeholder={entryType === "expense" ? "مثال: قهوة، غداء، بنزين" : "اكتب عنوانًا واضحًا"} />
          </Field>
        ) : null}

        {(entryType === "expense" || entryType === "income") ? (
          <>
            <Field label="المبلغ">
              <input className="input" name="amount" type="number" min="0" step="0.01" required placeholder="0.00" />
            </Field>
            <Field label="التصنيف">
              <select className="input" name="category_name" value={activeCategory} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <SuggestionChips values={categories.slice(0, 5)} onPick={setCategory} />
            </Field>
            <Field label="الحساب">
              <input className="input" name="account_name" value={account} onChange={(event) => setAccount(event.target.value)} />
              <SuggestionChips values={suggestions?.accounts ?? []} onPick={setAccount} />
            </Field>
            <Field label={entryType === "expense" ? "طريقة الدفع" : "المصدر"}>
              {entryType === "expense" ? (
                <>
                  <input className="input" name="payment_method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} />
                  <SuggestionChips values={["بطاقة", "كاش", "Apple Pay", "تحويل"]} onPick={setPaymentMethod} />
                </>
              ) : (
                <input className="input" name="source" value={source} onChange={(event) => setSource(event.target.value)} />
              )}
            </Field>
          </>
        ) : null}

        {entryType === "task" || entryType === "note" ? (
          <>
            <Field label="الأولوية">
              <select className="input" name="priority" defaultValue="متوسطة">
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </Field>
            {entryType === "task" ? (
              <Field label="تاريخ الاستحقاق">
                <input className="input" name="due_date" type="date" />
              </Field>
            ) : (
              <Field label="النوع">
                <select className="input" name="item_type" defaultValue="ملاحظة">
                  {noteTypes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </Field>
            )}
          </>
        ) : null}

        {entryType === "water" ? (
          <>
            <Field label="كمية المياه بالمل">
              <input className="input" name="amount_ml" type="number" min="0" step="50" required defaultValue={250} />
            </Field>
            <Field label="التاريخ">
              <input className="input" name="date" type="date" defaultValue={todayISO()} />
            </Field>
          </>
        ) : null}

        {entryType === "meal" ? (
          <>
            <Field label="نوع الوجبة">
              <select className="input" name="meal_type" defaultValue="غداء">
                {mealTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </Field>
            <Field label="السعرات">
              <input className="input" name="calories" type="number" min="0" defaultValue={0} />
            </Field>
          </>
        ) : null}
      </section>

      <details className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
        <summary className="cursor-pointer text-sm font-extrabold text-slate-700">تفاصيل متقدمة اختيارية</summary>
        <section className="mt-4 grid gap-4 md:grid-cols-2">
          {(entryType === "expense" || entryType === "income") ? (
            <>
              <Field label="العملة">
                <input className="input" name="currency" defaultValue={currency} />
              </Field>
              <Field label="التاريخ">
                <input className="input" name="date" type="date" defaultValue={todayISO()} />
              </Field>
            </>
          ) : null}

          {entryType === "note" ? (
            <Field label="المجال">
              <select className="input" name="area" defaultValue="شخصي">
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </Field>
          ) : null}

          {entryType === "meal" ? (
            <>
              <Field label="البروتين">
                <input className="input" name="protein" type="number" min="0" defaultValue={0} />
              </Field>
              <Field label="الجودة">
                <select className="input" name="quality" defaultValue="جيد">
                  {["ممتاز", "جيد", "متوسط", "ضعيف"].map((quality) => (
                    <option key={quality} value={quality}>{quality}</option>
                  ))}
                </select>
              </Field>
            </>
          ) : null}

          <Field label="ملاحظات" className="md:col-span-2">
            <textarea className="input min-h-28" name="notes" placeholder="اختياري" />
          </Field>
        </section>
      </details>

      <div className="sticky bottom-24 z-10 rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-premium backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <SubmitButton>حفظ الإضافة السريعة</SubmitButton>
      </div>
    </form>
  );
}
