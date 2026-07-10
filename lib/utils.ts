export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function toNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function sumBy<T>(items: T[], selector: (item: T) => unknown) {
  return items.reduce((total, item) => total + toNumber(selector(item)), 0);
}

export function formatCurrency(value: unknown, currency = "SAR") {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(toNumber(value));
}

export function formatNumber(value: unknown) {
  return new Intl.NumberFormat("ar-SA").format(toNumber(value));
}

export function formatPercent(value: unknown) {
  return `${new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 1 }).format(toNumber(value))}%`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "غير محدد";
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function monthStartISO() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

export function progress(current: unknown, total: unknown) {
  const totalNumber = toNumber(total);
  if (totalNumber <= 0) return 0;
  const currentNumber = toNumber(current);
  return Math.min(100, Math.max(0, (currentNumber / totalNumber) * 100));
}

export function safeText(value: unknown, fallback = "غير محدد") {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number" && Number.isFinite(value)) return formatNumber(value);
  if (typeof value === "boolean") return value ? "نعم" : "لا";
  return fallback;
}
