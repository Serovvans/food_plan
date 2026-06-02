"use client";

interface MacroRingProps {
  label: string;
  value: number;
  target: number;
  color: string;
  unit?: string;
}

function Ring({ value, target, color }: { value: number; target: number; color: string }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(1, value / target);
  const offset = circumference * (1 - pct);
  const over = value > target;

  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#f3f4f6" strokeWidth="6" />
      <circle
        cx="32" cy="32" r={r}
        fill="none"
        stroke={over ? "#f87171" : color}
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}

export default function MacroRing({ label, value, target, color, unit = "г" }: MacroRingProps) {
  const pct = Math.min(100, Math.round((value / target) * 100));

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <Ring value={value} target={target} color={color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-800">{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-gray-700">{label}</div>
        <div className="text-[10px] text-gray-400">{Math.round(value)}/{target}{unit}</div>
      </div>
    </div>
  );
}
