import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();
  const dayStart = startOfDay(date);
  const dayEnd = new Date(dayStart.getTime() + 86400000);

  const logs = await prisma.dailyLog.findMany({
    where: { date: { gte: dayStart, lt: dayEnd } },
    include: { meal: true },
    orderBy: { loggedAt: "asc" },
  });

  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mealId, date } = await req.json();
  const meal = await prisma.meal.findUnique({ where: { id: mealId } });
  if (!meal) return NextResponse.json({ error: "Meal not found" }, { status: 404 });

  const logDate = date ? startOfDay(new Date(date)) : startOfDay(new Date());

  const log = await prisma.dailyLog.create({
    data: {
      mealId,
      date: logDate,
      kcal: meal.kcal,
      protein: meal.protein,
      fat: meal.fat,
      carbs: meal.carbs,
    },
  });

  return NextResponse.json({ log });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mealId, date } = await req.json();
  const logDate = date ? startOfDay(new Date(date)) : startOfDay(new Date());
  const dayEnd = new Date(logDate.getTime() + 86400000);

  await prisma.dailyLog.deleteMany({
    where: {
      mealId,
      date: { gte: logDate, lt: dayEnd },
    },
  });

  return NextResponse.json({ ok: true });
}
