"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface Targets {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface Props {
  telegramChatId: string | null;
  targets: Targets;
}

export default function SettingsClient({ telegramChatId, targets: initialTargets }: Props) {
  const router = useRouter();
  const [chatId, setChatId] = useState(telegramChatId ?? "");
  const [targets, setTargets] = useState(initialTargets);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramChatId: chatId || null,
        targetKcal: Number(targets.kcal),
        targetProtein: Number(targets.protein),
        targetFat: Number(targets.fat),
        targetCarbs: Number(targets.carbs),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="p-4 space-y-4">
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
      </div>

      {/* Targets */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
        <h2 className="font-semibold text-gray-900">Цели по БЖУ</h2>
        {(["kcal", "protein", "fat", "carbs"] as const).map((key) => {
          const labels = { kcal: "Калории (ккал)", protein: "Белки (г)", fat: "Жиры (г)", carbs: "Углеводы (г)" };
          return (
            <div key={key}>
              <label className="block text-sm text-gray-500 mb-1">{labels[key]}</label>
              <input
                type="number"
                value={targets[key]}
                onChange={(e) => setTargets((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          );
        })}
      </div>

      {/* Telegram */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <h2 className="font-semibold text-gray-900">Telegram уведомления</h2>
        <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 leading-relaxed">
          <p className="font-semibold mb-1">Как подключить:</p>
          <p>1. Найди бота <code className="bg-blue-100 px-1 rounded">@твой_бот</code> в Telegram</p>
          <p>2. Отправь команду <code className="bg-blue-100 px-1 rounded">/start</code></p>
          <p>3. Бот пришлёт твой Chat ID — вставь его ниже</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Chat ID</label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="Например: 123456789"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {telegramChatId && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Telegram подключён
          </div>
        )}
        <div className="text-xs text-gray-400 space-y-0.5">
          <p>📦 Напоминание о покупках — воскресенье 10:00</p>
          <p>🍳 Напоминание готовить — понедельник 07:00</p>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3 rounded-xl font-medium transition-all active:scale-95 ${
          saved
            ? "bg-green-100 text-green-700"
            : "bg-green-600 text-white"
        }`}
      >
        {saved ? "✅ Сохранено!" : saving ? "Сохраняю..." : "Сохранить"}
      </button>

      {/* Logout */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 font-medium active:scale-95 transition"
      >
        Выйти
      </button>

      <p className="text-center text-xs text-gray-300">FoodPlan · Для здоровья 💪</p>
    </div>
  );
}
