import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { DashboardSummary, Profile, Row } from "@/lib/types";
import { monthStartISO, sumBy, todayISO, toNumber } from "@/lib/utils";

export async function getCurrentUserProfile(): Promise<{ user: User; profile: Profile } | null> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    return { user, profile: profile as Profile };
  }

  const fallbackProfile = {
    id: user.id,
    email: user.email ?? null,
    full_name: user.user_metadata?.full_name ?? user.email ?? "مستخدم جديد",
    role: "user",
    timezone: "Asia/Riyadh",
    currency: "SAR",
    daily_calories: 2200,
    daily_water_ml: 2500
  };

  const { data: created } = await supabase
    .from("profiles")
    .insert(fallbackProfile)
    .select("*")
    .single();

  return { user, profile: (created ?? fallbackProfile) as Profile };
}

export async function getDashboardData(): Promise<{ summary: DashboardSummary; recentExpenses: Row[]; recentTasks: Row[]; recentCourses: Row[]; recentBooks: Row[] }> {
  const context = await getCurrentUserProfile();
  if (!context) {
    throw new Error("يجب تسجيل الدخول أولًا.");
  }

  const supabase = await createClient();
  const today = todayISO();
  const monthStart = monthStartISO();

  const [
    expensesResult,
    incomesResult,
    todayExpensesResult,
    mealsResult,
    waterResult,
    weightResult,
    tasksResult,
    coursesResult,
    booksResult,
    goalsResult,
    investmentsResult
  ] = await Promise.all([
    supabase.from("expenses").select("id,title,amount,spent_at,category:categories(name)").gte("spent_at", monthStart).order("spent_at", { ascending: false }).limit(10),
    supabase.from("incomes").select("id,title,amount,received_at").gte("received_at", monthStart),
    supabase.from("expenses").select("id,amount").eq("spent_at", today),
    supabase.from("meals").select("id,calories,meal_at").gte("meal_at", `${today}T00:00:00`).lte("meal_at", `${today}T23:59:59`),
    supabase.from("water_logs").select("id,amount_ml,logged_at").eq("logged_at", today),
    supabase.from("weight_logs").select("weight,logged_at").order("logged_at", { ascending: false }).limit(1),
    supabase.from("tasks").select("id,title,status,due_date,priority").neq("status", "مكتملة").order("due_date", { ascending: true }).limit(8),
    supabase.from("courses").select("id,title,status,total_lessons,completed_lessons").eq("status", "جاري").limit(6),
    supabase.from("books").select("id,title,status,total_pages,current_page").eq("status", "أقرأ الآن").limit(6),
    supabase.from("goals").select("id,title,status").neq("status", "مكتمل").limit(10),
    supabase.from("investments").select("id,current_value,amount_invested")
  ]);

  const monthlyExpenses = sumBy((expensesResult.data ?? []) as Row[], (row) => row.amount);
  const monthlyIncome = sumBy((incomesResult.data ?? []) as Row[], (row) => row.amount);
  const todayExpenses = sumBy((todayExpensesResult.data ?? []) as Row[], (row) => row.amount);
  const todayCalories = sumBy((mealsResult.data ?? []) as Row[], (row) => row.calories);
  const waterToday = sumBy((waterResult.data ?? []) as Row[], (row) => row.amount_ml);
  const investmentValue = sumBy((investmentsResult.data ?? []) as Row[], (row) => row.current_value);

  return {
    summary: {
      monthlyExpenses,
      monthlyIncome,
      monthlySavings: monthlyIncome - monthlyExpenses,
      todayExpenses,
      todayCalories,
      waterToday,
      openTasks: (tasksResult.data ?? []).length,
      activeCourses: (coursesResult.data ?? []).length,
      activeBooks: (booksResult.data ?? []).length,
      activeGoals: (goalsResult.data ?? []).length,
      investmentValue,
      latestWeight: weightResult.data?.[0] ? toNumber((weightResult.data[0] as Row).weight) : null
    },
    recentExpenses: (expensesResult.data ?? []) as Row[],
    recentTasks: (tasksResult.data ?? []) as Row[],
    recentCourses: (coursesResult.data ?? []) as Row[],
    recentBooks: (booksResult.data ?? []) as Row[]
  };
}

