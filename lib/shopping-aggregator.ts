import { prisma } from "@/lib/prisma";
import { MealType } from "@prisma/client";

export interface ShoppingItem {
  productId: string;
  productName: string;
  packageSizeG: number | null;
  totalGrams: number;
  packagesNeeded: number | null;
}

const WEEKDAY_TYPES: MealType[] = [
  MealType.BREAKFAST,
  MealType.LUNCH,
  MealType.DINNER,
  MealType.SNACK,
];

export async function aggregateShopping(weekPlanId: string): Promise<ShoppingItem[]> {
  const slots = await prisma.weekPlanSlot.findMany({
    where: { planId: weekPlanId, mealType: { in: WEEKDAY_TYPES } },
    include: {
      meal: {
        include: { ingredients: { include: { product: true } } },
      },
    },
  });

  const totals = new Map<string, { product: (typeof slots)[0]["meal"]["ingredients"][0]["product"]; totalGrams: number }>();

  for (const slot of slots) {
    for (const ing of slot.meal.ingredients) {
      const existing = totals.get(ing.productId);
      if (existing) {
        existing.totalGrams += ing.grams;
      } else {
        totals.set(ing.productId, { product: ing.product, totalGrams: ing.grams });
      }
    }
  }

  return Array.from(totals.values()).map(({ product, totalGrams }) => ({
    productId: product.id,
    productName: product.name,
    packageSizeG: product.packageSizeG,
    totalGrams: Math.round(totalGrams),
    packagesNeeded: product.packageSizeG
      ? Math.ceil(totalGrams / product.packageSizeG)
      : null,
  }));
}
