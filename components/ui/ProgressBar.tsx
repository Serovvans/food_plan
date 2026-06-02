interface ProgressBarProps {
  label: string;
  value: number;
  target: number;
  color: string;
  unit?: string;
}

export default function ProgressBar({ label, value, target, color, unit = "г" }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const over = value > target;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={over ? "text-red-500 font-medium" : ""}>
          {Math.round(value)}/{target}{unit}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${over ? "bg-red-400" : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
