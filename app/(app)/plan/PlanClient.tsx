"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DayData {
  day: string;
  label: string;
  totalKcal: number;
  slots: {
    mealType: string;
    mealTypeLabel: string;
    meal: { id: string; name: string; kcal: number };
  }[];
}

interface Props {
  weekStart: string;
  hasPlan: boolean;
  weekData: DayData[];
}

const MEAL_EMOJIS: Record<string, string> = {
  BREAKFAST: "🌅", LUNCH: "🍽", DINNER: "🌙", SNACK: "🍬", WEEKEND: "🎉",
};

export default function PlanClient({ weekStart, hasPlan, weekData }: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekStart }),
      });
      router.refresh();
    } finally {
      setGenerating(false);
    }
  }

  const weekDate = new Date(weekStart);
  const endDate = new Date(weekDate.getTime() + 6 * 86400000);
  const weekRange = `${weekDate.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })} – ${endDate.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}`;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Недельный план</h1>
          <p className="text-gray-400 text-sm">{weekRange}</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-green-600 text-white rounded-xl px-4 py-2 text-sm font-medium active:scale-95 transition-transform disabled:opacity-50"
        >
          {generating ? "..." : hasPlan ? "🔄" : "Создать"}
        </button>
      </div>

      {!hasPlan ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-700 font-semibold">Нет плана на эту неделю</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">Нажми &quot;Создать&quot;, чтобы сгенерировать</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-green-600 text-white rounded-xl px-6 py-3 font-medium active:scale-95 transition"
          >
            {generating ? "Генерирую..." : "Сгенерировать план"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {weekData.map(({ day, label, slots, totalKcal }) => (
            <div key={day} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <span className="font-semibold text-gray-800">{label}</span>
                {totalKcal > 0 && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    totalKcal > 2300 ? "bg-red-50 text-red-600" :
                    totalKcal > 1800 ? "bg-green-50 text-green-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {Math.round(totalKcal)} ккал
                  </span>
                )}
              </div>
              {slots.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {slots.map((slot) => (
                    <div key={slot.mealType} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-sm w-4">{MEAL_EMOJIS[slot.mealType]}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-medium text-gray-400 uppercase">{slot.mealTypeLabel}</span>
                        <p className="text-sm text-gray-800 leading-tight truncate">{slot.meal.name}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{Math.round(slot.meal.kcal)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">
                  {day === "SAT" || day === "SUN" ? "Поесть вне дома / свободный день" : "Нет блюд"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
