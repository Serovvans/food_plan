import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/plan-generator";
import PlanClient from "./PlanClient";

const DAY_LABELS: Record<string, string> = {
  MON: "Пн", TUE: "Вт", WED: "Ср", THU: "Чт", FRI: "Пт", SAT: "Сб", SUN: "Вс",
};

const MEAL_LABELS: Record<string, string> = {
  BREAKFAST: "Завтрак", LUNCH: "Обед", DINNER: "Ужин", SNACK: "Перекус", WEEKEND: "Блюдо",
};

export default async function PlanPage() {
  const weekStart = getWeekStart();

  const plan = await prisma.weekPlan.findUnique({
    where: { weekStart },
    include: {
      slots: {
        include: { meal: true },
        orderBy: [{ day: "asc" }, { mealType: "asc" }],
      },
    },
  });

  const weekData = Object.entries(DAY_LABELS).map(([day, label]) => {
    const slots = plan?.slots.filter((s) => s.day === day) ?? [];
    return {
      day,
      label,
      slots: slots.map((s) => ({
        mealType: s.mealType,
        mealTypeLabel: MEAL_LABELS[s.mealType] ?? s.mealType,
        meal: { id: s.meal.id, name: s.meal.name, kcal: s.meal.kcal },
      })),
      totalKcal: slots.reduce((sum, s) => sum + s.meal.kcal, 0),
    };
  });

  return (
    <PlanClient
      weekStart={weekStart.toISOString()}
      hasPlan={!!plan}
      weekData={weekData}
    />
  );
}
