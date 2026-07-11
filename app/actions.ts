"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";
import { getModuleConfig } from "@/lib/mega/module-registry";

function text(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function positiveAmount(formData: FormData, key = "amount") {
  const value = numberValue(formData, key);
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) / 100 : null;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

async function requireAdmin() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile || profile.role !== "admin") {
    redirect("/app");
  }

  return { supabase, user };
}

async function findOrCreateCategory(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  name: string,
  type: string
) {
  const categoryName = name || "عام";
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("user_id", userId)
    .eq("name", categoryName)
    .eq("type", type)
    .maybeSingle();

  if (existing?.id) return existing.id as string;

  const { data: created } = await supabase
    .from("categories")
    .insert({ user_id: userId, name: categoryName, type })
    .select("id")
    .single();

  return created?.id as string | null;
}

async function findOrCreateAccount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  name: string,
  currency = "SAR"
) {
  const accountName = name || "الحساب الرئيسي";
  const { data: existing } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .eq("name", accountName)
    .maybeSingle();

  if (existing?.id) return existing.id as string;

  const { data: created } = await supabase
    .from("accounts")
    .insert({ user_id: userId, name: accountName, kind: "عام", currency })
    .select("id")
    .single();

  return created?.id as string | null;
}

async function createFinancialMovement({
  supabase,
  type,
  title,
  amount,
  currency,
  accountId,
  categoryId,
  date,
  paymentMethod,
  source,
  notes
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  type: "income" | "expense";
  title: string;
  amount: number;
  currency: string;
  accountId: string;
  categoryId: string | null;
  date: string;
  paymentMethod?: string | null;
  source?: string | null;
  notes?: string | null;
}) {
  return supabase.rpc("create_financial_movement", {
    p_transaction_type: type,
    p_title: title,
    p_amount: amount,
    p_currency: currency,
    p_account_id: accountId,
    p_category_id: categoryId,
    p_transaction_date: date,
    p_payment_method: paymentMethod,
    p_source: source,
    p_notes: notes,
    p_idempotency_key: null
  });
}

export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  const email = text(formData, "email");
  const password = text(formData, "password");
  const next = text(formData, "next", "/app");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent("بيانات الدخول غير صحيحة أو الحساب غير مفعل.")}`);
  }

  redirect(next.startsWith("/") ? next : "/app");
}

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();
  const fullName = text(formData, "full_name");
  const email = text(formData, "email");
  const password = text(formData, "password");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`
    }
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent("تعذر إنشاء الحساب. تحقق من البريد وكلمة المرور.")}`);
  }

  redirect(`/login?message=${encodeURIComponent("تم إنشاء الحساب. قد تحتاج تأكيد البريد الإلكتروني قبل تسجيل الدخول.")}`);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase
    .from("profiles")
    .update({
      full_name: text(formData, "full_name"),
      timezone: text(formData, "timezone", "Asia/Riyadh"),
      currency: text(formData, "currency", "SAR"),
      daily_calories: numberValue(formData, "daily_calories", 2200),
      daily_water_ml: numberValue(formData, "daily_water_ml", 2500)
    })
    .eq("id", user.id);

  revalidatePath("/app");
  revalidatePath("/app/settings");
}

export async function updatePersonalSetupAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const focusAreas = formData
    .getAll("focus_areas")
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .slice(0, 3);

  await supabase
    .from("profiles")
    .update({
      timezone: text(formData, "timezone", "Asia/Riyadh"),
      currency: text(formData, "currency", "SAR"),
      daily_calories: numberValue(formData, "daily_calories", 2200),
      daily_water_ml: numberValue(formData, "daily_water_ml", 2500)
    })
    .eq("id", user.id);

  const { error } = await supabase.from("personal_preferences").upsert(
    {
      user_id: user.id,
      focus_areas: focusAreas.length ? focusAreas : ["المال", "الصحة", "المهام"],
      show_health: formData.get("show_health") === "on",
      show_investments: formData.get("show_investments") === "on",
      show_learning: formData.get("show_learning") === "on",
      show_books: formData.get("show_books") === "on",
      show_relationships: formData.get("show_relationships") === "on",
      show_travel: formData.get("show_travel") === "on",
      show_home: formData.get("show_home") === "on",
      setup_completed: true,
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id" }
  );

  if (error) {
    redirect(`/app/setup?error=${encodeURIComponent("جدول التفضيلات غير موجود. شغل database/personal-preferences.sql في Supabase ثم أعد الحفظ.")}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/setup");
  revalidatePath("/app/settings");
  redirect("/app/setup?message=تم حفظ إعداد نظامك الشخصي.");
}

