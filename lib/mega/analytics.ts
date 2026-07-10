import type { Row } from "@/lib/types";
import { progress, sumBy, toNumber } from "@/lib/utils";

export function calculateSavingsRate(income: number, expenses: number) {
  if (income <= 0) return 0;
  return Math.round(((income - expenses) / income) * 100);
}

export function calculateRunwayMonths(cashBalance: number, monthlyExpenses: number) {
  if (monthlyExpenses <= 0) return 0;
  return Math.round((cashBalance / monthlyExpenses) * 10) / 10;
}

export function calculateGoalProgress(row: Row) {
  return progress(toNumber(row.current_value ?? row.current_amount ?? row.progress), toNumber(row.target_value ?? row.target_amount ?? 100));
}

export function calculateSkillGap(row: Row) {
  return Math.max(0, toNumber(row.target_level) - toNumber(row.current_level));
}

export function groupSumByField(rows: Row[], groupKey: string, valueKey: string) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = String(row[groupKey] ?? "غير محدد");
    map.set(key, (map.get(key) ?? 0) + toNumber(row[valueKey]));
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function buildLifeScore({
  savingsRate,
  healthScore,
  learningScore,
  taskCompletion,
  reviewScore
}: {
  savingsRate: number;
  healthScore: number;
  learningScore: number;
  taskCompletion: number;
  reviewScore: number;
}) {
  const weighted = savingsRate * 0.2 + healthScore * 0.25 + learningScore * 0.2 + taskCompletion * 0.25 + reviewScore * 0.1;
  return Math.max(0, Math.min(100, Math.round(weighted)));
}

export function summarizeRows(rows: Row[], numericKeys: string[]) {
  return numericKeys.map((key) => ({
    key,
    count: rows.length,
    sum: sumBy(rows, (row) => row[key]),
    average: rows.length ? sumBy(rows, (row) => row[key]) / rows.length : 0
  }));
}
