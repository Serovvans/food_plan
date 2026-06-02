"use client";

import { useState, useEffect } from "react";
import MacroBadge from "@/components/ui/MacroBadge";

interface Snack {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface CravingWidgetProps {
  remainingKcal: number;
  snacks: Snack[];
  onLog: (mealId: string) => Promise<void>;
}

type State = "idle" | "active" | "timer" | "done";

const TIMER_SECONDS = 10 * 60;

export default function CravingWidget({ remainingKcal, snacks, onLog }: CravingWidgetProps) {
  const [state, setState] = useState<State>("idle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (state !== "timer") return;
    setTimeLeft(TIMER_SECONDS);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setState("active");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  async function handleLog() {
    if (!selectedId) return;
    setLogging(true);
    try {
      await onLog(selectedId);
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } finally {
      setLogging(false);
    }
  }

  if (state === "idle") {
    return (
      <button
        onClick={() => setState("active")}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl py-4 px-5 text-left shadow-sm active:scale-95 transition-transform"
      >
        <div className="text-lg font-bold">🍬 Хочу сладкого</div>
        <div className="text-pink-100 text-xs mt-0.5">Нажми, чтобы не сорваться</div>
      </button>
    );
  }

  if (state === "done") {
    return (
      <div className="w-full bg-green-50 border border-green-200 rounded-2xl py-4 px-5 text-center">
        <div className="text-2xl mb-1">✅</div>
        <div className="text-green-700 font-semibold text-sm">Залогировано!</div>
      </div>
    );
  }

  if (state === "timer") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-rose-500 mb-2">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Подожди немного — тяга часто проходит сама
          </p>
          <div className="w-full bg-rose-50 rounded-full h-2 mb-4">
            <div
              className="bg-rose-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((TIMER_SECONDS - timeLeft) / TIMER_SECONDS) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setState("active")}
            className="text-sm text-gray-400 underline"
          >
            Не могу больше ждать
          </button>
        </div>
      </div>
    );
  }

  // active state
  const affordable = snacks.filter((s) => s.kcal <= remainingKcal + 50);
  const shown = affordable.length > 0 ? affordable.slice(0, 4) : snacks.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-900">Разрешённые варианты</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Осталось: <span className={remainingKcal < 0 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>{Math.round(remainingKcal)} ккал</span>
          </div>
        </div>
        <button onClick={() => setState("idle")} className="text-gray-300 hover:text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {shown.map((snack) => (
          <label
            key={snack.id}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
              selectedId === snack.id
                ? "border-rose-300 bg-rose-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="snack"
              value={snack.id}
              checked={selectedId === snack.id}
              onChange={() => setSelectedId(snack.id)}
              className="accent-rose-500"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800">{snack.name}</div>
              <MacroBadge kcal={snack.kcal} protein={snack.protein} fat={snack.fat} carbs={snack.carbs} />
            </div>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setState("timer")}
          className="py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 active:scale-95 transition-transform"
        >
          ⏱ Подождать 10 мин
        </button>
        <button
          onClick={handleLog}
          disabled={!selectedId || logging}
          className="py-2.5 px-4 rounded-xl bg-rose-500 text-white text-sm font-medium disabled:opacity-40 active:scale-95 transition-transform"
        >
          {logging ? "..." : "Залогировать"}
        </button>
      </div>
    </div>
  );
}
