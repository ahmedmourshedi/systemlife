import type { PersonalPreferences, Row } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const defaultPersonalPreferences: PersonalPreferences = {
  focus_areas: ["المال", "الصحة", "المهام"],
  show_health: true,
  show_investments: true,
  show_learning: true,
  show_books: true,
  show_relationships: false,
  show_travel: false,
  show_home: true,
  setup_completed: false
};

export const preferenceLabels: Array<{ key: keyof PersonalPreferences; label: string; description: string }> = [
  { key: "show_health", label: "الصحة", description: "المياه، الوجبات، الوزن، التمارين" },
  { key: "show_investments", label: "الاستثمار", description: "المحفظة، الأصول، أهداف الادخار" },
  { key: "show_learning", label: "التعلم", description: "الكورسات، المهارات، الشهادات" },
  { key: "show_books", label: "القراءة", description: "الكتب وسجل القراءة" },
  { key: "show_relationships", label: "العلاقات", description: "الأشخاص والمتابعات" },
  { key: "show_travel", label: "السفر", description: "خطط السفر والمستندات المرتبطة" },
  { key: "show_home", label: "البيت", description: "المشتريات، المخزون، الوجبات" }
];

const hiddenByPreference: Record<keyof PersonalPreferences, string[]> = {
  focus_areas: [],
  setup_completed: [],
  show_health: ["/app/health", "/app/mood"],
  show_investments: ["/app/investments", "/app/savings", "/app/assets"],
  show_learning: ["/app/learning", "/app/skills", "/app/certificates"],
  show_books: ["/app/books"],
  show_relationships: ["/app/people", "/app/relationships"],
  show_travel: ["/app/travel", "/app/documents"],
  show_home: ["/app/inventory", "/app/recipes", "/app/meal-plan", "/app/grocery"]
};

function normalizePreferences(row?: Row | null): PersonalPreferences {
  if (!row) return defaultPersonalPreferences;

  return {
    focus_areas: Array.isArray(row.focus_areas) ? row.focus_areas.map(String) : defaultPersonalPreferences.focus_areas,
    show_health: row.show_health !== false,
    show_investments: row.show_investments !== false,
    show_learning: row.show_learning !== false,
    show_books: row.show_books !== false,
    show_relationships: row.show_relationships === true,
    show_travel: row.show_travel === true,
    show_home: row.show_home !== false,
    setup_completed: row.setup_completed === true
  };
}

export async function getPersonalPreferences(userId: string): Promise<{ preferences: PersonalPreferences; tableMissing: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("personal_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { preferences: defaultPersonalPreferences, tableMissing: true };
  }

  return { preferences: normalizePreferences(data as Row | null), tableMissing: false };
}

export function getHiddenPreferenceHrefs(preferences: PersonalPreferences) {
  const hidden = new Set<string>();

  for (const setting of preferenceLabels) {
    if (preferences[setting.key] === false) {
      hiddenByPreference[setting.key].forEach((href) => hidden.add(href));
    }
  }

  return hidden;
}
