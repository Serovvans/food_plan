import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/telegram";
import { aggregateShopping } from "@/lib/shopping-aggregator";
import { getWeekStart } from "@/lib/plan-generator";
import { startOfDay } from "date-fns";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const update = await req.json();
  const message = update?.message;
  if (!message) return NextResponse.json({ ok: true });

  const chatId = String(message.chat.id);
  const text: string = message.text ?? "";

  if (text === "/start" || text === "/setup") {
    await prisma.settings.upsert({
      where: { id: "singleton" },
      update: { telegramChatId: chatId },
      create: { id: "singleton", telegramChatId: chatId },
    });
    await sendMessage(chatId, `✅ <b>FoodPlan подключён!</b>\n\nТвой chat ID: <code>${chatId}</code>\n\nКоманды:\n/today — план на сегодня\n/shopping — список покупок`);
    return NextResponse.json({ ok: true });
  }

  if (text === "/today") {
    const today = startOfDay(new Date());
    const tomorrow = new Date(today.getTime() + 86400000);
    const logs = await prisma.dailyLog.findMany({
      where: { date: { gte: today, lt: tomorrow } },
    });
    const totalKcal = logs.reduce((s, l) => s + l.kcal, 0);
    const totalProtein = logs.reduce((s, l) => s + l.protein, 0);

    const weekStart = getWeekStart();
    const plan = await prisma.weekPlan.findUnique({
      where: { weekStart },
      include: { slots: { include: { meal: true } } },
    });

    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const dayIdx = (new Date().getDay() + 6) % 7;
    const todaySlots = plan?.slots.filter((s) => s.day === days[dayIdx]) ?? [];

    let reply = `📅 <b>Сегодня:</b>\n\n`;
    for (const slot of todaySlots) {
      const emoji = { BREAKFAST: "🌅", LUNCH: "🍽", DINNER: "🌙", SNACK: "🍬", WEEKEND: "🎉" }[slot.mealType];
      reply += `${emoji} ${slot.meal.name} — ${Math.round(slot.meal.kcal)} ккал\n`;
    }
    reply += `\n📊 Залогировано: ${Math.round(totalKcal)} ккал, Б: ${totalProtein.toFixed(0)}г`;

    await sendMessage(chatId, reply);
    return NextResponse.json({ ok: true });
  }

  if (text === "/shopping") {
    const weekStart = getWeekStart();
    const plan = await prisma.weekPlan.findUnique({ where: { weekStart } });

    if (!plan) {
      await sendMessage(chatId, "❌ Нет плана на эту неделю. Сгенерируй план в приложении.");
      return NextResponse.json({ ok: true });
    }

    const items = await aggregateShopping(plan.id);
    let reply = `🛒 <b>Список покупок на неделю:</b>\n\n`;
    for (const item of items.sort((a, b) => a.productName.localeCompare(b.productName))) {
      const packs = item.packagesNeeded ? ` (${item.packagesNeeded} пач.)` : ` (~${item.totalGrams}г)`;
      reply += `• ${item.productName}${packs}\n`;
    }

    await sendMessage(chatId, reply);
    return NextResponse.json({ ok: true });
  }

  await sendMessage(chatId, "Доступные команды:\n/today — план на сегодня\n/shopping — список покупок");
  return NextResponse.json({ ok: true });
}
