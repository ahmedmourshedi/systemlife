import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/register-service-worker";

export const metadata: Metadata = {
  title: {
    default: "نظام حياتي الشخصي",
    template: "%s | نظام حياتي الشخصي"
  },
  description: "تطبيق عربي احترافي لإدارة المال، الصحة، التعلم، الكتب، المهام، العادات، الأهداف والاستثمارات.",
  applicationName: "نظام حياتي",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "نظام حياتي",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-arabic antialiased" suppressHydrationWarning>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
