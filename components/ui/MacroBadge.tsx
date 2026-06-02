interface MacroBadgeProps {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  size?: "sm" | "md";
}

export default function MacroBadge({ kcal, protein, fat, carbs, size = "sm" }: MacroBadgeProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className={`flex gap-2 ${textSize} text-gray-500`}>
      <span className="font-semibold text-gray-800">{Math.round(kcal)} ккал</span>
      <span>Б {protein.toFixed(1)}г</span>
      <span>Ж {fat.toFixed(1)}г</span>
      <span>У {carbs.toFixed(1)}г</span>
    </div>
  );
}