export async function getFinanceData() {
  const supabase = await createClient();
  const monthStart = monthStartISO();

  const [expenses, incomes, accounts, budgets, subscriptions, transactions, transfers, budgetExpenses, subscriptionPayments] = await Promise.all([
    supabase.from("expenses").select("*,category:categories(name),account:accounts(name)").gte("spent_at", monthStart).order("spent_at", { ascending: false }).limit(30),
    supabase.from("incomes").select("*,category:categories(name),account:accounts(name)").gte("received_at", monthStart).order("received_at", { ascending: false }).limit(30),
    supabase.from("accounts").select("*").eq("is_archived", false).order("created_at", { ascending: false }),
    supabase.from("budgets").select("*,category:categories(name)").order("month", { ascending: false }).limit(20),
    supabase.from("subscriptions").select("*").eq("is_active", true).order("next_payment_at", { ascending: true }).limit(20),
    supabase.from("financial_transactions").select("*").gte("transaction_date", monthStart).order("transaction_date", { ascending: false }).order("created_at", { ascending: false }).limit(40),
    supabase.from("account_transfers").select("*").gte("transfer_at", monthStart).order("transfer_at", { ascending: false }).limit(20),
    supabase.from("expenses").select("category_id,amount,spent_at").gte("spent_at", monthStart),
    supabase.from("subscription_payments").select("*,subscription:subscriptions(name),account:accounts(name)").gte("paid_at", monthStart).order("paid_at", { ascending: false }).limit(20)
  ]);

  return {
    expenses: (expenses.data ?? []) as Row[],
    incomes: (incomes.data ?? []) as Row[],
    accounts: (accounts.data ?? []) as Row[],
    budgets: (budgets.data ?? []) as Row[],
    subscriptions: (subscriptions.data ?? []) as Row[],
    transactions: (transactions.data ?? []) as Row[],
    transfers: (transfers.data ?? []) as Row[],
    budgetExpenses: (budgetExpenses.data ?? []) as Row[],
    subscriptionPayments: (subscriptionPayments.data ?? []) as Row[],
    error: expenses.error?.message ?? incomes.error?.message ?? accounts.error?.message ?? budgets.error?.message ?? subscriptions.error?.message ?? transactions.error?.message ?? transfers.error?.message ?? budgetExpenses.error?.message ?? subscriptionPayments.error?.message ?? null
  };
}

export async function getQuickAddSuggestions() {
  const supabase = await createClient();

  const [categories, accounts] = await Promise.all([
    supabase
      .from("categories")
      .select("name,type")
      .order("updated_at", { ascending: false })
      .limit(30),
    supabase
      .from("accounts")
      .select("name")
      .eq("is_archived", false)
      .order("updated_at", { ascending: false })
      .limit(8)
  ]);

  const rows = (categories.data ?? []) as Row[];

  return {
    expenseCategories: rows.filter((row) => row.type === "expense").map((row) => String(row.name)).filter(Boolean).slice(0, 8),
    incomeCategories: rows.filter((row) => row.type === "income").map((row) => String(row.name)).filter(Boolean).slice(0, 8),
    accounts: ((accounts.data ?? []) as Row[]).map((row) => String(row.name)).filter(Boolean).slice(0, 6)
  };
}

export async function getDebtData() {
  const supabase = await createClient();

  const [debts, repayments, accounts, people] = await Promise.all([
    supabase.from("debts").select("*").order("due_date", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false }),
    supabase.from("debt_repayments").select("*,debt:debts(title,party),account:accounts(name)").order("paid_at", { ascending: false }).limit(30),
    supabase.from("accounts").select("*").eq("is_archived", false).order("updated_at", { ascending: false }),
    supabase.from("people").select("id,full_name").order("updated_at", { ascending: false }).limit(30)
  ]);

  return {
    debts: (debts.data ?? []) as Row[],
    repayments: (repayments.data ?? []) as Row[],
    accounts: (accounts.data ?? []) as Row[],
    people: (people.data ?? []) as Row[],
    error: debts.error?.message ?? repayments.error?.message ?? accounts.error?.message ?? people.error?.message ?? null
  };
}

