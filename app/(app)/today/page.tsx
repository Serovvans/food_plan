import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/plan-generator";
import { startOfDay } from "date-fns";
import TodayClient from "./TodayClient";

const DAY_MAP = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export default async function TodayPage() {
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(today.getTime() + 86400000);
  const todayKey = DAY_MAP[now.getDay()];

  const weekStart = getWeekStart(now);

  const [plan, logs, snacks, settings] = await Promise.all([
    prisma.weekPlan.findUnique({
      where: { weekStart },
      include: {
        slots: {
          where: { day: todayKey },
          include: { meal: true },
        },
      },
    }),
    prisma.dailyLog.findMany({
      where: { date: { gte: today, lt: tomorrow } },
      include: { meal: true },
    }),
    prisma.meal.findMany({ where: { type: "SNACK" } }),
    prisma.settings.findUnique({ where: { id: "singleton" } }),
  ]);

  const daySlots = plan?.slots ?? [];

  const loggedMealIds = new Set(logs.map((l) => l.mealId));
  const totals = logs.reduce(
    (acc, l) => ({
      kcal: acc.kcal + l.kcal,
      protein: acc.protein + l.protein,
      fat: acc.fat + l.fat,
      carbs: acc.carbs + l.carbs,
    }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const targets = {
    kcal: settings?.targetKcal ?? 2100,
    protein: settings?.targetProtein ?? 150,
    fat: settings?.targetFat ?? 67,
    carbs: settings?.targetCarbs ?? 210,
  };

  return (
    <TodayClient
      daySlots={daySlots.map((s) => ({
        mealType: s.mealType,
        meal: s.meal,
      }))}
      loggedMealIds={Array.from(loggedMealIds)}
      totals={totals}
      targets={targets}
      snacks={snacks}
      isWeekend={todayKey === "SAT" || todayKey === "SUN"}
    />
  );
}
