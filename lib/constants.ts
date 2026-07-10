import type { NavigationItem } from "@/lib/types";

export const navigationItems: NavigationItem[] = [
  { href: "/app", label: "مركز اليوم", icon: "home", group: "الرئيسية" },
  { href: "/app/quick-add", label: "إضافة سريعة", icon: "bolt", group: "الرئيسية" },
  { href: "/app/setup", label: "إعداد نظامي", icon: "settings", group: "النظام" },
  { href: "/app/capture", label: "التقاط سريع", icon: "bolt", group: "الرئيسية" },
  { href: "/app/inbox", label: "صندوق المراجعة", icon: "inbox", group: "الرئيسية" },
  { href: "/app/planner", label: "مخطط اليوم", icon: "calendar", group: "الرئيسية" },
  { href: "/app/time", label: "إدارة الوقت", icon: "clock", group: "الرئيسية" },

  { href: "/app/finance", label: "المال والمصروفات", icon: "wallet", group: "المال" },
  { href: "/app/debts", label: "الديون والالتزامات", icon: "receipt", group: "المال" },
  { href: "/app/savings", label: "أهداف الادخار", icon: "bank", group: "المال" },
  { href: "/app/investments", label: "الاستثمار", icon: "trend", group: "المال" },
  { href: "/app/assets", label: "الأصول والممتلكات", icon: "tag", group: "المال" },

  { href: "/app/health", label: "الأكل والصحة", icon: "salad", group: "الصحة والبيت" },
  { href: "/app/mood", label: "المزاج والطاقة", icon: "smile", group: "الصحة والبيت" },
  { href: "/app/inventory", label: "مخزون المنزل", icon: "box", group: "الصحة والبيت" },
  { href: "/app/recipes", label: "الوصفات الصحية", icon: "utensils", group: "الصحة والبيت" },
  { href: "/app/meal-plan", label: "خطة الوجبات", icon: "pot", group: "الصحة والبيت" },
  { href: "/app/grocery", label: "قائمة المشتريات", icon: "cart", group: "الصحة والبيت" },

  { href: "/app/tasks", label: "المهام والعادات", icon: "checkCircle", group: "الإنتاجية" },
  { href: "/app/goals", label: "الأهداف", icon: "target", group: "الإنتاجية" },
  { href: "/app/journal", label: "اليوميات والتفكير", icon: "pen", group: "الإنتاجية" },
  { href: "/app/ideas", label: "بنك الأفكار", icon: "bulb", group: "الإنتاجية" },
  { href: "/app/decisions", label: "سجل القرارات", icon: "scale", group: "الإنتاجية" },
  { href: "/app/rituals", label: "الروتين والطقوس", icon: "sunrise", group: "الإنتاجية" },
  { href: "/app/reviews", label: "المراجعات الأسبوعية", icon: "search", group: "الإنتاجية" },

  { href: "/app/projects", label: "المشاريع الشخصية", icon: "rocket", group: "التعلم والعمل" },
  { href: "/app/learning", label: "الكورسات والتعلم", icon: "graduation", group: "التعلم والعمل" },
  { href: "/app/skills", label: "خريطة المهارات", icon: "brain", group: "التعلم والعمل" },
  { href: "/app/certificates", label: "الشهادات والإنجازات", icon: "award", group: "التعلم والعمل" },
  { href: "/app/books", label: "الكتب والقراءة", icon: "book", group: "التعلم والعمل" },
  { href: "/app/career", label: "المسار المهني", icon: "briefcase", group: "التعلم والعمل" },

  { href: "/app/people", label: "الأشخاص", icon: "users", group: "العلاقات والسفر" },
  { href: "/app/relationships", label: "متابعة العلاقات", icon: "handshake", group: "العلاقات والسفر" },
  { href: "/app/travel", label: "السفر والخطط", icon: "plane", group: "العلاقات والسفر" },
  { href: "/app/documents", label: "الملفات والوثائق", icon: "document", group: "العلاقات والسفر" },

  { href: "/app/search", label: "البحث الموحد", icon: "search", group: "النظام" },
  { href: "/app/import-export", label: "الاستيراد والتصدير", icon: "refresh", group: "النظام" },
  { href: "/app/automations", label: "الأتمتة", icon: "bot", group: "النظام" },
  { href: "/app/notifications", label: "التنبيهات", icon: "bell", group: "النظام" },
  { href: "/app/reports", label: "التقارير", icon: "chart", group: "النظام" },
  { href: "/app/settings", label: "الإعدادات", icon: "settings", group: "النظام" },

  { href: "/admin", label: "إدارة النظام", icon: "shield", group: "الإدارة", adminOnly: true },
  { href: "/admin/audit", label: "سجل التدقيق", icon: "receipt", group: "الإدارة", adminOnly: true },
  { href: "/admin/modules", label: "إدارة الوحدات", icon: "puzzle", group: "الإدارة", adminOnly: true },
  { href: "/admin/data-quality", label: "جودة البيانات", icon: "flask", group: "الإدارة", adminOnly: true },
  { href: "/admin/templates", label: "القوالب", icon: "clipboard", group: "الإدارة", adminOnly: true },
  { href: "/admin/backups", label: "النسخ الاحتياطي", icon: "database", group: "الإدارة", adminOnly: true },
  { href: "/admin/security", label: "الأمان", icon: "lock", group: "الإدارة", adminOnly: true },
  { href: "/admin/system", label: "إدارة النظام", icon: "settings", group: "الإدارة", adminOnly: true }
];

export const expenseCategories = ["أكل", "مواصلات", "بيت", "اشتراكات", "تعلم", "صحة", "ترفيه", "استثمار", "أخرى"];
export const incomeCategories = ["راتب", "عمل حر", "استثمار", "هدية", "أخرى"];
export const mealTypes = ["فطور", "غداء", "عشاء", "سناك"];
export const priorities = ["منخفضة", "متوسطة", "عالية", "حرجة"];
export const statuses = ["لم يبدأ", "جاري", "مكتمل", "متوقف", "متأخر"];
export const goalAreas = ["مال", "صحة", "تعلم", "عمل", "علاقات", "روحانيات", "شخصي"];
export const investmentTypes = ["أسهم", "صناديق", "ذهب", "كريبتو", "عقار", "نقد", "أخرى"];
