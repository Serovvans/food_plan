import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateWeekPlan, getWeekStart } from "@/lib/plan-generator";

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const weekStart = getWeekStart();
  const plan = await prisma.weekPlan.findUnique({
    where: { weekStart },
    include: { slots: { include: { meal: true } } },
  });

  return NextResponse.json({ plan });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const weekStart = body.weekStart ? new Date(body.weekStart) : getWeekStart();

  const plan = await generateWeekPlan(weekStart);
  return NextResponse.json({ plan });
}
