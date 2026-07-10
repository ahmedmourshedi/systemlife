import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCurrentUserProfile } from "@/lib/data";
import { getPersonalPreferences } from "@/lib/preferences";

export const dynamic = "force-dynamic";

export default async function ProtectedAppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const context = await getCurrentUserProfile();

  if (!context) {
    redirect("/login");
  }

  const { preferences } = await getPersonalPreferences(context.user.id);

  return <AppShell profile={context.profile} preferences={preferences}>{children}</AppShell>;
}
