import { useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Slider from '@/components/ui/Slider';
import { EXPERIMENT_MAP } from '@/data/experiments';

const experiment = EXPERIMENT_MAP['fractal-lab'];

type Fractal = 'sierpinski' | 'koch';

function Triangle({ x, y, size, depth }: { x: number; y: number; size: number; depth: number }) {
  if (depth === 0) return <polygon points={`${x},${y + size} ${x + size / 2},${y} ${x + size},${y + size}`} fill="rgba(34,211,238,.16)" stroke="#22d3ee" strokeWidth="0.6" />;
  const half = size / 2;
  return <g><Triangle x={x} y={y + half} size={half} depth={depth - 1} /><Triangle x={x + half} y={y + half} size={half} depth={depth - 1} /><Triangle x={x + half / 2} y={y} size={half} depth={depth - 1} /></g>;
}

function Koch({ x1, y1, x2, y2, depth }: { x1: number; y1: number; x2: number; y2: number; depth: number }) {
  if (depth === 0) return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="1" />;
  const dx = (x2 - x1) / 3, dy = (y2 - y1) / 3;
  const ax = x1 + dx, ay = y1 + dy, bx = x1 + 2 * dx, by = y1 + 2 * dy;
  const px = ax + dx * 0.5 - dy * Math.sqrt(3) / 2, py = ay + dy * 0.5 + dx * Math.sqrt(3) / 2;
  return <g><Koch x1={x1} y1={y1} x2={ax} y2={ay} depth={depth - 1} /><Koch x1={ax} y1={ay} x2={px} y2={py} depth={depth - 1} /><Koch x1={px} y1={py} x2={bx} y2={by} depth={depth - 1} /><Koch x1={bx} y1={by} x2={x2} y2={y2} depth={depth - 1} /></g>;
}

export default function FractalLab() {
  const [fractal, setFractal] = useState<Fractal>('sierpinski');
  const [depth, setDepth] = useState(4);
  const segments = fractal === 'sierpinski' ? 3 ** depth : 3 * 4 ** depth;
  const dimension = fractal === 'sierpinski' ? Math.log(3) / Math.log(2) : Math.log(4) / Math.log(3);
  const visual = useMemo(() => fractal === 'sierpinski' ? <Triangle x={40} y={20} size={240} depth={depth} /> : <g><Koch x1={35} y1={190} x2={265} y2={190} depth={depth} /><Koch x1={265} y1={190} x2={150} y2={-9} depth={depth} /><Koch x1={150} y1={-9} x2={35} y2={190} depth={depth} /></g>, [fractal, depth]);
  return <Layout noFooter><ExperimentLayout experiment={experiment} activeTab="experiment" tabs={[{ id: 'experiment', label: 'Experiment' }, { id: 'theory', label: 'Theory' }]}><div className="grid lg:grid-cols-[300px_1fr] gap-6"><div className="lab-card p-5 space-y-5"><h2 className="text-sm font-semibold text-slate-200">Fractal Controls</h2><div className="grid grid-cols-2 gap-2">{(['sierpinski', 'koch'] as Fractal[]).map((item) => <button key={item} onClick={() => setFractal(item)} className={`p-2 rounded border text-xs capitalize ${fractal === item ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300' : 'border-lab-border text-slate-500'}`}>{item}</button>)}</div><Slider label="Recursion depth" value={depth} onChange={setDepth} min={0} max={6} /><div className="formula-box space-y-2"><div>Iteration {depth}</div><div>Segments: {segments.toLocaleString()}</div><div>Dimension: {dimension.toFixed(4)}</div></div><p className="text-xs text-slate-500 leading-relaxed">Each iteration applies the same simple rule to every segment. Complexity grows exponentially.</p></div><div className="space-y-5"><div className="lab-card p-5"><h3 className="text-sm font-semibold text-slate-300 mb-4">Recursive Structure</h3><div className="h-[420px] rounded-xl math-grid flex items-center justify-center overflow-hidden"><svg viewBox="0 0 300 260" className="w-full h-full">{visual}</svg></div></div><div className="lab-card p-5 border-cyan-500/20 bg-cyan-500/5"><div className="section-label mb-2">What did you discover?</div><p className="text-sm text-slate-400 leading-relaxed">A fractal can have a fractional dimension. The Sierpiński triangle has dimension log(3)/log(2) ≈ 1.585, between a line and a surface. The Koch curve has infinite perimeter but encloses a finite area when closed into a snowflake.</p></div></div></div></ExperimentLayout></Layout>;
}
