import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async function (_req) {
  if (!_req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ products });
}) as any;

export const POST = auth(async function (req) {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const product = await prisma.product.create({ data });
  return NextResponse.json({ product }, { status: 201 });
}) as any;
