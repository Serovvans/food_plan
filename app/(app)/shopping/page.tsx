import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/plan-generator";
import { aggregateShopping } from "@/lib/shopping-aggregator";
import ShoppingClient from "./ShoppingClient";

export default async function ShoppingPage() {
  const weekStart = getWeekStart();
  const plan = await prisma.weekPlan.findUnique({ where: { weekStart } });

  const items = plan ? await aggregateShopping(plan.id) : [];

  return <ShoppingClient items={items} hasPlan={!!plan} />;
}
