import { MegaModulePage } from "@/components/mega/module-page";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  return <MegaModulePage moduleKey="backups" message={params.message} error={params.error} />;
}
