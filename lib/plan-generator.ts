import { prisma } from "@/lib/prisma";
import { MealType, DayOfWeek } from "@prisma/client";
import { startOfWeek, addDays } from "date-fns";

const WEEKDAYS: DayOfWeek[] = ["MON", "TUE", "WED", "THU", "FRI"];
const WEEKEND: DayOfWeek[] = ["SAT", "SUN"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateWeekPlan(weekStart?: Date) {
  const monday = weekStart ?? startOfWeek(new Date(), { weekStartsOn: 1 });

  const [lunches, breakfasts, dinners, snacks, weekendMeals] =
    await Promise.all([
      prisma.meal.findMany({ where: { type: MealType.LUNCH } }),
      prisma.meal.findMany({ where: { type: MealType.BREAKFAST } }),
      prisma.meal.findMany({ where: { type: MealType.DINNER } }),
      prisma.meal.findMany({ where: { type: MealType.SNACK } }),
      prisma.meal.findMany({ where: { type: MealType.WEEKEND } }),
    ]);

  const lunch = pick(lunches);
  const shuffledBreakfasts = shuffle(breakfasts);
  const shuffledDinners = shuffle(dinners);
  const shuffledSnacks = shuffle(snacks);

  const plan = await prisma.weekPlan.upsert({
    where: { weekStart: monday },
    update: {},
    create: { weekStart: monday },
  });

  // Delete existing slots for regeneration
  await prisma.weekPlanSlot.deleteMany({ where: { planId: plan.id } });

  const slots = [];

  for (let i = 0; i < WEEKDAYS.length; i++) {
    const day = WEEKDAYS[i];
    const breakfast = shuffledBreakfasts[i % shuffledBreakfasts.length];
    const dinner = shuffledDinners[i % shuffledDinners.length];
    const snack = shuffledSnacks[i % shuffledSnacks.length];

    // Soft constraint: avoid highest-cal breakfast + highest-cal dinner combo
    const highCalBreakfast = breakfast.kcal > 500;
    const highCalDinner = dinner.kcal > 500;
    const altDinner =
      highCalBreakfast && highCalDinner
        ? shuffledDinners.find((d) => d.kcal <= 450) ?? dinner
        : dinner;

    slots.push(
      { planId: plan.id, day, mealType: MealType.BREAKFAST, mealId: breakfast.id },
      { planId: plan.id, day, mealType: MealType.LUNCH, mealId: lunch.id },
      { planId: plan.id, day, mealType: MealType.DINNER, mealId: altDinner.id },
      { planId: plan.id, day, mealType: MealType.SNACK, mealId: snack.id }
    );
  }

  for (const day of WEEKEND) {
    if (weekendMeals.length > 0) {
      const meal = pick(weekendMeals);
      slots.push({ planId: plan.id, day, mealType: MealType.WEEKEND, mealId: meal.id });
    }
  }

  await prisma.weekPlanSlot.createMany({ data: slots });

  return prisma.weekPlan.findUnique({
    where: { id: plan.id },
    include: { slots: { include: { meal: true } } },
  });
}

export function getWeekStart(date = new Date()) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function getWeekDates(weekStart: Date) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}
