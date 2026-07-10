import { getModuleConfig, type ModuleKey } from "@/lib/mega/module-registry";

export type CsvMapping = {
  moduleKey: ModuleKey;
  table: string;
  requiredColumns: string[];
  optionalColumns: string[];
};

export function buildCsvMapping(moduleKey: ModuleKey): CsvMapping {
  const config = getModuleConfig(moduleKey);
  return {
    moduleKey,
    table: config.table,
    requiredColumns: config.fields.filter((field) => field.required).map((field) => field.name),
    optionalColumns: config.fields.filter((field) => !field.required).map((field) => field.name)
  };
}

export function validateCsvHeaders(headers: string[], mapping: CsvMapping) {
  const missing = mapping.requiredColumns.filter((column) => !headers.includes(column));
  const unknown = headers.filter((header) => !mapping.requiredColumns.includes(header) && !mapping.optionalColumns.includes(header));
  return {
    ok: missing.length === 0,
    missing,
    unknown
  };
}
