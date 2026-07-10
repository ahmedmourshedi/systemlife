import { NextResponse } from "next/server";
import { getExportSnapshot } from "@/lib/mega/data";

export async function GET() {
  const snapshot = await getExportSnapshot();
  return new NextResponse(JSON.stringify(snapshot, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="lifeos-export-${new Date().toISOString().slice(0, 10)}.json"`
    }
  });
}
