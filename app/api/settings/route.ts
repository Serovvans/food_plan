import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async function (_req) {
  if (!_req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({ settings });
}) as any;

export const PATCH = auth(async function (req) {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  return NextResponse.json({ settings });
}) as any;
