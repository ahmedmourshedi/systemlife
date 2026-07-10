import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { AppIcon } from "@/components/icons";
import { getCurrentUserProfile, getQuickAddSuggestions } from "@/lib/data";
import { QuickAddForm } from "./quick-add-form";

type SearchParams = Record<string, string | string[] | undefined>;

const allowedTypes = ["expense", "income", "task", "note", "water", "meal"] as const;
type EntryType = (typeof allowedTypes)[number];

function param(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function safeType(value: string | undefined): EntryType {
  return allowedTypes.includes(value as EntryType) ? (value as EntryType) : "expense";
}

export const metadata = {
  title: "إضافة سريعة"
};

export default async function QuickAddPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const context = await getCurrentUserProfile();
  const suggestions = await getQuickAddSuggestions();
  const initialType = safeType(param(params, "type"));

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="إدخال موحد"
        title="إضافة سريعة"
        description="سجل مصروفًا أو دخلًا أو مهمة أو ملاحظة أو مياه أو وجبة من نموذج واحد. الحقول تتغير حسب النوع حتى يبقى الإدخال خفيفًا."
        icon="bolt"
        action={
          <Link href="/app" className="btn-secondary">
            <AppIcon name="home" className="h-4 w-4" />
            مركز اليوم
          </Link>
        }
      />

      <section className="card-premium">
        <QuickAddForm initialType={initialType} currency={context?.profile.currency ?? "SAR"} suggestions={suggestions} />
      </section>
    </div>
  );
}
