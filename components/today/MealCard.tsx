"use client";

import { useState } from "react";
import MacroBadge from "@/components/ui/MacroBadge";

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

interface MealCardProps {
  label: string;
  meal: Meal | null;
  logged: boolean;
  onLog: (mealId: string) => Promise<void>;
  onUnlog: (mealId: string) => Promise<void>;
  emoji: string;
}

export default function MealCard({ label, meal, logged, onLog, onUnlog, emoji }: MealCardProps) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!meal) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-dashed border-gray-200">
        <div className="text-sm text-gray-400 text-center">Нет блюда — выходной день 🎉</div>
      </div>
    );
  }

  async function handleToggle() {
    if (!meal) return;
    setLoading(true);
    try {
      if (logged) {
        await onUnlog(meal.id);
      } else {
        await onLog(meal.id);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm transition-all ${logged ? "opacity-75" : ""}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{emoji}</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
            </div>
            <div
              className="font-semibold text-gray-900 text-sm leading-tight cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              {meal.name}
            </div>
            <div className="mt-1.5">
              <MacroBadge kcal={meal.kcal} protein={meal.protein} fat={meal.fat} carbs={meal.carbs} />
            </div>
          </div>
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              logged
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500"
            }`}
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : logged ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        {expanded && meal.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">{meal.notes}</p>
            <p className="text-xs text-gray-400 mt-1">⏱ {meal.prepMinutes} мин</p>
          </div>
        )}
      </div>
    </div>
  );
}
