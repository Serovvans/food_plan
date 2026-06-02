"use client";

import { useRouter } from "next/navigation";
import MacroRing from "@/components/today/MacroRing";
import MealCard from "@/components/today/MealCard";
import CravingWidget from "@/components/today/CravingWidget";
import ProgressBar from "@/components/ui/ProgressBar";
import { MealType } from "@prisma/client";

interface Meal {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  prepMinutes: number;
  notes?: string | null;
}

interface Slot {
  mealType: MealType;
  meal: Meal;
}

interface Targets {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface Props {
  daySlots: Slot[];
  loggedMealIds: string[];
  totals: Targets;
  targets: Targets;
  snacks: Meal[];
  isWeekend: boolean;
}

const MEAL_CONFIG = [
  { type: MealType.BREAKFAST, label: "Завтрак", emoji: "🌅" },
  { type: MealType.LUNCH, label: "Обед", emoji: "🍽" },
  { type: MealType.DINNER, label: "Ужин", emoji: "🌙" },
  { type: MealType.SNACK, label: "Перекус", emoji: "🍬" },
  { type: MealType.WEEKEND, label: "Выходной", emoji: "🎉" },
];

export default function TodayClient({ daySlots, loggedMealIds: initialLogged, totals: initialTotals, targets, snacks, isWeekend }: Props) {
  const router = useRouter();

  async function handleLog(mealId: string) {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mealId }),
    });
    router.refresh();
  }

  async function handleUnlog(mealId: string) {
    await fetch("/api/log", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mealId }),
    });
    router.refresh();
  }

  const loggedSet = new Set(initialLogged);
  const remaining = targets.kcal - initialTotals.kcal;

  const mealTypes = isWeekend
    ? [MealType.WEEKEND, MealType.SNACK]
    : [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">Сегодня</h1>
        <p className="text-gray-400 text-sm">
          {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Macro rings */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          <MacroRing label="Калории" value={initialTotals.kcal} target={targets.kcal} color="#f59e0b" unit=" ккал" />
          <MacroRing label="Белки" value={initialTotals.protein} target={targets.protein} color="#3b82f6" />
          <MacroRing label="Жиры" value={initialTotals.fat} target={targets.fat} color="#ef4444" />
          <MacroRing label="Углеводы" value={initialTotals.carbs} target={targets.carbs} color="#22c55e" />
        </div>
        <div className="mt-3 space-y-1.5">
          <ProgressBar label="Калории" value={initialTotals.kcal} target={targets.kcal} color="bg-amber-400" unit=" ккал" />
          <ProgressBar label="Белки" value={initialTotals.protein} target={targets.protein} color="bg-blue-400" />
          <ProgressBar label="Жиры" value={initialTotals.fat} target={targets.fat} color="bg-red-400" />
          <ProgressBar label="Углеводы" value={initialTotals.carbs} target={targets.carbs} color="bg-green-400" />
        </div>
      </div>

      {/* Craving widget */}
      <CravingWidget
        remainingKcal={remaining}
        snacks={snacks}
        onLog={handleLog}
      />

      {/* Meal cards */}
      {mealTypes.map((type) => {
        const config = MEAL_CONFIG.find((c) => c.type === type)!;
        const slot = daySlots.find((s) => s.mealType === type);
        return (
          <MealCard
            key={type}
            label={config.label}
            meal={slot?.meal ?? null}
            logged={slot ? loggedSet.has(slot.meal.id) : false}
            onLog={handleLog}
            onUnlog={handleUnlog}
            emoji={config.emoji}
          />
        );
      })}

      {daySlots.length === 0 && (
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 font-medium">Нет плана на эту неделю</p>
          <p className="text-gray-400 text-sm mt-1">Перейди в &quot;План&quot; и сгенерируй</p>
        </div>
      )}
    </div>
  );
}
