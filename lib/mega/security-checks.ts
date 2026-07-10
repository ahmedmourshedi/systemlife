export const securityChecklist = [
  "عدم وضع Service Role Key في الواجهة الأمامية",
  "تفعيل RLS لكل جدول يحتوي بيانات شخصية",
  "اختبار تسجيل الدخول والخروج للحساب الشخصي قبل النشر",
  "إبقاء حسابك الشخصي فقط بصلاحية إدارة النظام",
  "تصدير نسخة احتياطية قبل تعديل schema.sql",
  "عدم تخزين كلمات مرور البنوك أو المحافظ",
  "مراجعة صلاحيات Storage Bucket",
  "استخدام Vercel Environment Variables بدل الملفات السرية"
];

export function getSecurityScore(completedItems: string[]) {
  if (!securityChecklist.length) return 0;
  const completed = securityChecklist.filter((item) => completedItems.includes(item)).length;
  return Math.round((completed / securityChecklist.length) * 100);
}