export async function getHealthData() {
  const supabase = await createClient();
  const today = todayISO();

  const [meals, weights, water, workouts, sleep] = await Promise.all([
    supabase.from("meals").select("*").order("meal_at", { ascending: false }).limit(30),
    supabase.from("weight_logs").select("*").order("logged_at", { ascending: false }).limit(20),
    supabase.from("water_logs").select("*").eq("logged_at", today),
    supabase.from("workouts").select("*").order("workout_at", { ascending: false }).limit(20),
    supabase.from("sleep_logs").select("*").order("slept_at", { ascending: false }).limit(20)
  ]);

  return {
    meals: (meals.data ?? []) as Row[],
    weights: (weights.data ?? []) as Row[],
    water: (water.data ?? []) as Row[],
    workouts: (workouts.data ?? []) as Row[],
    sleep: (sleep.data ?? []) as Row[]
  };
}

export async function getLearningData() {
  const supabase = await createClient();

  const [courses, lessons, notes] = await Promise.all([
    supabase.from("courses").select("*").order("created_at", { ascending: false }).limit(40),
    supabase.from("course_lessons").select("*,course:courses(title)").order("created_at", { ascending: false }).limit(30),
    supabase.from("notes").select("*").eq("module", "learning").order("created_at", { ascending: false }).limit(20)
  ]);

  return {
    courses: (courses.data ?? []) as Row[],
    lessons: (lessons.data ?? []) as Row[],
    notes: (notes.data ?? []) as Row[]
  };
}

export async function getBooksData() {
  const supabase = await createClient();

  const [books, readingLogs] = await Promise.all([
    supabase.from("books").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("reading_logs").select("*,book:books(title)").order("read_at", { ascending: false }).limit(30)
  ]);

  return {
    books: (books.data ?? []) as Row[],
    readingLogs: (readingLogs.data ?? []) as Row[]
  };
}

export async function getTasksData() {
  const supabase = await createClient();
  const today = todayISO();

  const [tasks, habits, habitLogs] = await Promise.all([
    supabase.from("tasks").select("*,goal:goals(title)").order("created_at", { ascending: false }).limit(60),
    supabase.from("habits").select("*").eq("is_active", true).order("created_at", { ascending: false }),
    supabase.from("habit_logs").select("*,habit:habits(title,unit)").eq("logged_at", today)
  ]);

  return {
    tasks: (tasks.data ?? []) as Row[],
    habits: (habits.data ?? []) as Row[],
    habitLogs: (habitLogs.data ?? []) as Row[]
  };
}

export async function getGoalsData() {
  const supabase = await createClient();

  const [goals, tasks, reviews] = await Promise.all([
    supabase.from("goals").select("*").order("due_date", { ascending: true }).limit(60),
    supabase.from("tasks").select("id,title,status,goal_id").not("goal_id", "is", null),
    supabase.from("monthly_reviews").select("*").order("month", { ascending: false }).limit(12)
  ]);

  return {
    goals: (goals.data ?? []) as Row[],
    tasks: (tasks.data ?? []) as Row[],
    reviews: (reviews.data ?? []) as Row[]
  };
}

export async function getInvestmentsData() {
  const supabase = await createClient();

  const [investments, transactions] = await Promise.all([
    supabase.from("investments").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("investment_transactions").select("*,investment:investments(asset_name)").order("transaction_at", { ascending: false }).limit(40)
  ]);

  return {
    investments: (investments.data ?? []) as Row[],
    transactions: (transactions.data ?? []) as Row[]
  };
}

export async function getAdminData() {
  const supabase = await createClient();
  const monthStart = monthStartISO();

  const [profiles, expenses, incomes, tasks, goals, courses, books] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("expenses").select("amount").gte("spent_at", monthStart),
    supabase.from("incomes").select("amount").gte("received_at", monthStart),
    supabase.from("tasks").select("id,status"),
    supabase.from("goals").select("id,status"),
    supabase.from("courses").select("id,status"),
    supabase.from("books").select("id,status")
  ]);

  return {
    profiles: (profiles.data ?? []) as Row[],
    monthlyExpenses: sumBy((expenses.data ?? []) as Row[], (row) => row.amount),
    monthlyIncome: sumBy((incomes.data ?? []) as Row[], (row) => row.amount),
    tasks: (tasks.data ?? []) as Row[],
    goals: (goals.data ?? []) as Row[],
    courses: (courses.data ?? []) as Row[],
    books: (books.data ?? []) as Row[]
  };
}
