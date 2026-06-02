import { NextRequest, NextResponse } from "next/server";
import { sendToUser } from "@/lib/telegram";
import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/plan-generator";
import { aggregateShopping } from "@/lib/shopping-aggregator";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon
  const hour = now.getUTCHours();

  // Sunday 10:00 MSK = 07:00 UTC — shopping reminder
  if (dayOfWeek === 0 && hour === 7) {
    const weekStart = getWeekStart(new Date(now.getTime() + 86400000));
    const plan = await prisma.weekPlan.findUnique({ where: { weekStart } });

    if (plan) {
      const items = await aggregateShopping(plan.id);
      let msg = `🛒 <b>Напоминание: закупка продуктов!</b>\n\nСписок на эту неделю:\n`;
      for (const item of items.slice(0, 15)) {
        const packs = item.packagesNeeded ? ` × ${item.packagesNeeded}` : ``;
        msg += `• ${item.productName}${packs}\n`;
      }
      if (items.length > 15) msg += `... и ещё ${items.length - 15} позиций\n`;
      msg += `\nПолный список в приложении 👆`;
      await sendToUser(msg);
    } else {
      await sendToUser(`🛒 <b>Напоминание: закупка продуктов!</b>\n\nСначала сгенерируй план на неделю в приложении.`);
    }
  }

  // Monday 07:00 MSK = 04:00 UTC — cooking reminder
  if (dayOfWeek === 1 && hour === 4) {
    const weekStart = getWeekStart();
    const plan = await prisma.weekPlan.findUnique({
      where: { weekStart },
      include: { slots: { where: { day: "MON", mealType: "LUNCH" }, include: { meal: true } } },
    });

    const lunch = plan?.slots[0]?.meal;
    const msg = lunch
      ? `🍳 <b>Готовь обед на неделю!</b>\n\n${lunch.name}\n⏱ ~${lunch.prepMinutes} мин\n\n${lunch.notes ?? ""}`
      : `🍳 <b>Не забудь приготовить обед на неделю!</b>\nПосмотри план в приложении.`;

    await sendToUser(msg);
  }

  return NextResponse.json({ ok: true });
}
