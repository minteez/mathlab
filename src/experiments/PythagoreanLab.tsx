import { useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import { EXPERIMENT_MAP } from '@/data/experiments';

const experiment = EXPERIMENT_MAP['pythagorean-lab'];

export default function PythagoreanLab() {
  const [tab, setTab] = useState('experiment');
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [showSquares, setShowSquares] = useState(true);

  const c = Math.sqrt(a * a + b * b);
  const aSq = a * a;
  const bSq = b * b;
  const cSq = c * c;

  const maxSide = Math.max(a, b, c);
  const scale = 140 / maxSide;

  const toX = (x: number) => 200 + x * scale;
  const toY = (y: number) => 280 - y * scale;

  const angle = Math.atan2(b, a);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const TABS = [
    { id: 'experiment', label: 'Experiment' },
    { id: 'theory', label: 'Theory' },
  ];

  return (
    <Layout noFooter>
      <ExperimentLayout experiment={experiment} activeTab={tab} tabs={TABS} onTabChange={setTab}>
        {tab === 'experiment' && (
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-5">
              <div className="lab-card p-5 space-y-5">
                <h2 className="text-sm font-semibold text-slate-300">Triangle Controls</h2>
                <Slider label="Leg a" value={a} onChange={setA} min={1} max={12} step={0.5} displayValue={a.toString()} />
                <Slider label="Leg b" value={b} onChange={setB} min={1} max={12} step={0.5} displayValue={b.toString()} />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSquares(!showSquares)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      showSquares ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-500'
                    }`}
                  >
                    {showSquares ? 'Hide' : 'Show'} Squares
                  </button>
                  <Button onClick={() => { setA(3); setB(4); }} variant="secondary" size="sm">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </Button>
                </div>
              </div>

              <div className="lab-card p-5 space-y-3">
                <div className="section-label">Measurements</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-lab-surface rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">a²</div>
                    <div className="text-lg font-mono font-bold text-cyan-400">{aSq.toFixed(2)}</div>
                  </div>
                  <div className="bg-lab-surface rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">b²</div>
                    <div className="text-lg font-mono font-bold text-amber-400">{bSq.toFixed(2)}</div>
                  </div>
                  <div className="bg-lab-surface rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500">c²</div>
                    <div className="text-lg font-mono font-bold text-primary-400">{cSq.toFixed(2)}</div>
                  </div>
                </div>
                <div className="formula-box text-center">
                  a² + b² = c²<br />
                  {aSq.toFixed(2)} + {bSq.toFixed(2)} = {cSq.toFixed(2)}
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-lg p-3 text-center text-xs text-emerald-300">
                  Hypotenuse c = {c.toFixed(4)}
                </div>
              </div>

              <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">The Geometric Proof</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The squares on each side visually prove the theorem: the combined area of the blue and amber squares always equals the area of the larger square on the hypotenuse.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Pythagorean Visualization</h3>
                <svg viewBox="0 0 400 400" className="w-full h-[400px] bg-lab-surface rounded-xl">
                  <defs>
                    <pattern id="py-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#py-grid)" />

                  {/* Triangle */}
                  <polygon
                    points={`${toX(0)},${toY(0)} ${toX(a)},${toY(0)} ${toX(0)},${toY(b)}`}
                    fill="rgba(148,163,184,0.08)"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />

                  {/* Square on leg a (bottom) */}
                  {showSquares && (
                    <polygon
                      points={`${toX(0)},${toY(0)} ${toX(a)},${toY(0)} ${toX(a)},${toY(-a)} ${toX(0)},${toY(-a)}`}
                      fill="rgba(34,211,238,0.12)"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Square on leg b (left) */}
                  {showSquares && (
                    <polygon
                      points={`${toX(0)},${toY(0)} ${toX(0)},${toY(b)} ${toX(-b)},${toY(b)} ${toX(-b)},${toY(0)}`}
                      fill="rgba(245,158,11,0.12)"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Square on hypotenuse */}
                  {showSquares && (() => {
                    const p0 = { x: toX(0), y: toY(0) };
                    const p1 = { x: toX(a), y: toY(0) };
                    const p2 = { x: toX(a) + b * scale * sin, y: toY(0) - b * scale * cos };
                    const p3 = { x: toX(0) + b * scale * sin, y: toY(b) - b * scale * cos };
                    return (
                      <polygon
                        points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                        fill="rgba(59,130,246,0.12)"
                        stroke="#60a5fa"
                        strokeWidth="1.5"
                      />
                    );
                  })()}

                  {/* Labels */}
                  <text x={toX(a / 2)} y={toY(0) + 14} fill="#22d3ee" fontSize="12" textAnchor="middle" className="font-mono">a={a}</text>
                  <text x={toX(0) - 14} y={toY(b / 2)} fill="#f59e0b" fontSize="12" textAnchor="middle" className="font-mono" transform={`rotate(-90 ${toX(0) - 14} ${toY(b / 2)})`}>b={b}</text>
                  <text x={toX(a / 2) + 10} y={toY(b / 2) - 5} fill="#60a5fa" fontSize="12" textAnchor="middle" className="font-mono">c={c.toFixed(2)}</text>

                  {/* Right angle marker */}
                  <rect x={toX(0)} y={toY(2)} width={8 * scale} height={8 * scale} fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="lab-card p-4">
                  <div className="section-label">Square on a</div>
                  <div className="text-2xl font-mono text-cyan-400 mt-2">{aSq.toFixed(2)}</div>
                  <div className="text-xs text-slate-600 mt-1">area = {a}²</div>
                </div>
                <div className="lab-card p-4">
                  <div className="section-label">Square on b</div>
                  <div className="text-2xl font-mono text-amber-400 mt-2">{bSq.toFixed(2)}</div>
                  <div className="text-xs text-slate-600 mt-1">area = {b}²</div>
                </div>
                <div className="lab-card p-4">
                  <div className="section-label">Square on c</div>
                  <div className="text-2xl font-mono text-primary-400 mt-2">{cSq.toFixed(2)}</div>
                  <div className="text-xs text-slate-600 mt-1">area = {c.toFixed(2)}²</div>
                </div>
              </div>

              <div className="lab-card p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Try These Pythagorean Triples</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[[3, 4], [5, 12], [6, 8], [8, 15]].map(([x, y]) => (
                    <button
                      key={`${x}-${y}`}
                      onClick={() => { setA(x); setB(y); }}
                      className="px-3 py-2 rounded-lg bg-lab-surface border border-lab-border text-xs font-mono text-slate-400 hover:border-primary-500/40 hover:text-slate-200 transition-all"
                    >
                      a={x}, b={y}<br />c={Math.sqrt(x * x + y * y).toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'theory' && (
          <div className="max-w-3xl space-y-6">
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-cyan-300 mb-3">The Theorem</h3>
              <p className="text-slate-400 leading-relaxed">
                In a right-angled triangle, the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides. This relationship is over 2,500 years old and is one of the most fundamental results in all of mathematics.
              </p>
              <div className="formula-box mt-4 text-center text-lg">
                a² + b² = c²
              </div>
            </div>
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-primary-300 mb-3">Why It Works</h3>
              <p className="text-slate-400 leading-relaxed">
                The theorem connects algebra (squares of numbers) with geometry (areas of shapes). If you draw a square on each side of a right triangle, the two smaller squares can always be rearranged to exactly fill the largest square. This is not a coincidence — it is a deep property of Euclidean space.
              </p>
            </div>
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-amber-300 mb-3">The Distance Formula</h3>
              <p className="text-slate-400 leading-relaxed mb-3">
                The Pythagorean theorem is the foundation of the distance formula. The distance between any two points (x₁, y₁) and (x₂, y₂) is:
              </p>
              <div className="formula-box text-center">
                d = √((x₂−x₁)² + (y₂−y₁)²)
              </div>
              <p className="text-slate-400 leading-relaxed mt-3">
                The horizontal and vertical differences are the legs of a right triangle, and the distance is the hypotenuse. This is how GPS, computer graphics, and navigation all work.
              </p>
            </div>
          </div>
        )}
      </ExperimentLayout>
    </Layout>
  );
}
