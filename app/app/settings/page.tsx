import { updateProfileAction } from "@/app/actions";
import { Field, FormCard, SectionHeader, SubmitButton } from "@/components/ui";
import { getCurrentUserProfile } from "@/lib/data";

export const metadata = {
  title: "الإعدادات"
};

export default async function SettingsPage() {
  const context = await getCurrentUserProfile();
  const profile = context?.profile;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="إعداداتي الشخصية"
        title="الإعدادات"
        description="اضبط الاسم، العملة، المنطقة الزمنية وأهداف الصحة الافتراضية."
      />

      <FormCard title="الملف الشخصي" description="هذه القيم تظهر في لوحة التحكم وتستخدم كإعدادات افتراضية للنظام.">
        <form action={updateProfileAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="الاسم الكامل">
            <input className="input" name="full_name" defaultValue={profile?.full_name ?? ""} />
          </Field>
          <Field label="المنطقة الزمنية">
            <input className="input" name="timezone" defaultValue={profile?.timezone ?? "Asia/Riyadh"} />
          </Field>
          <Field label="العملة">
            <input className="input" name="currency" defaultValue={profile?.currency ?? "SAR"} />
          </Field>
          <Field label="هدف السعرات اليومي">
            <input className="input" name="daily_calories" type="number" min="0" defaultValue={profile?.daily_calories ?? 2200} />
          </Field>
          <Field label="هدف المياه اليومي بالمل">
            <input className="input" name="daily_water_ml" type="number" min="0" defaultValue={profile?.daily_water_ml ?? 2500} />
          </Field>
          <div className="sm:col-span-2">
            <SubmitButton>حفظ الإعدادات</SubmitButton>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
