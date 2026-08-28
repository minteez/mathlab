import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { RotateCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import { EXPERIMENT_MAP } from '@/data/experiments';
import { evaluateFunction, linspace, round } from '@/utils/math';

const experiment = EXPERIMENT_MAP['function-explorer'];
const presets = [
  { label: 'Linear', expression: 'x' },
  { label: 'Quadratic', expression: 'x^2' },
  { label: 'Cubic', expression: 'x^3' },
  { label: 'Absolute', expression: 'abs(x)' },
  { label: 'Sine', expression: 'sin(x)' },
];

export default function FunctionExplorer() {
  const [expression, setExpression] = useState('a*x^2 + b*x + c');
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [range, setRange] = useState(10);

  const chartData = useMemo(() => linspace(-range, range, 161).map((x) => ({
    x: round(x, 2), y: evaluateFunction(expression.replace(/\ba\b/g, String(a)).replace(/\bb\b/g, String(b)).replace(/\bc\b/g, String(c)), x),
  })).filter((point) => point.y !== null && Math.abs(point.y) < 1000), [expression, a, b, c, range]);

  const choosePreset = (value: string) => {
    setExpression(value);
    if (value === 'x^2') { setA(1); setB(0); setC(0); }
  };

  return (
    <Layout noFooter>
      <ExperimentLayout experiment={experiment} activeTab="experiment" tabs={[{ id: 'experiment', label: 'Experiment' }, { id: 'theory', label: 'Theory' }]}>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <div className="space-y-4">
            <div className="lab-card p-5 space-y-5">
              <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-200">Function Controls</h2><Button variant="ghost" size="sm" onClick={() => { setExpression('a*x^2 + b*x + c'); setA(1); setB(0); setC(0); }}><RotateCcw className="w-4 h-4" /></Button></div>
              <div><label className="text-xs text-slate-500 block mb-2">Choose a model</label><div className="flex flex-wrap gap-2">{presets.map((preset) => <button key={preset.label} onClick={() => choosePreset(preset.expression)} className="px-2.5 py-1.5 text-xs rounded border border-lab-border bg-lab-surface text-slate-400 hover:text-slate-100 hover:border-primary-500/50 transition-all">{preset.label}</button>)}</div></div>
              <div><label className="text-xs text-slate-500 block mb-2">Equation</label><input value={expression} onChange={(e) => setExpression(e.target.value)} className="lab-input w-full" aria-label="Function equation" /><p className="text-xs text-slate-600 mt-2">Use x, a, b, c, sin, cos, sqrt, abs, and ^.</p></div>
              <Slider label="a — vertical stretch" value={a} onChange={setA} min={-3} max={3} step={0.1} />
              <Slider label="b — linear tilt" value={b} onChange={setB} min={-5} max={5} step={0.1} />
              <Slider label="c — vertical shift" value={c} onChange={setC} min={-5} max={5} step={0.1} />
              <Slider label="Visible x-range" value={range} onChange={setRange} min={4} max={20} />
            </div>
            <div className="formula-box">y = {expression.replace(/\ba\b/g, String(a)).replace(/\bb\b/g, String(b)).replace(/\bc\b/g, String(c))}</div>
          </div>
          <div className="space-y-5">
            <div className="lab-card p-5"><h3 className="text-sm font-semibold text-slate-300 mb-4">Live Function Graph</h3><ResponsiveContainer width="100%" height={390}><LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" /><XAxis dataKey="x" type="number" domain={[-range, range]} tick={{ fill: '#64748b', fontSize: 11 }} /><YAxis tick={{ fill: '#64748b', fontSize: 11 }} /><ReferenceLine x={0} stroke="#64748b" opacity={0.5} /><ReferenceLine y={0} stroke="#64748b" opacity={0.5} /><Tooltip contentStyle={{ background: '#0d1e35', border: '1px solid #1a3a5c', borderRadius: 8 }} formatter={(value: number) => [value?.toFixed(3), 'y']} /><Line type="monotone" dataKey="y" stroke="#22d3ee" strokeWidth={2} dot={false} connectNulls /></LineChart></ResponsiveContainer></div>
            <div className="grid sm:grid-cols-3 gap-3">{[{ label: 'a', value: a, meaning: 'Shape / stretch' }, { label: 'b', value: b, meaning: 'Tilt / slope' }, { label: 'c', value: c, meaning: 'Vertical shift' }].map((item) => <div key={item.label} className="lab-card p-4"><div className="text-2xl font-mono text-cyan-300">{item.label} = {item.value}</div><div className="text-xs text-slate-500 mt-1">{item.meaning}</div></div>)}</div>
            <div className="lab-card p-5"><div className="section-label mb-2">What did you discover?</div><p className="text-sm text-slate-400 leading-relaxed">Changing a coefficient changes a relationship, not just a picture. In y = ax² + bx + c, <strong className="text-slate-200">a</strong> controls opening and width, <strong className="text-slate-200">b</strong> changes the tilt and axis of symmetry, and <strong className="text-slate-200">c</strong> moves the graph up or down.</p></div>
          </div>
        </div>
      </ExperimentLayout>
    </Layout>
  );
}
