import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "نظام حياتي الشخصي Mega",
    short_name: "حياتي Mega",
    description: "موقع PWA عربي شخصي لإدارة الحياة اليومية: مال، صحة، تعلم، كتب، أهداف، عادات، مشاريع، علاقات، قرارات، سفر، وصيانة النظام.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f9f7f2",
    theme_color: "#0f766e",
    lang: "ar",
    dir: "rtl",
    categories: ["productivity", "finance", "health", "education", "lifestyle"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      { name: "التقاط سريع", short_name: "التقاط", url: "/app/capture", description: "إضافة فكرة أو مهمة بسرعة" },
      { name: "مخطط اليوم", short_name: "اليوم", url: "/app/planner", description: "فتح خطة اليوم" },
      { name: "إضافة مصروف", short_name: "مال", url: "/app/finance", description: "فتح صفحة المال" },
      { name: "التقارير", short_name: "تقارير", url: "/app/reports", description: "مراجعة المؤشرات" }
    ]
  };
}
