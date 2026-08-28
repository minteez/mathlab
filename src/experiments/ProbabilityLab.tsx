import { useState, useCallback, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, BarChart, Bar
} from 'recharts';
import { Play, RotateCcw, Zap, Info } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Button from '@/components/ui/Button';
import { EXPERIMENT_MAP } from '@/data/experiments';
import { round, formatPercent } from '@/utils/math';

const experiment = EXPERIMENT_MAP['probability-lab'];

type ExpType = 'coin' | 'dice' | 'd20';

const THEORETICAL: Record<ExpType, number> = {
  coin: 0.5,
  dice: 1 / 6,
  d20: 0.05,
};

const EXP_LABELS: Record<ExpType, string> = {
  coin: 'Coin Flip (Heads)',
  dice: 'Dice Roll (Six)',
  d20: 'D20 Roll (Natural 20)',
};

const TRIAL_OPTIONS = [10, 50, 100, 500, 1000, 5000, 10000, 100000];

interface DataPoint {
  trial: number;
  experimental: number;
  theoretical: number;
}

function runSimulation(type: ExpType, n: number): { points: DataPoint[]; total: number; successes: number } {
  const theoretical = THEORETICAL[type];
  let successes = 0;
  const points: DataPoint[] = [];
  const checkpoints = new Set<number>();
  const step = Math.max(1, Math.floor(n / 80));
  for (let i = step; i <= n; i += step) checkpoints.add(i);
  checkpoints.add(n);

  for (let i = 1; i <= n; i++) {
    let success = false;
    if (type === 'coin') success = Math.random() < 0.5;
    else if (type === 'dice') success = Math.floor(Math.random() * 6) === 0;
    else success = Math.floor(Math.random() * 20) === 0;
    if (success) successes++;
    if (checkpoints.has(i)) {
      points.push({
        trial: i,
        experimental: round(successes / i, 4),
        theoretical,
      });
    }
  }
  return { points, total: n, successes };
}

