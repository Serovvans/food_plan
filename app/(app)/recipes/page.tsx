import { prisma } from "@/lib/prisma";
import RecipesClient from "./RecipesClient";

export default async function RecipesPage() {
  const meals = await prisma.meal.findMany({
    include: { ingredients: { include: { product: true } } },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  return <RecipesClient meals={meals} products={products} />;
}
