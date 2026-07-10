export type UserRole = "admin" | "user";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  timezone: string | null;
  currency: string | null;
  daily_calories: number | null;
  daily_water_ml: number | null;
  created_at?: string;
};

export type Row = Record<string, unknown>;

export type NavigationItem = {
  href: string;
  label: string;
  icon: string;
  group: string;
  adminOnly?: boolean;
};

export type PersonalPreferences = {
  focus_areas: string[];
  show_health: boolean;
  show_investments: boolean;
  show_learning: boolean;
  show_books: boolean;
  show_relationships: boolean;
  show_travel: boolean;
  show_home: boolean;
  setup_completed: boolean;
};

export type DashboardSummary = {
  monthlyExpenses: number;
  monthlyIncome: number;
  monthlySavings: number;
  todayExpenses: number;
  todayCalories: number;
  waterToday: number;
  openTasks: number;
  activeCourses: number;
  activeBooks: number;
  activeGoals: number;
  investmentValue: number;
  latestWeight: number | null;
};
