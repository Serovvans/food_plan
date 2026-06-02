export interface MacroTotals {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export function sumMacros(items: MacroTotals[]): MacroTotals {
  return items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      carbs: acc.carbs + item.carbs,
    }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export function macroPercent(value: number, target: number): number {
  return Math.min(100, Math.round((value / target) * 100));
}
