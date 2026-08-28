import { useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Slider from '@/components/ui/Slider';
import { EXPERIMENT_MAP } from '@/data/experiments';
import { round } from '@/utils/math';

const experiment = EXPERIMENT_MAP['geometry-lab'];

type Shape = 'triangle' | 'circle' | 'polygon';

export default function GeometryLab() {
  const [shape, setShape] = useState<Shape>('triangle');
  const [base, setBase] = useState(8);
  const [height, setHeight] = useState(6);
  const [radius, setRadius] = useState(5);
  const [sides, setSides] = useState(6);
  const [sideLength, setSideLength] = useState(4);

  const result = useMemo(() => {
    if (shape === 'triangle') return { area: base * height / 2, perimeter: base + 2 * Math.sqrt((base / 2) ** 2 + height ** 2), label: 'Triangle' };
    if (shape === 'circle') return { area: Math.PI * radius ** 2, perimeter: 2 * Math.PI * radius, label: 'Circle' };
    const apothem = sideLength / (2 * Math.tan(Math.PI / sides));
    return { area: sides * sideLength * apothem / 2, perimeter: sides * sideLength, label: `${sides}-gon` };
  }, [shape, base, height, radius, sides, sideLength]);

  const points = shape === 'triangle' ? `0,190 280,190 140,${190 - height * 20}` : Array.from({ length: sides }, (_, i) => { const angle = -Math.PI / 2 + i * 2 * Math.PI / sides; return `${140 + Math.cos(angle) * sideLength * 18},${140 + Math.sin(angle) * sideLength * 18}`; }).join(' ');

  return <Layout noFooter><ExperimentLayout experiment={experiment} activeTab="experiment" tabs={[{ id: 'experiment', label: 'Experiment' }, { id: 'theory', label: 'Theory' }]}><div className="grid lg:grid-cols-[320px_1fr] gap-6"><div className="lab-card p-5 space-y-5"><h2 className="text-sm font-semibold text-slate-200">Shape Controls</h2><div className="grid grid-cols-3 gap-2">{(['triangle', 'circle', 'polygon'] as Shape[]).map((item) => <button key={item} onClick={() => setShape(item)} className={`px-2 py-2 rounded-lg border text-xs capitalize transition-all ${shape === item ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300' : 'border-lab-border text-slate-500 hover:text-slate-200'}`}>{item}</button>)}</div>{shape === 'triangle' && <><Slider label="Base" value={base} onChange={setBase} min={2} max={12} /><Slider label="Height" value={height} onChange={setHeight} min={2} max={10} /></>}{shape === 'circle' && <Slider label="Radius" value={radius} onChange={setRadius} min={1} max={10} />}{shape === 'polygon' && <><Slider label="Number of sides" value={sides} onChange={setSides} min={3} max={12} /><Slider label="Side length" value={sideLength} onChange={setSideLength} min={1} max={8} /></>}<div className="formula-box space-y-1"><div>Area = {round(result.area, 2)} units²</div><div>Perimeter = {round(result.perimeter, 2)} units</div></div></div><div className="space-y-5"><div className="lab-card p-5"><h3 className="text-sm font-semibold text-slate-300 mb-4">Interactive {result.label}</h3><div className="h-[360px] rounded-xl math-grid flex items-center justify-center overflow-hidden"><svg viewBox="0 0 280 280" className="w-full h-full max-w-[420px]"><line x1="20" y1="240" x2="260" y2="240" stroke="#1a3a5c" /><line x1="140" y1="20" x2="140" y2="260" stroke="#1a3a5c" />{shape === 'circle' ? <circle cx="140" cy="140" r={radius * 18} fill="rgba(6,182,212,.12)" stroke="#22d3ee" strokeWidth="2" /> : <polygon points={points} fill="rgba(59,130,246,.16)" stroke="#60a5fa" strokeWidth="2" />}</svg></div></div><div className="grid sm:grid-cols-2 gap-4"><div className="lab-card p-5"><div className="section-label mb-2">Area</div><div className="text-3xl font-mono text-cyan-300">{round(result.area, 2)}</div><div className="text-xs text-slate-500 mt-2">The amount of surface enclosed.</div></div><div className="lab-card p-5"><div className="section-label mb-2">Perimeter</div><div className="text-3xl font-mono text-amber-300">{round(result.perimeter, 2)}</div><div className="text-xs text-slate-500 mt-2">The total distance around the boundary.</div></div></div><div className="lab-card p-5"><div className="section-label mb-2">Mathematical Insight</div><p className="text-sm text-slate-400 leading-relaxed">Geometry turns measurements into relationships. As you change a dimension, the diagram and formulas update together, making the connection between shape and quantity visible.</p></div></div></div></ExperimentLayout></Layout>;
}
