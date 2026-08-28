import { useState, useCallback, useRef, useMemo } from 'react';
import { Play, RotateCcw, Zap, Info } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import { EXPERIMENT_MAP } from '@/data/experiments';

const experiment = EXPERIMENT_MAP['random-walk'];

interface WalkPoint { x: number; y: number; }

function generateWalk(steps: number, dimension: '1d' | '2d'): WalkPoint[] {
  const points: WalkPoint[] = [{ x: 0, y: 0 }];
  let x = 0, y = 0;
  for (let i = 0; i < steps; i++) {
    if (dimension === '1d') {
      x += Math.random() < 0.5 ? 1 : -1;
      y = i + 1;
    } else {
      const angle = Math.floor(Math.random() * 4) * 90;
      x += Math.round(Math.cos(angle * Math.PI / 180));
      y += Math.round(Math.sin(angle * Math.PI / 180));
    }
    points.push({ x, y });
  }
  return points;
}

function generateMultipleWalks(count: number, steps: number): WalkPoint[][] {
  return Array.from({ length: count }, () => generateWalk(steps, '1d'));
}

export default function RandomWalk() {
  const [tab, setTab] = useState('experiment');
  const [dimension, setDimension] = useState<'1d' | '2d'>('2d');
  const [steps, setSteps] = useState(200);
  const [numWalks, setNumWalks] = useState(1);
  const [walks, setWalks] = useState<WalkPoint[][]>([]);
  const [running, setRunning] = useState(false);
  const runRef = useRef(false);

  const run = useCallback(async () => {
    setRunning(true);
    runRef.current = true;
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!runRef.current) { resolve(); return; }
        if (dimension === '2d') {
          setWalks([generateWalk(steps, '2d')]);
        } else {
          setWalks(generateMultipleWalks(numWalks, steps));
        }
        resolve();
      }, 10);
    });
    setRunning(false);
  }, [dimension, steps, numWalks]);

  const reset = () => {
    runRef.current = false;
    setWalks([]);
    setRunning(false);
  };

  const currentWalk = walks[0] || [];
  const finalDistance = currentWalk.length > 0
    ? Math.sqrt(currentWalk[currentWalk.length - 1].x ** 2 + currentWalk[currentWalk.length - 1].y ** 2)
    : 0;

  const avgDistance1D = useMemo(() => {
    if (dimension !== '1d' || walks.length === 0) return null;
    const distances = walks.map(w => Math.abs(w[w.length - 1]?.x || 0));
    return distances.reduce((a, b) => a + b, 0) / distances.length;
  }, [walks, dimension]);

  const expectedDistance = Math.sqrt(steps);

  const TABS = [
    { id: 'experiment', label: 'Experiment' },
    { id: 'theory', label: 'Theory' },
  ];

  const bounds2D = useMemo(() => {
    if (!currentWalk.length) return 50;
    let max = 0;
    currentWalk.forEach(p => { max = Math.max(max, Math.abs(p.x), Math.abs(p.y)); });
    return Math.max(max + 2, 10);
  }, [currentWalk]);

  return (
    <Layout noFooter>
      <ExperimentLayout experiment={experiment} activeTab={tab} tabs={TABS} onTabChange={setTab}>
        {tab === 'experiment' && (
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-5">
              <div className="lab-card p-5 space-y-5">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Controls
                </h2>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Dimension</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['1d', '2d'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => { setDimension(d); reset(); }}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                          dimension === d ? 'bg-primary-600/20 border-primary-500/50 text-primary-300' : 'bg-lab-surface border-lab-border text-slate-400'
                        }`}
                      >
                        {d === '1d' ? '1D (line)' : '2D (grid)'}
                      </button>
                    ))}
                  </div>
                </div>
                <Slider label="Steps" value={steps} onChange={(v) => { setSteps(v); reset(); }} min={10} max={1000} step={10} />
                {dimension === '1d' && (
                  <Slider label="Number of walks" value={numWalks} onChange={(v) => { setNumWalks(v); reset(); }} min={1} max={20} displayValue={`${numWalks} walks`} />
                )}
                <div className="flex gap-2">
                  <Button onClick={run} loading={running} className="flex-1" variant="primary">
                    <Play className="w-4 h-4" /> Generate Walk
                  </Button>
                  <Button onClick={reset} variant="secondary" size="md">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">What to Watch For</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Each step goes in a random direction. Although the average displacement is zero, the typical distance from the origin grows as √(steps) — not linearly. This is the mathematics behind diffusion and Brownian motion.
                </p>
              </div>

              {walks.length > 0 && (
                <div className="lab-card p-5 space-y-3">
                  <div className="section-label">Statistics</div>
                  <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Steps</span>
                    <span className="font-mono text-sm text-slate-300">{steps}</span>
                  </div>
                  <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Expected distance (√n)</span>
                    <span className="font-mono text-sm text-amber-400">{expectedDistance.toFixed(2)}</span>
                  </div>
                  <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Actual distance</span>
                    <span className="font-mono text-sm text-cyan-400">{finalDistance.toFixed(2)}</span>
                  </div>
                  {avgDistance1D !== null && (
                    <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Avg distance ({numWalks} walks)</span>
                      <span className="font-mono text-sm text-cyan-400">{avgDistance1D.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-5">
              {dimension === '2d' ? (
                <div className="lab-card p-5">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">2D Random Walk</h3>
                  {currentWalk.length > 0 ? (
                    <svg viewBox={`0 0 400 400`} className="w-full h-[400px] bg-lab-surface rounded-xl">
                      <defs>
                        <pattern id="rw-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="400" height="400" fill="url(#rw-grid)" />
                      <line x1="200" y1="0" x2="200" y2="400" stroke="#64748b" strokeWidth="0.5" opacity="0.3" />
                      <line x1="0" y1="200" x2="400" y2="200" stroke="#64748b" strokeWidth="0.5" opacity="0.3" />
                      {(() => {
                        const scale = 180 / bounds2D;
                        const toX = (x: number) => 200 + x * scale;
                        const toY = (y: number) => 200 - y * scale;
                        return currentWalk.map((p, i) => {
                          if (i === 0) return null;
                          const prev = currentWalk[i - 1];
                          return <line key={i} x1={toX(prev.x)} y1={toY(prev.y)} x2={toX(p.x)} y2={toY(p.y)} stroke="#22d3ee" strokeWidth="1.5" opacity={0.3 + (i / currentWalk.length) * 0.7} />;
                        });
                      })()}
                      <circle cx="200" cy="200" r="4" fill="#f59e0b" />
                      {currentWalk.length > 1 && (() => {
                        const last = currentWalk[currentWalk.length - 1];
                        const scale = 180 / bounds2D;
                        return <circle cx={200 + last.x * scale} cy={200 - last.y * scale} r="5" fill="#22d3ee" stroke="#fff" strokeWidth="1" />;
                      })()}
                    </svg>
                  ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center text-slate-600 border border-dashed border-lab-border rounded-xl">
                      <Play className="w-8 h-8 mb-3 opacity-40" />
                      <p className="text-sm">Generate a walk to see it visualized</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="lab-card p-5">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">1D Random Walks</h3>
                  {walks.length > 0 ? (
                    <svg viewBox="0 0 400 300" className="w-full h-[300px] bg-lab-surface rounded-xl">
                      <line x1="30" y1="150" x2="390" y2="150" stroke="#64748b" strokeWidth="0.5" opacity="0.3" />
                      {walks.map((walk, wi) => {
                        const maxVal = Math.max(...walk.map(p => Math.abs(p.x)), 1);
                        const scale = 120 / maxVal;
                        const stepWidth = 340 / steps;
                        const color = `hsl(${(wi * 137) % 360}, 70%, 60%)`;
                        return walk.map((p, i) => {
                          if (i === 0) return null;
                          const prev = walk[i - 1];
                          return (
                            <line
                              key={`${wi}-${i}`}
                              x1={30 + (i - 1) * stepWidth}
                              y1={150 - prev.x * scale}
                              x2={30 + i * stepWidth}
                              y2={150 - p.x * scale}
                              stroke={color}
                              strokeWidth="1.5"
                              opacity="0.7"
                            />
                          );
                        });
                      })}
                    </svg>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-slate-600 border border-dashed border-lab-border rounded-xl">
                      <Play className="w-8 h-8 mb-3 opacity-40" />
                      <p className="text-sm">Generate walks to compare paths</p>
                    </div>
                  )}
                </div>
              )}

              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">The √n Law</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  After {steps} steps, the expected distance from the origin is √{steps} ≈ {expectedDistance.toFixed(2)}, not {steps}. This square-root scaling is fundamental to probability, physics, and finance. It explains why diffusion is slow and why stock prices wander unpredictably.
                </p>
                <div className="formula-box mt-4 text-center">
                  E[distance] ≈ √(n) = √({steps}) ≈ {expectedDistance.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'theory' && (
          <div className="max-w-3xl space-y-6">
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-cyan-300 mb-3">What Is a Random Walk?</h3>
              <p className="text-slate-400 leading-relaxed">
                A random walk is a path where each step is chosen at random. In 1D, each step goes left or right with equal probability. In 2D, each step goes up, down, left, or right. Despite the randomness, deep mathematical patterns emerge.
              </p>
            </div>
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-primary-300 mb-3">The Square Root Law</h3>
              <p className="text-slate-400 leading-relaxed mb-3">
                After n steps, the average distance from the starting point is proportional to √n — not n. This means:
              </p>
              <ul className="text-sm text-slate-400 space-y-2 ml-4 list-disc">
                <li>After 100 steps: typical distance ≈ 10</li>
                <li>After 10,000 steps: typical distance ≈ 100</li>
                <li>After 1,000,000 steps: typical distance ≈ 1,000</li>
              </ul>
              <p className="text-slate-400 leading-relaxed mt-3">
                To get twice as far, you need four times as many steps. This is why diffusion is slow.
              </p>
              <div className="formula-box mt-4 text-center">
                E[|Sₙ|] ≈ √n &nbsp;&nbsp; (where Sₙ is position after n steps)
              </div>
            </div>
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-amber-300 mb-3">Real-World Applications</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { title: 'Brownian Motion', desc: 'Particles in a fluid move randomly. Einstein used random walk theory to estimate molecular sizes.' },
                  { title: 'Stock Markets', desc: 'Price movements are often modeled as random walks, making them fundamentally unpredictable.' },
                  { title: 'Biology', desc: 'Bacteria search for food using biased random walks called "chemotaxis."' },
                  { title: 'Polymer Chains', desc: 'Molecular chains fold in random-walk patterns, determining material properties.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="bg-lab-surface rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-300">{title}</p>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
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
