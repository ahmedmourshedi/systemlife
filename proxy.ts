import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon-192x192.png|icon-512x512.png|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
