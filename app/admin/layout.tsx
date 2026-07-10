import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCurrentUserProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const context = await getCurrentUserProfile();

  if (!context) {
    redirect("/login");
  }

  if (context.profile.role !== "admin") {
    redirect("/app");
  }

  return <AppShell profile={context.profile}>{children}</AppShell>;
}
