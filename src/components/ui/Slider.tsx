import { cn } from '@/utils/cn';

interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  displayValue?: string;
  className?: string;
}

export default function Slider({ value, onChange, min, max, step = 1, label, displayValue, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">{label}</span>
          <span className="font-mono text-cyan-300 text-xs px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20">
            {displayValue ?? value}
          </span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div className="w-full h-1.5 bg-lab-surface rounded-full border border-lab-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-cyan-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          aria-label={label}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-primary-500 shadow-glow-blue pointer-events-none transition-all"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}
