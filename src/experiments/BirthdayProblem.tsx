import { useState, useCallback, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Play, RotateCcw, Users, Info } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import { EXPERIMENT_MAP } from '@/data/experiments';
import { round, formatPercent } from '@/utils/math';

const experiment = EXPERIMENT_MAP['birthday-problem'];

function theoreticalProbability(n: number): number {
  let p = 1;
  for (let i = 0; i < n; i++) p *= (365 - i) / 365;
  return 1 - p;
}

function simulateOnce(n: number): boolean {
  const birthdays = new Set<number>();
  for (let i = 0; i < n; i++) {
    const day = Math.floor(Math.random() * 365);
    if (birthdays.has(day)) return true;
    birthdays.add(day);
  }
  return false;
}

function simulateMany(n: number, runs: number): number {
  let matches = 0;
  for (let i = 0; i < runs; i++) {
    if (simulateOnce(n)) matches++;
  }
  return matches / runs;
}

interface CurvePoint {
  groupSize: number;
  theoretical: number;
  experimental: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: number }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-lab-card border border-lab-border rounded-lg p-3 text-xs space-y-1 shadow-card">
      <p className="text-slate-400 font-mono">Group size: {label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.name === 'experimental' ? '#22d3ee' : '#f59e0b' }}>
          {p.name === 'experimental' ? 'Experimental' : 'Theoretical'}: {formatPercent(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function BirthdayProblem() {
  const [tab, setTab] = useState('experiment');
  const [groupSize, setGroupSize] = useState(23);
  const [runs, setRuns] = useState(1000);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ matches: number; runs: number; prob: number } | null>(null);
  const [curve, setCurve] = useState<CurvePoint[]>([]);
  const runRef = useRef(false);

  const run = useCallback(async () => {
    setRunning(true);
    runRef.current = true;
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!runRef.current) { resolve(); return; }
        const matches = simulateMany(groupSize, runs);
        setResult({ matches: Math.round(matches * runs), runs, prob: matches });
        resolve();
      }, 10);
    });
    setRunning(false);
  }, [groupSize, runs]);

  const buildCurve = useCallback(async () => {
    setRunning(true);
    runRef.current = true;
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!runRef.current) { resolve(); return; }
        const points: CurvePoint[] = [];
        for (let n = 1; n <= 60; n++) {
          const exp = simulateMany(n, 500);
          points.push({ groupSize: n, theoretical: theoreticalProbability(n), experimental: exp });
        }
        setCurve(points);
        resolve();
      }, 10);
    });
    setRunning(false);
  }, []);

  const reset = () => {
    runRef.current = false;
    setResult(null);
    setCurve([]);
    setRunning(false);
  };

  const theoProb = theoreticalProbability(groupSize);

  const TABS = [
    { id: 'experiment', label: 'Experiment' },
    { id: 'theory', label: 'Theory' },
  ];

  return (
    <Layout noFooter>
      <ExperimentLayout experiment={experiment} activeTab={tab} tabs={TABS} onTabChange={setTab}>
        {tab === 'experiment' && (
          <div className="grid lg:grid-cols-[340px_1fr] gap-6">
            <div className="space-y-5">
              <div className="lab-card p-5 space-y-5">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" /> Controls
                </h2>
                <Slider label="Group size" value={groupSize} onChange={setGroupSize} min={2} max={60} displayValue={`${groupSize} people`} />
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Simulations per run</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[100, 500, 1000, 5000].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setRuns(n); reset(); }}
                        className={`py-1.5 rounded text-xs font-mono font-medium transition-all ${
                          runs === n ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {n >= 1000 ? `${n / 1000}K` : n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={run} loading={running} className="flex-1" variant="primary">
                    <Play className="w-4 h-4" /> Run Simulation
                  </Button>
                  <Button onClick={reset} variant="secondary" size="md">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">Predict First</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  How many people need to be in a room before there's a 50%+ chance two share a birthday? Most people guess 100+. The real answer is just 23.
                </p>
                <div className="formula-box text-center">
                  P(match, {groupSize} people) = {formatPercent(theoProb)}
                </div>
              </div>

              {result && (
                <div className="lab-card p-5 space-y-3">
                  <div className="section-label">Results</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-lab-surface rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">Theoretical</div>
                      <div className="text-lg font-mono font-bold text-amber-400">{formatPercent(theoProb)}</div>
                    </div>
                    <div className="bg-lab-surface rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">Experimental</div>
                      <div className="text-lg font-mono font-bold text-cyan-400">{formatPercent(result.prob)}</div>
                    </div>
                    <div className="bg-lab-surface rounded-lg p-3 text-center col-span-2">
                      <div className="text-xs text-slate-500 mb-1">Matches / Simulations</div>
                      <div className="font-mono text-sm text-slate-300">{result.matches} / {result.runs.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">
                  Probability of a Shared Birthday vs Group Size
                </h3>
                {curve.length > 0 ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={curve} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" />
                      <XAxis dataKey="groupSize" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Group Size', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, 1]} tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Probability', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={0.5} stroke="#22d3ee" strokeDasharray="6 3" opacity={0.4} label={{ value: '50%', fill: '#22d3ee', fontSize: 10 }} />
                      <Line type="monotone" dataKey="experimental" stroke="#22d3ee" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="theoretical" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[320px] flex flex-col items-center justify-center text-slate-600 border border-dashed border-lab-border rounded-xl">
                    <button onClick={buildCurve} disabled={running} className="btn-primary text-sm">
                      Generate Full Curve (1–60 people)
                    </button>
                    <p className="text-xs mt-3 text-slate-600">Or run a single simulation first</p>
                  </div>
                )}
              </div>

              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Why So Few People?</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The key is that we are comparing <span className="text-cyan-300">all pairs</span> of people, not just one person against everyone else. In a group of 23, there are 253 pairs — each pair has a 1/365 chance of sharing a birthday. Those probabilities combine to cross 50% surprisingly fast.
                </p>
                <div className="formula-box mt-4 text-center">
                  P(match) = 1 − 365! / (365ⁿ × (365−n)!)
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  For {groupSize} people: {groupSize} × {groupSize - 1} / 2 = {(groupSize * (groupSize - 1)) / 2} pairs to check.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'theory' && (
          <div className="max-w-3xl space-y-6">
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-cyan-300 mb-3">The Birthday Paradox</h3>
              <p className="text-slate-400 leading-relaxed">
                The Birthday Problem asks: how many people need to be in a room before there is a greater than 50% chance that at least two share a birthday? Intuitively, most people guess over 100. The mathematical answer is just 23.
              </p>
            </div>
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-primary-300 mb-3">The Complement Method</h3>
              <p className="text-slate-400 leading-relaxed mb-3">
                Instead of computing the probability of a match directly, we compute the probability that <em>no one</em> shares a birthday, then subtract from 1:
              </p>
              <div className="formula-box">
                P(match) = 1 − P(no match)
              </div>
              <p className="text-slate-400 leading-relaxed mt-3">
                The first person has 365 options. The second has 364 remaining. The third has 363, and so on. For n people:
              </p>
              <div className="formula-box mt-2">
                P(no match) = (365/365) × (364/365) × (363/365) × ... × ((365−n+1)/365)
              </div>
            </div>
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-amber-300 mb-3">Key Milestones</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { n: 23, p: 0.507 }, { n: 30, p: 0.706 },
                  { n: 40, p: 0.891 }, { n: 50, p: 0.970 },
                  { n: 60, p: 0.994 }, { n: 70, p: 0.999 },
                ].map(({ n, p }) => (
                  <div key={n} className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                    <span className="text-sm text-slate-400">{n} people</span>
                    <span className="font-mono text-cyan-300 font-bold">{formatPercent(p)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </ExperimentLayout>
    </Layout>
  );
}
