"use client";

import { useEffect, useState } from "react";

export default function ClearCachePage() {
  const [status, setStatus] = useState("جاري تنظيف كاش التطبيق...");

  useEffect(() => {
    async function clear() {
      try {
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }

        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }

        setStatus("تم تنظيف الكاش. سيتم فتح التطبيق الآن.");
        window.setTimeout(() => {
          window.location.replace("/app");
        }, 800);
      } catch {
        setStatus("تعذر تنظيف الكاش تلقائيًا. اعمل Reload للصفحة ثم افتح /app.");
      }
    }

    clear();
  }, []);

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-lg">
        <h1 className="text-2xl font-extrabold">تنظيف كاش التطبيق</h1>
        <p className="mt-4 text-sm font-bold leading-7 text-slate-600">{status}</p>
      </section>
    </main>
  );
}
