import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateWeekPlan, getWeekStart } from "@/lib/plan-generator";

export const GET = auth(async function (_req) {
  if (!_req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const weekStart = getWeekStart();
  const plan = await prisma.weekPlan.findUnique({
    where: { weekStart },
    include: { slots: { include: { meal: true } } },
  });

  return NextResponse.json({ plan });
}) as any;

export const POST = auth(async function (req) {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const weekStart = body.weekStart ? new Date(body.weekStart) : getWeekStart();

  const plan = await generateWeekPlan(weekStart);
  return NextResponse.json({ plan });
}) as any;
