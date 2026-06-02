"use client";

import { useState } from "react";
import MacroBadge from "@/components/ui/MacroBadge";

interface Product {
  id: string;
  name: string;
  kcalPer100: number;
  proteinPer100: number;
  fatPer100: number;
  carbsPer100: number;
  packageSizeG: number | null;
}

interface Ingredient {
  productId: string;
  grams: number;
  product: Product;
}

interface Meal {
  id: string;
  name: string;
  type: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  prepMinutes: number;
  notes?: string | null;
  ingredients: Ingredient[];
}

interface Props {
  meals: Meal[];
  products: Product[];
}

const TYPE_LABELS: Record<string, string> = {
  BREAKFAST: "Завтраки", LUNCH: "Обеды", DINNER: "Ужины",
  SNACK: "Перекусы", WEEKEND: "Выходные",
};
const TYPE_EMOJIS: Record<string, string> = {
  BREAKFAST: "🌅", LUNCH: "🍽", DINNER: "🌙", SNACK: "🍬", WEEKEND: "🎉",
};
const TYPE_ORDER = ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "WEEKEND"];

export default function RecipesClient({ meals, products }: Props) {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const types = TYPE_ORDER.filter((t) => meals.some((m) => m.type === t));
  const filtered = activeType ? meals.filter((m) => m.type === activeType) : meals;
  const grouped = TYPE_ORDER.filter((t) => filtered.some((m) => m.type === t));

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">Рецепты</h1>
        <p className="text-gray-400 text-sm">{meals.length} блюд, {products.length} продуктов</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveType(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeType ? "bg-green-600 text-white" : "bg-white text-gray-500 border border-gray-200"
          }`}
        >
          Все
        </button>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(activeType === t ? null : t)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeType === t ? "bg-green-600 text-white" : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {TYPE_EMOJIS[t]} {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {grouped.map((type) => (
        <div key={type}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            {TYPE_EMOJIS[type]} {TYPE_LABELS[type]}
          </h2>
          <div className="space-y-2">
            {filtered.filter((m) => m.type === type).map((meal) => (
              <div key={meal.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  className="w-full text-left p-4"
                  onClick={() => setExpandedId(expandedId === meal.id ? null : meal.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{meal.name}</div>
                      <div className="mt-1.5">
                        <MacroBadge kcal={meal.kcal} protein={meal.protein} fat={meal.fat} carbs={meal.carbs} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-400 mt-0.5">
                      <span>⏱ {meal.prepMinutes}м</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedId === meal.id ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {expandedId === meal.id && (
                  <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
                    {meal.notes && (
                      <p className="text-xs text-gray-500 leading-relaxed">{meal.notes}</p>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Состав (1 порция)</p>
                      <div className="space-y-1">
                        {meal.ingredients.map((ing) => (
                          <div key={ing.productId} className="flex justify-between text-sm">
                            <span className="text-gray-700">{ing.product.name}</span>
                            <span className="text-gray-400">{ing.grams}г</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
