import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { aggregateShopping } from "@/lib/shopping-aggregator";
import { getWeekStart } from "@/lib/plan-generator";

export const GET = auth(async function (_req) {
  if (!_req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const weekStart = getWeekStart();
  const plan = await prisma.weekPlan.findUnique({ where: { weekStart } });

  if (!plan) return NextResponse.json({ items: [] });

  const items = await aggregateShopping(plan.id);
  return NextResponse.json({ items });
}) as any;