export async function createExpenseAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const currency = text(formData, "currency", "SAR");
  const amount = positiveAmount(formData);

  if (!amount) {
    redirect(`/app/finance?error=${encodeURIComponent("Amount must be greater than zero.")}`);
  }

  const categoryId = await findOrCreateCategory(supabase, user.id, text(formData, "category_name", "General"), "expense");
  const accountId = await findOrCreateAccount(supabase, user.id, text(formData, "account_name", "Main Account"), currency);

  if (!accountId) {
    redirect(`/app/finance?error=${encodeURIComponent("Account could not be created.")}`);
  }

  const { error } = await createFinancialMovement({
    supabase,
    type: "expense",
    title: text(formData, "title", "Expense"),
    amount,
    currency,
    accountId,
    categoryId,
    date: text(formData, "spent_at", todayISO()),
    paymentMethod: text(formData, "payment_method", "Unspecified"),
    notes: optionalText(formData, "notes")
  });

  if (error) {
    redirect(`/app/finance?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/finance");
}

export async function createIncomeAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const currency = text(formData, "currency", "SAR");
  const amount = positiveAmount(formData);

  if (!amount) {
    redirect(`/app/finance?error=${encodeURIComponent("Amount must be greater than zero.")}`);
  }

  const categoryId = await findOrCreateCategory(supabase, user.id, text(formData, "category_name", "General"), "income");
  const accountId = await findOrCreateAccount(supabase, user.id, text(formData, "account_name", "Main Account"), currency);

  if (!accountId) {
    redirect(`/app/finance?error=${encodeURIComponent("Account could not be created.")}`);
  }

  const { error } = await createFinancialMovement({
    supabase,
    type: "income",
    title: text(formData, "title", "Income"),
    amount,
    currency,
    accountId,
    categoryId,
    date: text(formData, "received_at", todayISO()),
    source: text(formData, "source", "Unspecified"),
    notes: optionalText(formData, "notes")
  });

  if (error) {
    redirect(`/app/finance?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/finance");
}

export async function createTransferAction(formData: FormData) {
  const { supabase } = await requireUser();
  const amount = positiveAmount(formData);
  const sourceAccountId = text(formData, "source_account_id");
  const destinationAccountId = text(formData, "destination_account_id");

  if (!amount) {
    redirect(`/app/finance?error=${encodeURIComponent("Transfer amount must be greater than zero.")}`);
  }

  if (!sourceAccountId || !destinationAccountId || sourceAccountId === destinationAccountId) {
    redirect(`/app/finance?error=${encodeURIComponent("Choose two different accounts for the transfer.")}`);
  }

  const { error } = await supabase.rpc("create_account_transfer", {
    p_source_account_id: sourceAccountId,
    p_destination_account_id: destinationAccountId,
    p_amount: amount,
    p_fee: positiveAmount(formData, "fee") ?? 0,
    p_currency: text(formData, "currency", "SAR"),
    p_transfer_at: text(formData, "transfer_at", todayISO()),
    p_notes: optionalText(formData, "notes"),
    p_idempotency_key: null
  });

  if (error) {
    redirect(`/app/finance?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/finance");
}

export async function createMealAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("meals").insert({
    user_id: user.id,
    meal_type: text(formData, "meal_type", "وجبة"),
    name: text(formData, "name", "وجبة"),
    calories: numberValue(formData, "calories"),
    protein: numberValue(formData, "protein"),
    carbs: numberValue(formData, "carbs"),
    fat: numberValue(formData, "fat"),
    quality: text(formData, "quality", "جيد"),
    meal_at: text(formData, "meal_at", new Date().toISOString()),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app");
  revalidatePath("/app/health");
}

export async function createWeightAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("weight_logs").insert({
    user_id: user.id,
    weight: numberValue(formData, "weight"),
    body_fat: numberValue(formData, "body_fat", 0),
    logged_at: text(formData, "logged_at", todayISO()),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app");
  revalidatePath("/app/health");
}

export async function createWaterAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("water_logs").insert({
    user_id: user.id,
    amount_ml: numberValue(formData, "amount_ml", 250),
    logged_at: text(formData, "logged_at", todayISO()),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app");
  revalidatePath("/app/health");
}

export async function upsertDailyPlanAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const planDate = text(formData, "plan_date", todayISO());

  await supabase.from("daily_plans").upsert(
    {
      user_id: user.id,
      plan_date: planDate,
      day_name: text(formData, "day_name", "اليوم"),
      main_focus: text(formData, "main_focus", "تركيز اليوم"),
      top_three: text(formData, "top_three"),
      energy_level: text(formData, "energy_level", "متوسط"),
      score: numberValue(formData, "score", 7),
      reflection: optionalText(formData, "reflection"),
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id,plan_date" }
  );

  revalidatePath("/app");
  revalidatePath("/app/planner");
  redirect("/app/planner?message=تم حفظ مخطط اليوم.");
}

export async function createQuickAddAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const entryType = text(formData, "entry_type", "note");
  const currency = text(formData, "currency", "SAR");
  const title = text(formData, "title", "تسجيل سريع");
  const notes = optionalText(formData, "notes");

  if (entryType === "expense") {
    const amount = positiveAmount(formData);
    const categoryId = await findOrCreateCategory(supabase, user.id, text(formData, "category_name", "General"), "expense");
    const accountId = await findOrCreateAccount(supabase, user.id, text(formData, "account_name", "Main Account"), currency);

    if (!amount || !accountId) {
      redirect(`/app/quick-add?type=expense&error=${encodeURIComponent("Amount and account are required.")}`);
    }

    const { error } = await createFinancialMovement({
      supabase,
      type: "expense",
      title,
      amount,
      currency,
      accountId,
      categoryId,
      date: text(formData, "date", todayISO()),
      paymentMethod: text(formData, "payment_method", "Unspecified"),
      notes
    });

    if (error) {
      redirect(`/app/quick-add?type=expense&error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/app/finance");
  } else if (entryType === "income") {
    const amount = positiveAmount(formData);
    const categoryId = await findOrCreateCategory(supabase, user.id, text(formData, "category_name", "General"), "income");
    const accountId = await findOrCreateAccount(supabase, user.id, text(formData, "account_name", "Main Account"), currency);

    if (!amount || !accountId) {
      redirect(`/app/quick-add?type=income&error=${encodeURIComponent("Amount and account are required.")}`);
    }

    const { error } = await createFinancialMovement({
      supabase,
      type: "income",
      title,
      amount,
      currency,
      accountId,
      categoryId,
      date: text(formData, "date", todayISO()),
      source: text(formData, "source", "Unspecified"),
      notes
    });

    if (error) {
      redirect(`/app/quick-add?type=income&error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/app/finance");
  } else if (entryType === "task") {
    await supabase.from("tasks").insert({
      user_id: user.id,
      title,
      priority: text(formData, "priority", "متوسطة"),
      status: "جديدة",
      due_date: optionalText(formData, "due_date"),
      notes
    });

    revalidatePath("/app/tasks");
  } else if (entryType === "water") {
    await supabase.from("water_logs").insert({
      user_id: user.id,
      amount_ml: numberValue(formData, "amount_ml", 250),
      logged_at: text(formData, "date", todayISO()),
      notes
    });

    revalidatePath("/app/health");
  } else if (entryType === "meal") {
    await supabase.from("meals").insert({
      user_id: user.id,
      meal_type: text(formData, "meal_type", "وجبة"),
      name: title,
      calories: numberValue(formData, "calories"),
      protein: numberValue(formData, "protein"),
      carbs: numberValue(formData, "carbs"),
      fat: numberValue(formData, "fat"),
      quality: text(formData, "quality", "جيد"),
      meal_at: new Date().toISOString(),
      notes
    });

    revalidatePath("/app/health");
  } else {
    await supabase.from("inbox_items").insert({
      user_id: user.id,
      title,
      item_type: text(formData, "item_type", "ملاحظة"),
      area: text(formData, "area", "شخصي"),
      priority: text(formData, "priority", "متوسطة"),
      source: "إضافة سريعة",
      processing_status: "جديد",
      notes
    });

    revalidatePath("/app/capture");
    revalidatePath("/app/inbox");
  }

  revalidatePath("/app");
  redirect("/app?message=quick-add");
}

export async function processInboxItemAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const itemId = text(formData, "item_id");
  const actionType = text(formData, "action_type", "archive");

  const { data: item } = await supabase
    .from("inbox_items")
    .select("*")
    .eq("id", itemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!item) {
    redirect("/app/inbox?error=لم يتم العثور على العنصر.");
  }

  const title = text(formData, "title", String(item.title ?? "عنصر مراجعة"));
  const notes = optionalText(formData, "notes") ?? String(item.notes ?? "");
  const priority = text(formData, "priority", String(item.priority ?? "متوسطة"));
  const area = text(formData, "area", String(item.area ?? "شخصي"));

  if (actionType === "task") {
    await supabase.from("tasks").insert({
      user_id: user.id,
      title,
      priority,
      status: "جديدة",
      due_date: optionalText(formData, "due_date"),
      notes
    });
    revalidatePath("/app/tasks");
  }

  if (actionType === "goal") {
    await supabase.from("goals").insert({
      user_id: user.id,
      title,
      area,
      status: "جاري",
      priority,
      target_value: numberValue(formData, "target_value", 100),
      current_value: 0,
      unit: text(formData, "unit", "%"),
      why: notes
    });
    revalidatePath("/app/goals");
  }

  if (actionType === "expense") {
    const currency = text(formData, "currency", "SAR");
    const amount = positiveAmount(formData);
    const categoryId = await findOrCreateCategory(supabase, user.id, text(formData, "category_name", "General"), "expense");
    const accountId = await findOrCreateAccount(supabase, user.id, text(formData, "account_name", "Main Account"), currency);

    if (!amount || !accountId) {
      redirect(`/app/inbox?error=${encodeURIComponent("Amount and account are required.")}`);
    }

    const { error } = await createFinancialMovement({
      supabase,
      type: "expense",
      title,
      amount,
      currency,
      accountId,
      categoryId,
      date: text(formData, "spent_at", todayISO()),
      paymentMethod: text(formData, "payment_method", "Unspecified"),
      notes
    });

    if (error) {
      redirect(`/app/inbox?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/app/finance");
  }

  if (actionType === "decision") {
    await supabase.from("decision_logs").insert({
      user_id: user.id,
      decision_date: text(formData, "decision_date", todayISO()),
      title,
      area,
      confidence_score: numberValue(formData, "confidence_score", 7),
      expected_outcome: notes,
      alternatives: optionalText(formData, "alternatives"),
      review_date: optionalText(formData, "review_date")
    });
    revalidatePath("/app/decisions");
  }

  await supabase
    .from("inbox_items")
    .update({
      processing_status: actionType === "archive" ? "مؤرشف" : "تم التصنيف",
      decision: text(formData, "decision", actionType),
      updated_at: new Date().toISOString()
    })
    .eq("id", itemId)
    .eq("user_id", user.id);

  revalidatePath("/app");
  revalidatePath("/app/inbox");
  redirect("/app/inbox?message=تمت معالجة العنصر.");
}

export async function createWorkoutAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("workouts").insert({
    user_id: user.id,
    workout_type: text(formData, "workout_type", "تمرين"),
    duration_minutes: numberValue(formData, "duration_minutes"),
    calories: numberValue(formData, "calories"),
    effort: text(formData, "effort", "متوسط"),
    workout_at: text(formData, "workout_at", todayISO()),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app/health");
}

export async function createCourseAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("courses").insert({
    user_id: user.id,
    title: text(formData, "title", "كورس جديد"),
    provider: text(formData, "provider", "غير محدد"),
    field: text(formData, "field", "عام"),
    status: text(formData, "status", "جاري"),
    priority: text(formData, "priority", "متوسطة"),
    start_date: optionalText(formData, "start_date"),
    target_end_date: optionalText(formData, "target_end_date"),
    total_lessons: numberValue(formData, "total_lessons"),
    completed_lessons: numberValue(formData, "completed_lessons"),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app");
  revalidatePath("/app/learning");
}

export async function createLessonAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("course_lessons").insert({
    user_id: user.id,
    course_id: text(formData, "course_id"),
    title: text(formData, "title", "درس"),
    status: text(formData, "status", "مكتمل"),
    duration_minutes: numberValue(formData, "duration_minutes"),
    completed_at: optionalText(formData, "completed_at"),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app/learning");
}

export async function createBookAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("books").insert({
    user_id: user.id,
    title: text(formData, "title", "كتاب جديد"),
    author: text(formData, "author", "غير محدد"),
    field: text(formData, "field", "عام"),
    status: text(formData, "status", "للقراءة"),
    priority: text(formData, "priority", "متوسطة"),
    total_pages: numberValue(formData, "total_pages"),
    current_page: numberValue(formData, "current_page"),
    start_date: optionalText(formData, "start_date"),
    target_end_date: optionalText(formData, "target_end_date"),
    summary: optionalText(formData, "summary"),
    apply_notes: optionalText(formData, "apply_notes")
  });

  revalidatePath("/app");
  revalidatePath("/app/books");
}

export async function createReadingLogAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("reading_logs").insert({
    user_id: user.id,
    book_id: text(formData, "book_id"),
    pages_read: numberValue(formData, "pages_read"),
    minutes: numberValue(formData, "minutes"),
    read_at: text(formData, "read_at", todayISO()),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app/books");
}

export async function createTaskAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("tasks").insert({
    user_id: user.id,
    goal_id: optionalText(formData, "goal_id"),
    title: text(formData, "title", "مهمة"),
    priority: text(formData, "priority", "متوسطة"),
    status: text(formData, "status", "جديدة"),
    due_date: optionalText(formData, "due_date"),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app");
  revalidatePath("/app/tasks");
  revalidatePath("/app/goals");
}

export async function toggleTaskAction(formData: FormData) {
  const { supabase } = await requireUser();
  const taskId = text(formData, "task_id");
  const nextStatus = text(formData, "next_status", "مكتملة");

  await supabase
    .from("tasks")
    .update({
      status: nextStatus,
      completed_at: nextStatus === "مكتملة" ? new Date().toISOString() : null
    })
    .eq("id", taskId);

  revalidatePath("/app");
  revalidatePath("/app/tasks");
}

export async function createHabitAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("habits").insert({
    user_id: user.id,
    title: text(formData, "title", "عادة"),
    frequency: text(formData, "frequency", "يومي"),
    target_value: numberValue(formData, "target_value", 1),
    unit: text(formData, "unit", "مرة"),
    is_active: true
  });

  revalidatePath("/app/tasks");
}

export async function createHabitLogAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("habit_logs").upsert(
    {
      user_id: user.id,
      habit_id: text(formData, "habit_id"),
      logged_at: text(formData, "logged_at", todayISO()),
      value: numberValue(formData, "value", 1),
      status: text(formData, "status", "تم"),
      notes: optionalText(formData, "notes")
    },
    { onConflict: "user_id,habit_id,logged_at" }
  );

  revalidatePath("/app");
  revalidatePath("/app/tasks");
}

export async function createGoalAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("goals").insert({
    user_id: user.id,
    title: text(formData, "title", "هدف"),
    area: text(formData, "area", "شخصي"),
    status: text(formData, "status", "جاري"),
    priority: text(formData, "priority", "متوسطة"),
    start_date: optionalText(formData, "start_date"),
    due_date: optionalText(formData, "due_date"),
    target_value: numberValue(formData, "target_value", 100),
    current_value: numberValue(formData, "current_value", 0),
    unit: text(formData, "unit", "%"),
    why: optionalText(formData, "why"),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app");
  revalidatePath("/app/goals");
}

export async function createMonthlyReviewAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("monthly_reviews").insert({
    user_id: user.id,
    month: text(formData, "month", todayISO()),
    score: numberValue(formData, "score", 7),
    wins: optionalText(formData, "wins"),
    lessons: optionalText(formData, "lessons"),
    next_actions: optionalText(formData, "next_actions")
  });

  revalidatePath("/app/goals");
  revalidatePath("/app/reports");
}

export async function createInvestmentAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const accountId = await findOrCreateAccount(supabase, user.id, text(formData, "account_name", "محفظة الاستثمار"), text(formData, "currency", "SAR"));

  await supabase.from("investments").insert({
    user_id: user.id,
    account_id: accountId,
    asset_name: text(formData, "asset_name", "أصل استثماري"),
    asset_type: text(formData, "asset_type", "أخرى"),
    symbol: optionalText(formData, "symbol"),
    quantity: numberValue(formData, "quantity"),
    buy_price: numberValue(formData, "buy_price"),
    current_price: numberValue(formData, "current_price"),
    amount_invested: numberValue(formData, "amount_invested"),
    current_value: numberValue(formData, "current_value"),
    currency: text(formData, "currency", "SAR"),
    risk_level: text(formData, "risk_level", "متوسط"),
    purchased_at: optionalText(formData, "purchased_at"),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app");
  revalidatePath("/app/investments");
}

export async function createInvestmentTransactionAction(formData: FormData) {
  const { supabase, user } = await requireUser();

  await supabase.from("investment_transactions").insert({
    user_id: user.id,
    investment_id: text(formData, "investment_id"),
    transaction_type: text(formData, "transaction_type", "شراء"),
    quantity: numberValue(formData, "quantity"),
    price: numberValue(formData, "price"),
    fees: numberValue(formData, "fees"),
    transaction_at: text(formData, "transaction_at", todayISO()),
    notes: optionalText(formData, "notes")
  });

  revalidatePath("/app/investments");
}

export async function createGenericRecordAction(formData: FormData) {
  const moduleKey = text(formData, "module_key");
  const config = getModuleConfig(moduleKey);
  const context = config.ownership === "admin" ? await requireAdmin() : await requireUser();
  const { supabase, user } = context;
  const payload: Record<string, unknown> = {};

  for (const field of config.fields) {
    const rawValue = formData.get(field.name);
    const rawText = typeof rawValue === "string" ? rawValue.trim() : "";

    if (!rawText && field.defaultValue === undefined && !field.required) {
      continue;
    }

    if (field.type === "number") {
      const fallback = typeof field.defaultValue === "number" ? field.defaultValue : 0;
      payload[field.name] = rawText ? numberValue(formData, field.name, fallback) : fallback;
      continue;
    }

    if (field.type === "checkbox") {
      payload[field.name] = rawValue === "on" || rawValue === "true";
      continue;
    }

    if (rawText) {
      payload[field.name] = rawText;
      continue;
    }

    if (field.defaultValue !== undefined) {
      payload[field.name] = field.defaultValue;
    }
  }

  if (config.ownership === "user") {
    payload.user_id = user.id;
  } else {
    payload.created_by = user.id;
  }

  const { error } = await supabase.from(config.table).insert(payload);

  if (error) {
    redirect(`${config.href}?error=${encodeURIComponent("تعذر الحفظ: " + error.message)}`);
  }

  revalidatePath(config.href);
  redirect(`${config.href}?message=${encodeURIComponent("تم حفظ السجل بنجاح.")}`);
}

export async function deleteGenericRecordAction(formData: FormData) {
  const moduleKey = text(formData, "module_key");
  const recordId = text(formData, "record_id");
  const config = getModuleConfig(moduleKey);
  const context = config.ownership === "admin" ? await requireAdmin() : await requireUser();
  const { supabase } = context;

  const { error } = await supabase.from(config.table).delete().eq("id", recordId);

  if (error) {
    redirect(`${config.href}?error=${encodeURIComponent("تعذر الحذف: " + error.message)}`);
  }

  revalidatePath(config.href);
  redirect(`${config.href}?message=${encodeURIComponent("تم حذف السجل.")}`);
}