function buildFreqData(type: ExpType, n: number): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    let outcome: string;
    if (type === 'coin') outcome = Math.random() < 0.5 ? 'H' : 'T';
    else if (type === 'dice') outcome = String(Math.floor(Math.random() * 6) + 1);
    else outcome = String(Math.floor(Math.random() * 20) + 1);
    counts[outcome] = (counts[outcome] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => (isNaN(+a[0]) ? a[0].localeCompare(b[0]) : +a[0] - +b[0])).map(([name, count]) => ({ name, count }));
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: number }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-lab-card border border-lab-border rounded-lg p-3 text-xs space-y-1 shadow-card">
      <p className="text-slate-400 font-mono">Trials: {label?.toLocaleString()}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.name === 'experimental' ? '#22d3ee' : '#f59e0b' }}>
          {p.name === 'experimental' ? 'Experimental' : 'Theoretical'}: {formatPercent(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function ProbabilityLab() {
  const [tab, setTab] = useState('experiment');
  const [expType, setExpType] = useState<ExpType>('coin');
  const [trials, setTrials] = useState(100);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ points: DataPoint[]; total: number; successes: number } | null>(null);
  const [freqData, setFreqData] = useState<{ name: string; count: number }[]>([]);
  const runRef = useRef(false);

  const run = useCallback(async () => {
    setRunning(true);
    runRef.current = true;
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!runRef.current) { resolve(); return; }
        const r = runSimulation(expType, trials);
        const f = buildFreqData(expType, Math.min(trials, 1000));
        setResult(r);
        setFreqData(f);
        resolve();
      }, 10);
    });
    setRunning(false);
  }, [expType, trials]);

  const reset = () => {
    runRef.current = false;
    setResult(null);
    setFreqData([]);
    setRunning(false);
  };

  const theoretical = THEORETICAL[expType];
  const experimental = result ? result.successes / result.total : null;
  const error = experimental !== null ? Math.abs(experimental - theoretical) : null;

  const TABS = [
    { id: 'experiment', label: 'Experiment' },
    { id: 'results', label: 'Results' },
    { id: 'theory', label: 'Theory' },
  ];

  return (
    <Layout noFooter>
      <ExperimentLayout experiment={experiment} activeTab={tab} tabs={TABS} onTabChange={setTab}>
        {tab === 'experiment' && (
          <div className="grid lg:grid-cols-[340px_1fr] gap-6">
            {/* Controls panel */}
            <div className="space-y-5">
              <div className="lab-card p-5 space-y-5">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Experiment Controls
                </h2>

                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Experiment Type</label>
                  <div className="space-y-2">
                    {(Object.entries(EXP_LABELS) as [ExpType, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => { setExpType(key); reset(); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                          expType === key
                            ? 'bg-primary-600/20 border-primary-500/50 text-primary-300'
                            : 'bg-lab-surface border-lab-border text-slate-400 hover:bg-lab-hover hover:text-slate-200'
                        }`}
                      >
                        <div className="font-medium">{label}</div>
                        <div className="text-xs opacity-60 mt-0.5">
                          P(success) = {THEORETICAL[key].toFixed(key === 'dice' ? 4 : 2)} ≈ {formatPercent(THEORETICAL[key])}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Number of Trials</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TRIAL_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => { setTrials(n); reset(); }}
                        className={`py-1.5 rounded text-xs font-mono font-medium transition-all ${
                          trials === n
                            ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                            : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300 hover:bg-lab-hover'
                        }`}
                      >
                        {n >= 1000 ? `${n / 1000}K` : n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={run} loading={running} className="flex-1" variant="primary">
                    <Play className="w-4 h-4" />
                    {running ? 'Running...' : 'Run Experiment'}
                  </Button>
                  <Button onClick={reset} variant="secondary" size="md">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Prediction box */}
              <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">Make Your Prediction</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Before running the experiment, predict: will the experimental probability be close to the theoretical probability with {trials.toLocaleString()} trials?
                </p>
                <div className="formula-box text-center">
                  P(success) = {THEORETICAL[expType].toFixed(4)} = {formatPercent(THEORETICAL[expType])}
                </div>
              </div>

              {/* Live results */}
              {result && (
                <div className="lab-card p-5 space-y-3">
                  <div className="section-label">Results</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-lab-surface rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">Theoretical</div>
                      <div className="text-lg font-mono font-bold text-amber-400">{formatPercent(theoretical)}</div>
                    </div>
                    <div className="bg-lab-surface rounded-lg p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">Experimental</div>
                      <div className="text-lg font-mono font-bold text-cyan-400">{formatPercent(experimental!)}</div>
                    </div>
                    <div className="bg-lab-surface rounded-lg p-3 text-center col-span-2">
                      <div className="text-xs text-slate-500 mb-1">Difference</div>
                      <div className={`text-lg font-mono font-bold ${error! < 0.01 ? 'text-emerald-400' : error! < 0.05 ? 'text-amber-400' : 'text-red-400'}`}>
                        {formatPercent(error!)}
                      </div>
                    </div>
                    <div className="bg-lab-surface rounded-lg p-3 text-center col-span-2">
                      <div className="text-xs text-slate-500 mb-1">Successes / Total</div>
                      <div className="font-mono text-sm text-slate-300">
                        {result.successes.toLocaleString()} / {result.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Visualization */}
            <div className="space-y-5">
              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">
                  Probability Convergence — Experimental vs Theoretical
                </h3>
                {result ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={result.points} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" />
                      <XAxis
                        dataKey="trial"
                        tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        label={{ value: 'Number of Trials', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }}
                      />
                      <YAxis
                        tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                        domain={[0, Math.max(0.8, theoretical * 2)]}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        label={{ value: 'Probability', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => value === 'experimental' ? 'Experimental' : 'Theoretical'}
                        wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                      />
                      <ReferenceLine y={theoretical} stroke="#f59e0b" strokeDasharray="6 3" opacity={0.6} />
                      <Line
                        type="monotone"
                        dataKey="experimental"
                        stroke="#22d3ee"
                        strokeWidth={1.5}
                        dot={false}
                        activeDot={{ r: 4, fill: '#22d3ee' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="theoretical"
                        stroke="#f59e0b"
                        strokeWidth={1.5}
                        strokeDasharray="6 3"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[320px] flex flex-col items-center justify-center text-slate-600 border border-dashed border-lab-border rounded-xl">
                    <Play className="w-8 h-8 mb-3 opacity-40" />
                    <p className="text-sm">Run the experiment to see convergence</p>
                  </div>
                )}
              </div>

              {freqData.length > 0 && (
                <div className="lab-card p-5">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">
                    Frequency Distribution ({Math.min(trials, 1000).toLocaleString()} trials sample)
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={freqData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ background: '#0d1e35', border: '1px solid #1a3a5c', borderRadius: '8px' }}
                        labelStyle={{ color: '#94a3b8' }}
                        itemStyle={{ color: '#22d3ee' }}
                      />
                      <Bar dataKey="count" fill="#06b6d4" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* What did you discover? */}
              {result && (
                <div className="lab-card p-5 border-emerald-500/20 bg-emerald-500/5 space-y-3">
                  <div className="section-label text-emerald-400/70">What Did You Discover?</div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {error! < 0.01
                      ? `Excellent! With ${trials.toLocaleString()} trials, the experimental probability (${formatPercent(experimental!)}) is very close to the theoretical probability (${formatPercent(theoretical)}). This demonstrates the Law of Large Numbers.`
                      : error! < 0.05
                      ? `With ${trials.toLocaleString()} trials, the experimental probability (${formatPercent(experimental!)}) is reasonably close to theoretical (${formatPercent(theoretical)}). Try increasing the trials to see better convergence.`
                      : `With only ${trials.toLocaleString()} trials, there is still significant variation. Increase to 10,000+ trials and watch the experimental probability converge toward ${formatPercent(theoretical)}.`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'results' && result && (
          <div className="max-w-2xl space-y-5">
            <div className="lab-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-200">Experiment Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Experiment Type', value: EXP_LABELS[expType] },
                  { label: 'Total Trials', value: result.total.toLocaleString() },
                  { label: 'Successes', value: result.successes.toLocaleString() },
                  { label: 'Failures', value: (result.total - result.successes).toLocaleString() },
                  { label: 'Theoretical P', value: formatPercent(theoretical) },
                  { label: 'Experimental P', value: formatPercent(experimental!) },
                  { label: 'Absolute Error', value: formatPercent(error!) },
                  { label: 'Relative Error', value: formatPercent(error! / theoretical) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-lab-surface rounded-lg p-3">
                    <div className="text-xs text-slate-500 mb-1">{label}</div>
                    <div className="font-mono text-slate-200 text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="formula-box space-y-2">
              <div className="text-xs text-slate-500 mb-2">Formula Used</div>
              <div>Experimental P = Successes ÷ Total Trials = {result.successes} ÷ {result.total} = {round(experimental!, 4)}</div>
              <div>Theoretical P = {THEORETICAL[expType].toFixed(4)}</div>
              <div>Error = |{round(experimental!, 4)} − {THEORETICAL[expType].toFixed(4)}| = {round(error!, 4)}</div>
            </div>
          </div>
        )}

        {tab === 'theory' && (
          <div className="max-w-2xl space-y-6">
            <div className="lab-card p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-100">The Law of Large Numbers</h2>
              <p className="text-slate-400 leading-relaxed">
                The Law of Large Numbers states that as the number of trials increases, the <strong className="text-slate-300">experimental probability</strong> approaches the <strong className="text-slate-300">theoretical probability</strong>.
              </p>
              <div className="formula-box">
                lim(n → ∞) P(experimental) = P(theoretical)
              </div>
              <p className="text-slate-400 leading-relaxed">
                This is one of the most fundamental theorems in probability theory. It explains why casinos are profitable over millions of games even when individual games are random, and why insurance companies can reliably predict claims across large populations.
              </p>
            </div>
            <div className="lab-card p-6 space-y-4">
              <h3 className="font-semibold text-slate-200">Theoretical Probabilities</h3>
              <div className="space-y-3">
                {(Object.entries(THEORETICAL) as [ExpType, number][]).map(([type, prob]) => (
                  <div key={type} className="flex items-center justify-between py-2 border-b border-lab-border last:border-0">
                    <span className="text-slate-400 text-sm">{EXP_LABELS[type]}</span>
                    <div className="formula-box text-xs px-3 py-1">{prob.toFixed(4)} ≈ {formatPercent(prob)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lab-card p-6 space-y-3">
              <h3 className="font-semibold text-slate-200">Why Does This Happen?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Each trial is independent — the outcome of one flip does not affect the next. Over many trials, the random fluctuations average out. With 10 trials, a run of 7 heads is possible just by chance. With 100,000 trials, the count of heads and tails balances toward the theoretical 50:50.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                The key insight: randomness does not mean unpredictability at scale. Even completely random events follow precise mathematical laws when repeated enough times.
              </p>
            </div>
          </div>
        )}

        {tab === 'results' && !result && (
          <div className="text-center py-20 text-slate-500">
            <p>Run the experiment first to see results here.</p>
          </div>
        )}
      </ExperimentLayout>
    </Layout>
  );
}
