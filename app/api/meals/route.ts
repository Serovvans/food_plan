import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MealType } from "@prisma/client";

export const GET = auth(async function (req) {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as MealType | null;

  const meals = await prisma.meal.findMany({
    where: type ? { type } : undefined,
    include: { ingredients: { include: { product: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ meals });
}) as any;

export const POST = auth(async function (req) {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, type, prepMinutes, notes, ingredients } = await req.json();

  let kcal = 0, protein = 0, fat = 0, carbs = 0;
  for (const ing of ingredients as { productId: string; grams: number }[]) {
    const product = await prisma.product.findUnique({ where: { id: ing.productId } });
    if (!product) continue;
    const f = ing.grams / 100;
    kcal += product.kcalPer100 * f;
    protein += product.proteinPer100 * f;
    fat += product.fatPer100 * f;
    carbs += product.carbsPer100 * f;
  }

  const meal = await prisma.meal.create({
    data: {
      name, type, prepMinutes: prepMinutes ?? 15, notes,
      kcal: Math.round(kcal),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      ingredients: {
        create: (ingredients as { productId: string; grams: number }[]).map((i) => ({
          productId: i.productId,
          grams: i.grams,
        })),
      },
    },
    include: { ingredients: { include: { product: true } } },
  });

  return NextResponse.json({ meal }, { status: 201 });
}) as any;
