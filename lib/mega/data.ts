import { createClient } from "@/lib/supabase/server";
import type { Row } from "@/lib/types";
import { getModuleConfig, moduleRegistry, userModuleKeys, adminModuleKeys, type ModuleKey } from "@/lib/mega/module-registry";
import { sumBy, toNumber } from "@/lib/utils";

export type ModuleData = {
  records: Row[];
  count: number;
  error?: string;
  stats: Array<{ label: string; value: number }>;
};

export async function getModuleRecords(moduleKey: ModuleKey | string, limit = 80): Promise<ModuleData> {
  const config = getModuleConfig(moduleKey);
  const supabase = await createClient();
  const orderBy = config.orderBy ?? "created_at";

  const { data, error, count } = await supabase
    .from(config.table)
    .select("*", { count: "exact" })
    .order(orderBy, { ascending: config.orderAscending ?? false })
    .limit(limit);

  const records = (data ?? []) as Row[];
  const stats = (config.quickStats ?? [{ label: "عدد السجلات", field: "id", type: "count" as const }]).map((stat) => {
    if (stat.type === "sum") return { label: stat.label, value: sumBy(records, (row) => row[stat.field]) };
    if (stat.type === "avg") {
      const values = records.map((row) => toNumber(row[stat.field])).filter((value) => value > 0);
      return { label: stat.label, value: values.length ? values.reduce((acc, value) => acc + value, 0) / values.length : 0 };
    }
    return { label: stat.label, value: count ?? records.length };
  });

  return {
    records,
    count: count ?? records.length,
    error: error?.message,
    stats
  };
}

export async function getMegaOverview() {
  const modules = await Promise.all(
    userModuleKeys.map(async (key) => {
      const config = moduleRegistry[key];
      const data = await getModuleRecords(key, 5);
      return {
        key,
        title: config.title,
        href: config.href,
        icon: config.icon,
        description: config.description,
        count: data.count,
        error: data.error
      };
    })
  );

  return modules;
}

export async function getAdminMegaOverview() {
  const modules = await Promise.all(
    adminModuleKeys.map(async (key) => {
      const config = moduleRegistry[key];
      const data = await getModuleRecords(key, 5);
      return {
        key,
        title: config.title,
        href: config.href,
        icon: config.icon,
        description: config.description,
        count: data.count,
        error: data.error
      };
    })
  );

  return modules;
}

export async function getSearchSnapshot(searchText: string) {
  const normalized = searchText.trim().toLowerCase();
  const results: Array<{ moduleKey: ModuleKey; title: string; href: string; icon: string; row: Row; matchedText: string }> = [];

  if (!normalized) return results;

  for (const key of userModuleKeys) {
    const config = moduleRegistry[key];
    const data = await getModuleRecords(key, 30);
    for (const row of data.records) {
      const rowText = Object.values(row)
        .filter((value) => typeof value === "string" || typeof value === "number")
        .join(" ")
        .toLowerCase();
      if (rowText.includes(normalized)) {
        results.push({ moduleKey: key, title: config.title, href: config.href, icon: config.icon, row, matchedText: rowText.slice(0, 220) });
      }
      if (results.length >= 50) return results;
    }
  }

  return results;
}

export async function getExportSnapshot() {
  const snapshot: Record<string, Row[]> = {};

  for (const key of userModuleKeys) {
    const config = moduleRegistry[key];
    const data = await getModuleRecords(key, 500);
    snapshot[config.table] = data.records;
  }

  return {
    exported_at: new Date().toISOString(),
    language: "ar",
    direction: "rtl",
    app: "نظام حياتي الشخصي - Mega",
    tables: snapshot
  };
}
