export type ModuleFieldType =
  | "text"
  | "number"
  | "date"
  | "datetime-local"
  | "textarea"
  | "select"
  | "checkbox"
  | "url"
  | "email";

export type ModuleField = {
  name: string;
  label: string;
  type: ModuleFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string | number | boolean;
  full?: boolean;
  step?: string;
  min?: string | number;
  max?: string | number;
};

export type ModuleConfig = {
  key: string;
  table: string;
  href: string;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  formTitle: string;
  formDescription: string;
  ownership: "user" | "admin";
  orderBy?: string;
  orderAscending?: boolean;
  fields: ModuleField[];
  listFields: string[];
  listLabels?: Record<string, string>;
  quickStats?: Array<{ label: string; field: string; type?: "count" | "sum" | "avg" }>;
};

const priorities = ["منخفضة", "متوسطة", "عالية", "حرجة"];
const statuses = ["لم يبدأ", "جاري", "مكتمل", "متوقف", "متأخر"];
const yesNo = ["نعم", "لا"];
const weekdays = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const lifeAreas = ["مال", "صحة", "تعلم", "عمل", "علاقات", "روحانيات", "شخصي", "منزل", "سفر"];
const energyLevels = ["منخفض", "متوسط", "مرتفع", "ممتاز"];

export const moduleRegistry = {
  capture: {
    key: "capture",
    table: "inbox_items",
    href: "/app/capture",
    title: "الالتقاط السريع",
    shortTitle: "التقاط",
    icon: "bolt",
    description: "صندوق موحد لأي فكرة أو مصروف أو مهمة أو ملاحظة قبل تصنيفها في مكانها الصحيح.",
    formTitle: "إضافة عنصر سريع",
    formDescription: "سجل أي شيء بسرعة ثم صنفه لاحقًا خلال المراجعة اليومية.",
    ownership: "user",
    orderBy: "captured_at",
    fields: [
      { name: "title", label: "العنوان", type: "text", required: true, placeholder: "مثال: فكرة مشروع أو فاتورة أو مهمة" },
      { name: "item_type", label: "النوع", type: "select", options: ["فكرة", "مهمة", "مصروف", "ملاحظة", "رابط", "قرار", "تعلم"], defaultValue: "ملاحظة" },
      { name: "area", label: "المجال", type: "select", options: lifeAreas, defaultValue: "شخصي" },
      { name: "priority", label: "الأولوية", type: "select", options: priorities, defaultValue: "متوسطة" },
      { name: "captured_at", label: "وقت الالتقاط", type: "datetime-local" },
      { name: "source", label: "المصدر", type: "text", placeholder: "جوال، واتساب، اجتماع، قراءة" },
      { name: "notes", label: "تفاصيل", type: "textarea", full: true }
    ],
    listFields: ["title", "item_type", "area", "priority", "captured_at"],
    quickStats: [{ label: "العناصر", field: "id", type: "count" }]
  },
  inbox: {
    key: "inbox",
    table: "inbox_items",
    href: "/app/inbox",
    title: "صندوق المراجعة",
    shortTitle: "الصندوق",
    icon: "inbox",
    description: "كل العناصر غير المصنفة أو التي تحتاج قرارًا قبل نقلها إلى مهام أو أهداف أو ملاحظات.",
    formTitle: "إضافة عنصر للمراجعة",
    formDescription: "استخدمه لتجميع كل ما لا تريد نسيانه.",
    ownership: "user",
    orderBy: "captured_at",
    fields: [
      { name: "title", label: "العنوان", type: "text", required: true },
      { name: "item_type", label: "النوع", type: "select", options: ["فكرة", "مهمة", "مصروف", "ملاحظة", "رابط", "قرار", "تعلم"], defaultValue: "ملاحظة" },
      { name: "processing_status", label: "حالة المعالجة", type: "select", options: ["جديد", "تم التصنيف", "مؤجل", "محذوف"], defaultValue: "جديد" },
      { name: "decision", label: "القرار التالي", type: "text", placeholder: "حولها إلى مهمة / تجاهل / ادرسها" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["title", "item_type", "processing_status", "decision", "created_at"]
  },
  planner: {
    key: "planner",
    table: "daily_plans",
    href: "/app/planner",
    title: "مخطط اليوم",
    shortTitle: "المخطط",
    icon: "calendar",
    description: "خطة يومية تربط الطاقة، الأولويات، الطعام، التعلم، العمل، والراحة.",
    formTitle: "خطة يوم جديد",
    formDescription: "اكتب أهم 3 نتائج تريدها اليوم ثم راجعها مساءً.",
    ownership: "user",
    orderBy: "plan_date",
    fields: [
      { name: "plan_date", label: "تاريخ اليوم", type: "date", required: true },
      { name: "day_name", label: "اليوم", type: "select", options: weekdays },
      { name: "main_focus", label: "تركيز اليوم", type: "text", required: true },
      { name: "top_three", label: "أهم 3 نتائج", type: "textarea", full: true },
      { name: "energy_level", label: "الطاقة المتوقعة", type: "select", options: energyLevels, defaultValue: "متوسط" },
      { name: "score", label: "تقييم اليوم", type: "number", min: 0, max: 10, defaultValue: 7 },
      { name: "reflection", label: "مراجعة آخر اليوم", type: "textarea", full: true }
    ],
    listFields: ["plan_date", "main_focus", "energy_level", "score"]
  },
  time: {
    key: "time",
    table: "time_blocks",
    href: "/app/time",
    title: "إدارة الوقت",
    shortTitle: "الوقت",
    icon: "clock",
    description: "تقسيم اليوم إلى كتل وقت ومقارنة المخطط بالمنفذ.",
    formTitle: "إضافة كتلة وقت",
    formDescription: "حدد بداية ونهاية النشاط حتى تعرف أين يذهب يومك.",
    ownership: "user",
    orderBy: "start_at",
    fields: [
      { name: "title", label: "النشاط", type: "text", required: true },
      { name: "area", label: "المجال", type: "select", options: lifeAreas, defaultValue: "عمل" },
      { name: "start_at", label: "البداية", type: "datetime-local", required: true },
      { name: "end_at", label: "النهاية", type: "datetime-local" },
      { name: "planned_minutes", label: "دقائق مخططة", type: "number", defaultValue: 60 },
      { name: "actual_minutes", label: "دقائق فعلية", type: "number", defaultValue: 0 },
      { name: "focus_score", label: "درجة التركيز", type: "number", min: 0, max: 10, defaultValue: 7 },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["title", "area", "start_at", "planned_minutes", "actual_minutes", "focus_score"],
    quickStats: [{ label: "دقائق فعلية", field: "actual_minutes", type: "sum" }]
  },
  projects: {
    key: "projects",
    table: "projects",
    href: "/app/projects",
    title: "المشاريع الشخصية",
    shortTitle: "المشاريع",
    icon: "rocket",
    description: "إدارة المبادرات الكبيرة: تطبيق، تعلم، تحسين صحة، مشروع جانبي، أو خطة مالية.",
    formTitle: "مشروع جديد",
    formDescription: "حوّل الفكرة إلى مشروع له هدف واضح وحالة ونطاق.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "name", label: "اسم المشروع", type: "text", required: true },
      { name: "area", label: "المجال", type: "select", options: lifeAreas, defaultValue: "شخصي" },
      { name: "status", label: "الحالة", type: "select", options: statuses, defaultValue: "جاري" },
      { name: "priority", label: "الأولوية", type: "select", options: priorities, defaultValue: "متوسطة" },
      { name: "start_date", label: "تاريخ البداية", type: "date" },
      { name: "due_date", label: "تاريخ الانتهاء المستهدف", type: "date" },
      { name: "progress", label: "نسبة التقدم", type: "number", min: 0, max: 100, defaultValue: 0 },
      { name: "why", label: "لماذا هذا المشروع مهم؟", type: "textarea", full: true },
      { name: "success_criteria", label: "معايير النجاح", type: "textarea", full: true }
    ],
    listFields: ["name", "area", "status", "priority", "progress", "due_date"]
  },
  journal: {
    key: "journal",
    table: "journal_entries",
    href: "/app/journal",
    title: "اليوميات والتفكير",
    shortTitle: "اليوميات",
    icon: "pen",
    description: "مساحة شخصية لتفريغ الأفكار، مراجعة اليوم، واستخراج الدروس.",
    formTitle: "تدوينة يومية",
    formDescription: "اكتب بصدق؛ هذه الصفحة هدفها الوضوح وليس الكمال.",
    ownership: "user",
    orderBy: "entry_date",
    fields: [
      { name: "entry_date", label: "التاريخ", type: "date", required: true },
      { name: "title", label: "عنوان التدوينة", type: "text", required: true },
      { name: "mood", label: "المزاج", type: "select", options: ["ممتاز", "جيد", "متوسط", "متوتر", "مرهق"], defaultValue: "جيد" },
      { name: "gratitude", label: "ثلاث أشياء ممتن لها", type: "textarea", full: true },
      { name: "lessons", label: "الدروس المستفادة", type: "textarea", full: true },
      { name: "content", label: "النص الكامل", type: "textarea", full: true }
    ],
    listFields: ["entry_date", "title", "mood", "created_at"]
  },
  mood: {
    key: "mood",
    table: "mood_logs",
    href: "/app/mood",
    title: "المزاج والطاقة",
    shortTitle: "المزاج",
    icon: "smile",
    description: "تتبع المزاج والطاقة والضغط لمعرفة العوامل المؤثرة على أدائك.",
    formTitle: "تسجيل مزاج",
    formDescription: "سجل المزاج بسرعة مع السبب المحتمل.",
    ownership: "user",
    orderBy: "logged_at",
    fields: [
      { name: "logged_at", label: "التاريخ", type: "date", required: true },
      { name: "mood_score", label: "المزاج من 10", type: "number", min: 0, max: 10, defaultValue: 7 },
      { name: "energy_score", label: "الطاقة من 10", type: "number", min: 0, max: 10, defaultValue: 7 },
      { name: "stress_score", label: "الضغط من 10", type: "number", min: 0, max: 10, defaultValue: 3 },
      { name: "sleep_quality", label: "جودة النوم", type: "select", options: ["سيئة", "متوسطة", "جيدة", "ممتازة"], defaultValue: "جيدة" },
      { name: "trigger", label: "السبب أو المؤثر", type: "text" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["logged_at", "mood_score", "energy_score", "stress_score", "trigger"]
  },
  people: {
    key: "people",
    table: "people",
    href: "/app/people",
    title: "العلاقات والأشخاص",
    shortTitle: "الأشخاص",
    icon: "users",
    description: "دليل شخصي للأشخاص المهمين، المتابعات، الالتزامات، ونقاط التواصل.",
    formTitle: "إضافة شخص",
    formDescription: "احفظ بيانات التواصل والسياق حتى لا تضيع التفاصيل.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "full_name", label: "الاسم", type: "text", required: true },
      { name: "relationship_type", label: "نوع العلاقة", type: "select", options: ["عائلة", "صديق", "عمل", "عميل", "مدرب", "مورد", "أخرى"], defaultValue: "عمل" },
      { name: "email", label: "البريد", type: "email" },
      { name: "phone", label: "الهاتف", type: "text" },
      { name: "company", label: "الشركة", type: "text" },
      { name: "last_contact_at", label: "آخر تواصل", type: "date" },
      { name: "next_follow_up_at", label: "المتابعة القادمة", type: "date" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["full_name", "relationship_type", "company", "last_contact_at", "next_follow_up_at"]
  },
  documents: {
    key: "documents",
    table: "documents",
    href: "/app/documents",
    title: "الملفات والوثائق",
    shortTitle: "الوثائق",
    icon: "document",
    description: "فهرس لكل الوثائق المهمة: إيصالات، شهادات، عقود، روابط، ملفات تعلم.",
    formTitle: "إضافة وثيقة",
    formDescription: "سجل بيانات الملف ومكانه حتى تصل إليه بسرعة.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "title", label: "عنوان الوثيقة", type: "text", required: true },
      { name: "document_type", label: "النوع", type: "select", options: ["إيصال", "شهادة", "عقد", "هوية", "رابط", "تعلم", "أخرى"], defaultValue: "أخرى" },
      { name: "related_area", label: "المجال", type: "select", options: lifeAreas, defaultValue: "شخصي" },
      { name: "file_url", label: "رابط الملف", type: "url" },
      { name: "expires_at", label: "تاريخ انتهاء إن وجد", type: "date" },
      { name: "tags", label: "وسوم", type: "text", placeholder: "مثال: ضريبة، شهادة، كورس" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["title", "document_type", "related_area", "expires_at", "tags"]
  },
  recipes: {
    key: "recipes",
    table: "recipes",
    href: "/app/recipes",
    title: "الوصفات الصحية",
    shortTitle: "الوصفات",
    icon: "utensils",
    description: "مكتبة وصفات محسوبة السعرات والبروتين لتسهيل الالتزام الغذائي.",
    formTitle: "وصفة جديدة",
    formDescription: "أضف وصفة قابلة للتكرار في خطة الوجبات.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "name", label: "اسم الوصفة", type: "text", required: true },
      { name: "meal_type", label: "نوع الوجبة", type: "select", options: ["فطور", "غداء", "عشاء", "سناك"], defaultValue: "غداء" },
      { name: "calories", label: "السعرات", type: "number", defaultValue: 0 },
      { name: "protein", label: "البروتين", type: "number", defaultValue: 0 },
      { name: "carbs", label: "الكارب", type: "number", defaultValue: 0 },
      { name: "fat", label: "الدهون", type: "number", defaultValue: 0 },
      { name: "prep_minutes", label: "وقت التحضير بالدقائق", type: "number", defaultValue: 15 },
      { name: "ingredients", label: "المكونات", type: "textarea", full: true },
      { name: "steps", label: "الطريقة", type: "textarea", full: true }
    ],
    listFields: ["name", "meal_type", "calories", "protein", "prep_minutes"]
  },
  mealPlan: {
    key: "mealPlan",
    table: "meal_plans",
    href: "/app/meal-plan",
    title: "خطة الوجبات",
    shortTitle: "خطة الأكل",
    icon: "pot",
    description: "تخطيط أسبوعي للوجبات والسعرات والالتزام.",
    formTitle: "إضافة وجبة مخططة",
    formDescription: "خطط وجباتك قبل يومك لتقلل القرارات العشوائية.",
    ownership: "user",
    orderBy: "planned_date",
    fields: [
      { name: "planned_date", label: "التاريخ", type: "date", required: true },
      { name: "meal_type", label: "نوع الوجبة", type: "select", options: ["فطور", "غداء", "عشاء", "سناك"], defaultValue: "غداء" },
      { name: "meal_name", label: "اسم الوجبة", type: "text", required: true },
      { name: "target_calories", label: "السعرات المستهدفة", type: "number", defaultValue: 600 },
      { name: "is_prepared", label: "تم التجهيز؟", type: "select", options: yesNo, defaultValue: "لا" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["planned_date", "meal_type", "meal_name", "target_calories", "is_prepared"]
  },
  grocery: {
    key: "grocery",
    table: "grocery_items",
    href: "/app/grocery",
    title: "قائمة المشتريات",
    shortTitle: "المشتريات",
    icon: "cart",
    description: "قائمة تسوق مرتبطة بالوجبات والميزانية.",
    formTitle: "إضافة صنف",
    formDescription: "سجل احتياجاتك قبل الذهاب للسوق.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "item_name", label: "الصنف", type: "text", required: true },
      { name: "category", label: "التصنيف", type: "select", options: ["بروتين", "خضار", "فاكهة", "كارب", "ألبان", "منزل", "أخرى"], defaultValue: "أخرى" },
      { name: "quantity", label: "الكمية", type: "number", defaultValue: 1 },
      { name: "unit", label: "الوحدة", type: "text", defaultValue: "قطعة" },
      { name: "estimated_price", label: "سعر تقديري", type: "number", defaultValue: 0 },
      { name: "status", label: "الحالة", type: "select", options: ["مطلوب", "تم الشراء", "مؤجل"], defaultValue: "مطلوب" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["item_name", "category", "quantity", "unit", "estimated_price", "status"]
  },
  debts: {
    key: "debts",
    table: "debts",
    href: "/app/debts",
    title: "الديون والالتزامات",
    shortTitle: "الديون",
    icon: "receipt",
    description: "إدارة الالتزامات، الأقساط، المستحقات، والمدفوعات القادمة.",
    formTitle: "إضافة التزام",
    formDescription: "سجل الدين أو القسط وموعد السداد.",
    ownership: "user",
    orderBy: "due_date",
    fields: [
      { name: "title", label: "اسم الالتزام", type: "text", required: true },
      { name: "party", label: "الطرف", type: "text" },
      { name: "debt_type", label: "النوع", type: "select", options: ["عليّ", "لي", "قسط", "فاتورة"], defaultValue: "عليّ" },
      { name: "total_amount", label: "المبلغ الإجمالي", type: "number", defaultValue: 0 },
      { name: "paid_amount", label: "المبلغ المدفوع", type: "number", defaultValue: 0 },
      { name: "due_date", label: "تاريخ الاستحقاق", type: "date" },
      { name: "status", label: "الحالة", type: "select", options: ["مفتوح", "مدفوع", "متأخر", "مؤجل"], defaultValue: "مفتوح" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["title", "party", "debt_type", "total_amount", "paid_amount", "due_date", "status"]
  },
  assets: {
    key: "assets",
    table: "asset_items",
    href: "/app/assets",
    title: "الأصول والممتلكات",
    shortTitle: "الأصول",
    icon: "tag",
    description: "تتبع الممتلكات المهمة: أجهزة، أثاث، ضمانات، قيمة تقريبية، ومكان التخزين.",
    formTitle: "إضافة أصل",
    formDescription: "احتفظ بسجل للممتلكات والضمانات والصيانة.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "name", label: "اسم الأصل", type: "text", required: true },
      { name: "asset_type", label: "النوع", type: "select", options: ["جهاز", "أثاث", "مركبة", "وثيقة", "مجوهرات", "أخرى"], defaultValue: "جهاز" },
      { name: "purchase_date", label: "تاريخ الشراء", type: "date" },
      { name: "purchase_price", label: "سعر الشراء", type: "number", defaultValue: 0 },
      { name: "current_value", label: "القيمة الحالية", type: "number", defaultValue: 0 },
      { name: "warranty_until", label: "الضمان حتى", type: "date" },
      { name: "location", label: "المكان", type: "text" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["name", "asset_type", "purchase_price", "current_value", "warranty_until", "location"]
  },
  inventory: {
    key: "inventory",
    table: "home_inventory",
    href: "/app/inventory",
    title: "مخزون المنزل",
    shortTitle: "المخزون",
    icon: "box",
    description: "متابعة المواد الاستهلاكية حتى لا تشتري المكرر أو تنسى الناقص.",
    formTitle: "إضافة عنصر مخزون",
    formDescription: "سجل الكمية والحد الأدنى للتنبيه.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "item_name", label: "الصنف", type: "text", required: true },
      { name: "category", label: "التصنيف", type: "select", options: ["مطبخ", "تنظيف", "صحة", "مكتب", "أخرى"], defaultValue: "مطبخ" },
      { name: "quantity", label: "الكمية", type: "number", defaultValue: 1 },
      { name: "min_quantity", label: "الحد الأدنى", type: "number", defaultValue: 1 },
      { name: "unit", label: "الوحدة", type: "text", defaultValue: "قطعة" },
      { name: "location", label: "مكان التخزين", type: "text" },
      { name: "expires_at", label: "تاريخ انتهاء", type: "date" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["item_name", "category", "quantity", "min_quantity", "unit", "expires_at"]
  },
  savings: {
    key: "savings",
    table: "saving_goals",
    href: "/app/savings",
    title: "أهداف الادخار",
    shortTitle: "الادخار",
    icon: "bank",
    description: "أهداف مالية واضحة مرتبطة بمبلغ مستهدف وتاريخ نهاية.",
    formTitle: "هدف ادخار جديد",
    formDescription: "حدد المبلغ والسبب والمساهمة الشهرية.",
    ownership: "user",
    orderBy: "target_date",
    fields: [
      { name: "title", label: "اسم الهدف", type: "text", required: true },
      { name: "target_amount", label: "المبلغ المستهدف", type: "number", defaultValue: 0 },
      { name: "current_amount", label: "المبلغ الحالي", type: "number", defaultValue: 0 },
      { name: "monthly_contribution", label: "مساهمة شهرية", type: "number", defaultValue: 0 },
      { name: "target_date", label: "تاريخ الهدف", type: "date" },
      { name: "priority", label: "الأولوية", type: "select", options: priorities, defaultValue: "متوسطة" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["title", "target_amount", "current_amount", "monthly_contribution", "target_date", "priority"]
  },
  career: {
    key: "career",
    table: "career_actions",
    href: "/app/career",
    title: "المسار المهني",
    shortTitle: "المهنة",
    icon: "briefcase",
    description: "إدارة خطوات التطور المهني: مقابلات، سيرة ذاتية، مهارات، علاقات، إنجازات.",
    formTitle: "خطوة مهنية",
    formDescription: "سجل خطوة واحدة تدفع مسارك المهني للأمام.",
    ownership: "user",
    orderBy: "action_date",
    fields: [
      { name: "action_date", label: "التاريخ", type: "date", required: true },
      { name: "title", label: "الخطوة", type: "text", required: true },
      { name: "action_type", label: "النوع", type: "select", options: ["تعلم", "تقديم وظيفة", "مقابلة", "تواصل", "إنجاز", "تحسين CV", "أخرى"], defaultValue: "تعلم" },
      { name: "status", label: "الحالة", type: "select", options: statuses, defaultValue: "جاري" },
      { name: "impact_score", label: "الأثر من 10", type: "number", min: 0, max: 10, defaultValue: 5 },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["action_date", "title", "action_type", "status", "impact_score"]
  },
  skills: {
    key: "skills",
    table: "skills",
    href: "/app/skills",
    title: "خريطة المهارات",
    shortTitle: "المهارات",
    icon: "brain",
    description: "تقييم مهاراتك الحالية والمستهدفة وربطها بالكورسات والمشاريع.",
    formTitle: "إضافة مهارة",
    formDescription: "قيّم مستواك الحالي وحدد المستوى المستهدف.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "name", label: "اسم المهارة", type: "text", required: true },
      { name: "category", label: "التصنيف", type: "select", options: ["تقنية", "اختبار برمجيات", "إدارة", "لغة", "تواصل", "صحة", "مالية", "أخرى"], defaultValue: "تقنية" },
      { name: "current_level", label: "المستوى الحالي من 10", type: "number", min: 0, max: 10, defaultValue: 1 },
      { name: "target_level", label: "المستوى المستهدف من 10", type: "number", min: 0, max: 10, defaultValue: 7 },
      { name: "practice_plan", label: "خطة التطبيق", type: "textarea", full: true },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["name", "category", "current_level", "target_level"]
  },
  certificates: {
    key: "certificates",
    table: "certificates",
    href: "/app/certificates",
    title: "الشهادات والإنجازات",
    shortTitle: "الشهادات",
    icon: "award",
    description: "أرشيف الشهادات، روابط التحقق، وتواريخ الانتهاء.",
    formTitle: "شهادة جديدة",
    formDescription: "سجل الشهادة واربطها بمسارك التعليمي.",
    ownership: "user",
    orderBy: "issued_at",
    fields: [
      { name: "title", label: "اسم الشهادة", type: "text", required: true },
      { name: "issuer", label: "الجهة", type: "text" },
      { name: "field", label: "المجال", type: "text" },
      { name: "issued_at", label: "تاريخ الإصدار", type: "date" },
      { name: "expires_at", label: "تاريخ الانتهاء", type: "date" },
      { name: "credential_url", label: "رابط التحقق", type: "url" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["title", "issuer", "field", "issued_at", "expires_at"]
  },
  relationships: {
    key: "relationships",
    table: "relationships_logs",
    href: "/app/relationships",
    title: "متابعة العلاقات",
    shortTitle: "العلاقات",
    icon: "handshake",
    description: "سجل مبادرات التواصل، المتابعات، والوعود حتى تبقى العلاقات حية.",
    formTitle: "تواصل أو متابعة",
    formDescription: "سجل من تواصلت معه وما الخطوة القادمة.",
    ownership: "user",
    orderBy: "contact_at",
    fields: [
      { name: "person_name", label: "اسم الشخص", type: "text", required: true },
      { name: "contact_at", label: "تاريخ التواصل", type: "date", required: true },
      { name: "contact_type", label: "نوع التواصل", type: "select", options: ["اتصال", "رسالة", "لقاء", "بريد", "مناسبة", "أخرى"], defaultValue: "رسالة" },
      { name: "quality_score", label: "جودة التواصل من 10", type: "number", min: 0, max: 10, defaultValue: 7 },
      { name: "next_step", label: "الخطوة التالية", type: "text" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["person_name", "contact_at", "contact_type", "quality_score", "next_step"]
  },
  travel: {
    key: "travel",
    table: "travel_plans",
    href: "/app/travel",
    title: "السفر والخطط",
    shortTitle: "السفر",
    icon: "plane",
    description: "تخطيط السفر: الوجهة، الميزانية، المستندات، قائمة التجهيز، والملاحظات.",
    formTitle: "خطة سفر",
    formDescription: "اجمع كل تفاصيل الرحلة في مكان واحد.",
    ownership: "user",
    orderBy: "start_date",
    fields: [
      { name: "destination", label: "الوجهة", type: "text", required: true },
      { name: "purpose", label: "الغرض", type: "select", options: ["عمل", "ترفيه", "عائلة", "تعلم", "علاج", "أخرى"], defaultValue: "ترفيه" },
      { name: "start_date", label: "تاريخ البداية", type: "date" },
      { name: "end_date", label: "تاريخ النهاية", type: "date" },
      { name: "budget", label: "الميزانية", type: "number", defaultValue: 0 },
      { name: "status", label: "الحالة", type: "select", options: ["فكرة", "مخطط", "محجوز", "تم", "ملغي"], defaultValue: "فكرة" },
      { name: "checklist", label: "قائمة التجهيز", type: "textarea", full: true },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["destination", "purpose", "start_date", "end_date", "budget", "status"]
  },
  ideas: {
    key: "ideas",
    table: "idea_bank",
    href: "/app/ideas",
    title: "بنك الأفكار",
    shortTitle: "الأفكار",
    icon: "bulb",
    description: "قاعدة أفكار للمشاريع، التحسينات، المحتوى، والتجارب المستقبلية.",
    formTitle: "فكرة جديدة",
    formDescription: "احفظ الفكرة حتى لو كانت غير مكتملة.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "title", label: "الفكرة", type: "text", required: true },
      { name: "area", label: "المجال", type: "select", options: lifeAreas, defaultValue: "شخصي" },
      { name: "potential_score", label: "قوة الفكرة من 10", type: "number", min: 0, max: 10, defaultValue: 5 },
      { name: "effort_score", label: "صعوبة التنفيذ من 10", type: "number", min: 0, max: 10, defaultValue: 5 },
      { name: "status", label: "الحالة", type: "select", options: ["خام", "قيد الدراسة", "تحولت لمشروع", "مؤجلة", "مرفوضة"], defaultValue: "خام" },
      { name: "description", label: "وصف الفكرة", type: "textarea", full: true },
      { name: "next_action", label: "أول خطوة", type: "text" }
    ],
    listFields: ["title", "area", "potential_score", "effort_score", "status"]
  },
  decisions: {
    key: "decisions",
    table: "decision_logs",
    href: "/app/decisions",
    title: "سجل القرارات",
    shortTitle: "القرارات",
    icon: "scale",
    description: "توثيق القرارات المهمة، البدائل، التوقعات، ومراجعة النتائج لاحقًا.",
    formTitle: "قرار جديد",
    formDescription: "اكتب لماذا اتخذت القرار وما الذي تتوقعه.",
    ownership: "user",
    orderBy: "decision_date",
    fields: [
      { name: "decision_date", label: "تاريخ القرار", type: "date", required: true },
      { name: "title", label: "القرار", type: "text", required: true },
      { name: "area", label: "المجال", type: "select", options: lifeAreas, defaultValue: "شخصي" },
      { name: "confidence_score", label: "الثقة من 10", type: "number", min: 0, max: 10, defaultValue: 7 },
      { name: "expected_outcome", label: "النتيجة المتوقعة", type: "textarea", full: true },
      { name: "alternatives", label: "البدائل", type: "textarea", full: true },
      { name: "review_date", label: "موعد المراجعة", type: "date" },
      { name: "actual_outcome", label: "النتيجة الفعلية", type: "textarea", full: true }
    ],
    listFields: ["decision_date", "title", "area", "confidence_score", "review_date"]
  },
  rituals: {
    key: "rituals",
    table: "rituals",
    href: "/app/rituals",
    title: "الروتين والطقوس",
    shortTitle: "الروتين",
    icon: "sunrise",
    description: "روتين صباحي ومسائي وأسبوعي يجعل النظام قابلًا للاستمرار.",
    formTitle: "روتين جديد",
    formDescription: "صمم روتينًا قصيرًا وواضحًا.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "title", label: "اسم الروتين", type: "text", required: true },
      { name: "ritual_type", label: "النوع", type: "select", options: ["صباحي", "مسائي", "أسبوعي", "شهري", "قبل العمل", "بعد العمل"], defaultValue: "صباحي" },
      { name: "trigger", label: "متى يبدأ؟", type: "text", placeholder: "بعد صلاة الفجر، قبل النوم..." },
      { name: "duration_minutes", label: "المدة بالدقائق", type: "number", defaultValue: 15 },
      { name: "steps", label: "الخطوات", type: "textarea", full: true },
      { name: "is_active", label: "نشط؟", type: "select", options: yesNo, defaultValue: "نعم" }
    ],
    listFields: ["title", "ritual_type", "duration_minutes", "is_active"]
  },
  reviews: {
    key: "reviews",
    table: "weekly_reviews",
    href: "/app/reviews",
    title: "المراجعات الأسبوعية",
    shortTitle: "المراجعات",
    icon: "search",
    description: "مراجعة أسبوعية مختصرة: ماذا نجح؟ ماذا لم ينجح؟ ما القرار القادم؟",
    formTitle: "مراجعة أسبوعية",
    formDescription: "لا تحتاج أكثر من 15 دقيقة؛ المهم الاستمرار.",
    ownership: "user",
    orderBy: "week_start",
    fields: [
      { name: "week_start", label: "بداية الأسبوع", type: "date", required: true },
      { name: "score", label: "تقييم الأسبوع", type: "number", min: 0, max: 10, defaultValue: 7 },
      { name: "wins", label: "الإنجازات", type: "textarea", full: true },
      { name: "problems", label: "المشاكل", type: "textarea", full: true },
      { name: "lessons", label: "الدروس", type: "textarea", full: true },
      { name: "next_week_focus", label: "تركيز الأسبوع القادم", type: "text" }
    ],
    listFields: ["week_start", "score", "next_week_focus", "created_at"]
  },
  importExport: {
    key: "importExport",
    table: "import_jobs",
    href: "/app/import-export",
    title: "الاستيراد والتصدير",
    shortTitle: "استيراد",
    icon: "refresh",
    description: "تجهيز عمليات استيراد من CSV وتصدير نسخ احتياطية للبيانات.",
    formTitle: "مهمة استيراد",
    formDescription: "سجل عملية الاستيراد قبل تنفيذها أو لمراجعتها بعد التنفيذ.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "job_name", label: "اسم العملية", type: "text", required: true },
      { name: "target_table", label: "الجدول المستهدف", type: "text", required: true },
      { name: "source_format", label: "الصيغة", type: "select", options: ["CSV", "JSON", "Google Sheets", "يدوي"], defaultValue: "CSV" },
      { name: "status", label: "الحالة", type: "select", options: ["مخطط", "قيد التنفيذ", "نجح", "فشل"], defaultValue: "مخطط" },
      { name: "rows_count", label: "عدد الصفوف", type: "number", defaultValue: 0 },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["job_name", "target_table", "source_format", "status", "rows_count"]
  },
  automations: {
    key: "automations",
    table: "automation_rules",
    href: "/app/automations",
    title: "الأتمتة والقواعد الذكية",
    shortTitle: "الأتمتة",
    icon: "bot",
    description: "قواعد مثل: إذا زاد الصرف عن حد معين أظهر تنبيهًا، أو ذكّرني بالمراجعة الأسبوعية.",
    formTitle: "قاعدة أتمتة",
    formDescription: "هذه النسخة تسجل القواعد وتجهزها للتفعيل لاحقًا.",
    ownership: "user",
    orderBy: "created_at",
    fields: [
      { name: "name", label: "اسم القاعدة", type: "text", required: true },
      { name: "module", label: "الوحدة", type: "text", required: true },
      { name: "trigger_type", label: "المشغل", type: "select", options: ["تاريخ", "حد مالي", "تأخر مهمة", "عادة لم تكتمل", "قيمة مخصصة"], defaultValue: "تاريخ" },
      { name: "condition_text", label: "الشرط", type: "textarea", full: true },
      { name: "action_text", label: "الإجراء", type: "textarea", full: true },
      { name: "is_active", label: "نشطة؟", type: "select", options: yesNo, defaultValue: "نعم" }
    ],
    listFields: ["name", "module", "trigger_type", "is_active", "created_at"]
  },
  notifications: {
    key: "notifications",
    table: "notification_rules",
    href: "/app/notifications",
    title: "التنبيهات والتذكيرات",
    shortTitle: "التنبيهات",
    icon: "bell",
    description: "قائمة تذكيرات مهيكلة للمهام، العادات، المراجعات، السداد، القراءة، والكورسات.",
    formTitle: "تنبيه جديد",
    formDescription: "سجل التنبيه ومتى يجب أن يظهر.",
    ownership: "user",
    orderBy: "next_run_at",
    fields: [
      { name: "title", label: "عنوان التنبيه", type: "text", required: true },
      { name: "channel", label: "القناة", type: "select", options: ["داخل التطبيق", "بريد", "واتساب لاحقًا", "Push لاحقًا"], defaultValue: "داخل التطبيق" },
      { name: "frequency", label: "التكرار", type: "select", options: ["مرة", "يومي", "أسبوعي", "شهري"], defaultValue: "مرة" },
      { name: "next_run_at", label: "الموعد القادم", type: "datetime-local" },
      { name: "is_active", label: "نشط؟", type: "select", options: yesNo, defaultValue: "نعم" },
      { name: "message", label: "نص التنبيه", type: "textarea", full: true }
    ],
    listFields: ["title", "channel", "frequency", "next_run_at", "is_active"]
  },
  adminAudit: {
    key: "adminAudit",
    table: "admin_audit_logs",
    href: "/admin/audit",
    title: "سجل التدقيق",
    shortTitle: "التدقيق",
    icon: "receipt",
    description: "تتبع العمليات الإدارية الحساسة داخل النظام.",
    formTitle: "إضافة سجل تدقيق يدوي",
    formDescription: "للاختبارات أو لتوثيق قرار إداري.",
    ownership: "admin",
    orderBy: "created_at",
    fields: [
      { name: "actor_email", label: "بريد المنفذ", type: "email" },
      { name: "action", label: "الإجراء", type: "text", required: true },
      { name: "target_table", label: "الجدول", type: "text" },
      { name: "target_id", label: "معرف العنصر", type: "text" },
      { name: "severity", label: "الأهمية", type: "select", options: ["منخفضة", "متوسطة", "عالية", "حرجة"], defaultValue: "متوسطة" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["actor_email", "action", "target_table", "severity", "created_at"]
  },
  adminModules: {
    key: "adminModules",
    table: "system_modules",
    href: "/admin/modules",
    title: "إدارة الوحدات",
    shortTitle: "الوحدات",
    icon: "puzzle",
    description: "تفعيل وتعطيل الوحدات ومتابعة وصف كل وحدة.",
    formTitle: "وحدة نظام",
    formDescription: "أضف أو وثق وحدة جديدة في النظام.",
    ownership: "admin",
    orderBy: "created_at",
    fields: [
      { name: "name", label: "اسم الوحدة", type: "text", required: true },
      { name: "slug", label: "المعرف", type: "text", required: true },
      { name: "owner_area", label: "المجال", type: "text" },
      { name: "status", label: "الحالة", type: "select", options: ["نشطة", "تجريبية", "موقفة", "مخططة"], defaultValue: "نشطة" },
      { name: "description", label: "الوصف", type: "textarea", full: true }
    ],
    listFields: ["name", "slug", "owner_area", "status", "created_at"]
  },
  dataQuality: {
    key: "dataQuality",
    table: "data_quality_checks",
    href: "/admin/data-quality",
    title: "جودة البيانات",
    shortTitle: "الجودة",
    icon: "flask",
    description: "قواعد فحص البيانات الناقصة أو المتضاربة قبل الاعتماد على التقارير.",
    formTitle: "فحص جديد",
    formDescription: "أضف قاعدة فحص أو سجل نتيجة فحص.",
    ownership: "admin",
    orderBy: "created_at",
    fields: [
      { name: "check_name", label: "اسم الفحص", type: "text", required: true },
      { name: "target_table", label: "الجدول", type: "text", required: true },
      { name: "severity", label: "الأهمية", type: "select", options: ["منخفضة", "متوسطة", "عالية", "حرجة"], defaultValue: "متوسطة" },
      { name: "status", label: "الحالة", type: "select", options: ["مفتوح", "تم الحل", "متجاهل"], defaultValue: "مفتوح" },
      { name: "finding", label: "النتيجة", type: "textarea", full: true },
      { name: "fix_suggestion", label: "اقتراح الحل", type: "textarea", full: true }
    ],
    listFields: ["check_name", "target_table", "severity", "status", "created_at"]
  },
  templates: {
    key: "templates",
    table: "module_templates",
    href: "/admin/templates",
    title: "قوالب النظام",
    shortTitle: "القوالب",
    icon: "clipboard",
    description: "قوالب جاهزة للمراجعات، الروتين، المهام، الأهداف، والجداول.",
    formTitle: "قالب جديد",
    formDescription: "أضف قالبًا يعاد استخدامه داخل النظام.",
    ownership: "admin",
    orderBy: "created_at",
    fields: [
      { name: "title", label: "اسم القالب", type: "text", required: true },
      { name: "template_type", label: "النوع", type: "select", options: ["مراجعة", "روتين", "هدف", "مهمة", "استيراد", "تقرير"], defaultValue: "مراجعة" },
      { name: "target_module", label: "الوحدة المستهدفة", type: "text" },
      { name: "content", label: "المحتوى", type: "textarea", full: true },
      { name: "is_active", label: "نشط؟", type: "select", options: yesNo, defaultValue: "نعم" }
    ],
    listFields: ["title", "template_type", "target_module", "is_active", "created_at"]
  },
  backups: {
    key: "backups",
    table: "backup_jobs",
    href: "/admin/backups",
    title: "النسخ الاحتياطي",
    shortTitle: "النسخ",
    icon: "database",
    description: "سجل عمليات النسخ الاحتياطي والاستعادة والتصدير.",
    formTitle: "عملية نسخ احتياطي",
    formDescription: "وثق العملية أو جهزها للتنفيذ لاحقًا.",
    ownership: "admin",
    orderBy: "created_at",
    fields: [
      { name: "job_name", label: "اسم العملية", type: "text", required: true },
      { name: "backup_type", label: "النوع", type: "select", options: ["يدوي", "مجدول", "تصدير", "استعادة"], defaultValue: "يدوي" },
      { name: "status", label: "الحالة", type: "select", options: ["مخطط", "قيد التنفيذ", "نجح", "فشل"], defaultValue: "مخطط" },
      { name: "file_url", label: "رابط الملف", type: "url" },
      { name: "notes", label: "ملاحظات", type: "textarea", full: true }
    ],
    listFields: ["job_name", "backup_type", "status", "created_at"]
  },
  security: {
    key: "security",
    table: "security_events",
    href: "/admin/security",
    title: "الأمان والصلاحيات",
    shortTitle: "الأمان",
    icon: "lock",
    description: "تسجيل أحداث الأمان، مراجعة الصلاحيات، وملاحظات الحماية.",
    formTitle: "حدث أمني",
    formDescription: "وثق أي حدث متعلق بالأمان أو الصلاحيات.",
    ownership: "admin",
    orderBy: "created_at",
    fields: [
      { name: "event_type", label: "نوع الحدث", type: "select", options: ["تسجيل دخول", "فشل دخول", "تغيير صلاحية", "سياسة RLS", "ملاحظة أمنية"], defaultValue: "ملاحظة أمنية" },
      { name: "severity", label: "الأهمية", type: "select", options: ["منخفضة", "متوسطة", "عالية", "حرجة"], defaultValue: "متوسطة" },
      { name: "actor_email", label: "البريد", type: "email" },
      { name: "description", label: "الوصف", type: "textarea", full: true },
      { name: "resolution", label: "الإجراء المتخذ", type: "textarea", full: true }
    ],
    listFields: ["event_type", "severity", "actor_email", "created_at"]
  },
  system: {
    key: "system",
    table: "system_announcements",
    href: "/admin/system",
    title: "إدارة النظام",
    shortTitle: "النظام",
    icon: "settings",
    description: "إعلانات داخلية، رسائل تشغيل، وملاحظات إصدار.",
    formTitle: "ملاحظة نظام",
    formDescription: "أضف ملاحظة تشغيلية لنفسك عن الصيانة أو النسخ الاحتياطي أو الإصدارات.",
    ownership: "admin",
    orderBy: "created_at",
    fields: [
      { name: "title", label: "العنوان", type: "text", required: true },
      { name: "audience", label: "التصنيف", type: "select", options: ["شخصي", "صيانة", "نسخ احتياطي"], defaultValue: "شخصي" },
      { name: "status", label: "الحالة", type: "select", options: ["مسودة", "منشور", "مؤرشف"], defaultValue: "مسودة" },
      { name: "published_at", label: "تاريخ النشر", type: "datetime-local" },
      { name: "message", label: "الرسالة", type: "textarea", full: true }
    ],
    listFields: ["title", "audience", "status", "published_at", "created_at"]
  }
} as const satisfies Record<string, ModuleConfig>;

export type ModuleKey = keyof typeof moduleRegistry;

export const userModuleKeys: ModuleKey[] = [
  "capture",
  "inbox",
  "planner",
  "time",
  "projects",
  "journal",
  "mood",
  "people",
  "documents",
  "recipes",
  "mealPlan",
  "grocery",
  "debts",
  "assets",
  "inventory",
  "savings",
  "career",
  "skills",
  "certificates",
  "relationships",
  "travel",
  "ideas",
  "decisions",
  "rituals",
  "reviews",
  "importExport",
  "automations",
  "notifications"
];

export const adminModuleKeys: ModuleKey[] = [
  "adminAudit",
  "adminModules",
  "dataQuality",
  "templates",
  "backups",
  "security",
  "system"
];

export function getModuleConfig(key: string): ModuleConfig {
  const config = moduleRegistry[key as ModuleKey];
  if (!config) {
    throw new Error(`وحدة غير معروفة: ${key}`);
  }
  return config;
}
