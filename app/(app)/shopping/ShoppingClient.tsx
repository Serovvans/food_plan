"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ShoppingItem } from "@/lib/shopping-aggregator";

interface Props {
  items: ShoppingItem[];
  hasPlan: boolean;
}

export default function ShoppingClient({ items, hasPlan }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function handleGeneratePlan() {
    setGenerating(true);
    try {
      await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      router.refresh();
    } finally {
      setGenerating(false);
    }
  }

  const unchecked = items.filter((i) => !checked.has(i.productId));
  const done = items.filter((i) => checked.has(i.productId));

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">Список покупок</h1>
        <p className="text-gray-400 text-sm">
          {hasPlan
            ? `${items.length} позиций · Осталось: ${unchecked.length}`
            : "Сначала создай план на неделю"}
        </p>
      </div>

      {!hasPlan ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-gray-700 font-semibold">Нет плана на эту неделю</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">Список покупок формируется из плана</p>
          <button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="bg-green-600 text-white rounded-xl px-6 py-3 font-medium active:scale-95 transition"
          >
            {generating ? "Создаю план..." : "Создать план"}
          </button>
        </div>
      ) : (
        <>
          {unchecked.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
              {unchecked.map((item) => (
                <label key={item.productId} className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-gray-50">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    "border-gray-300"
                  }`} />
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={false}
                    onChange={() => toggle(item.productId)}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800">{item.productName}</span>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.packagesNeeded
                        ? `${item.packagesNeeded} ${item.packagesNeeded === 1 ? "упаковка" : item.packagesNeeded < 5 ? "упаковки" : "упаковок"} · ${item.totalGrams}г`
                        : `${item.totalGrams}г`}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(item.productId); }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </label>
              ))}
            </div>
          )}

          {done.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">Куплено</p>
              <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden opacity-60">
                {done.map((item) => (
                  <label key={item.productId} className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 line-through">{item.productName}</span>
                    <button
                      onClick={() => toggle(item.productId)}
                      className="ml-auto text-xs text-gray-300 hover:text-gray-500"
                    >
                      ↩
                    </button>
                  </label>
                ))}
              </div>
            </div>
          )}

          {unchecked.length === 0 && done.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🎉</div>
              <p className="text-green-700 font-semibold text-sm">Всё куплено!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
