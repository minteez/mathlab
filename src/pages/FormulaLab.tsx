import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sigma, Variable, Lightbulb, Calculator, ArrowRight, Trophy, Check, X, Shuffle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { FORMULAS, FORMULA_CATEGORIES } from '@/data/formulas';
import type { Formula } from '@/types';

const CHALLENGE_SCENARIOS = [
  { scenario: 'A circle has radius 7 cm. Which mathematical relationship would help you find its area?', answer: 'circle-area', options: ['circle-area', 'pythagorean', 'rectangle-area', 'slope'] },
  { scenario: 'A right triangle has legs of 5 cm and 12 cm. Which formula finds the hypotenuse?', answer: 'pythagorean', options: ['pythagorean', 'distance', 'triangle-area', 'trig-sine'] },
  { scenario: 'A dataset has values 3, 7, 2, 9, 4. Which formula finds the average?', answer: 'mean', options: ['mean', 'probability', 'ap-general', 'quadratic-formula'] },
  { scenario: 'The equation x² - 5x + 6 = 0 needs solving. Which formula gives the roots?', answer: 'quadratic-formula', options: ['quadratic-formula', 'slope', 'ap-general', 'circle-circumference'] },
  { scenario: 'Two points on a map are at (2, 3) and (8, 11). Which formula finds the distance between them?', answer: 'distance', options: ['distance', 'pythagorean', 'slope', 'trig-sine'] },
  { scenario: 'A sequence starts at 3 and adds 4 each time. Which formula finds the 15th term?', answer: 'ap-general', options: ['ap-general', 'mean', 'quadratic-formula', 'circle-area'] },
  { scenario: 'A line passes through (1, 2) and (5, 10). Which formula finds how steep it is?', answer: 'slope', options: ['slope', 'distance', 'rectangle-area', 'probability'] },
  { scenario: 'A triangle has base 8 cm and height 5 cm. Which formula finds its area?', answer: 'triangle-area', options: ['triangle-area', 'pythagorean', 'circle-area', 'mean'] },
  { scenario: 'A circle has radius 5. Which formula finds the distance around it?', answer: 'circle-circumference', options: ['circle-circumference', 'circle-area', 'pythagorean', 'distance'] },
  { scenario: 'A die is rolled. Which formula calculates how likely a 6 appears?', answer: 'probability', options: ['probability', 'mean', 'slope', 'ap-general'] },
];

export default function FormulaLab() {
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [challengeMode, setChallengeMode] = useState(false);

  const filtered = category === 'All' ? FORMULAS : FORMULAS.filter((f) => f.category === category);
  const selected = FORMULAS.find((f) => f.id === selectedId);

  if (challengeMode) {
    return <FormulaChallenge onExit={() => setChallengeMode(false)} />;
  }

  if (selected) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Formula Lab
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="tag">{selected.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-slate-100">{selected.name}</h1>

            <div className="formula-box text-lg text-center py-6">{selected.formula}</div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2"><Variable className="w-4 h-4" /> Variables</h3>
              <div className="space-y-1.5">
                {selected.variables.map((v) => (
                  <div key={v.symbol} className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-cyan-400 font-bold min-w-[60px]">{v.symbol}</span>
                    <span className="text-slate-400">{v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary-300 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Intuition</h3>
              <p className="text-slate-400 leading-relaxed">{selected.intuition}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2"><Calculator className="w-4 h-4" /> Example</h3>
              <p className="text-slate-400 leading-relaxed font-mono text-sm bg-lab-surface border border-lab-border rounded-lg p-4">{selected.example}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2"><Sigma className="w-4 h-4" /> Related Concept</h3>
              <p className="text-slate-400 leading-relaxed">{selected.relatedConcept}</p>
            </div>

            {selected.interactiveType !== 'none' && (
              <FormulaVisualizer formula={selected} />
            )}

            <Link to="/experiments" className="btn-secondary inline-flex items-center gap-2 text-sm">
              Try related experiments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Understand, Don't Memorize</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Formula Lab</h1>
          <p className="text-slate-500 max-w-2xl">
            Don't memorize formulas. Understand them. Each formula includes its variables, intuition, a worked example, and an interactive visualization so you can see the mathematics in action.
          </p>
        </div>

        <button onClick={() => setChallengeMode(true)} className="btn-primary inline-flex items-center gap-2 text-sm mb-8">
          <Trophy className="w-4 h-4" />
          Formula Challenge
        </button>

        <div className="flex items-center gap-2 flex-wrap mb-8">
          {FORMULA_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === c ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedId(f.id)}
              className="lab-card p-5 text-left hover:border-cyan-500/40 hover:bg-lab-hover transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="tag">{f.category}</Badge>
                {f.interactiveType !== 'none' && <span className="text-xs text-cyan-400">Interactive</span>}
              </div>
              <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{f.name}</h3>
              <div className="formula-box text-sm text-center">{f.formula}</div>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{f.intuition}</p>
              <span className="text-xs text-primary-400 flex items-center gap-1">
                Explore formula <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function FormulaChallenge({ onExit }: { onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [shuffled, setShuffled] = useState(() => [...CHALLENGE_SCENARIOS].sort(() => Math.random() - 0.5));

  const current = shuffled[idx];
  const formula = FORMULAS.find((f) => f.id === current?.answer);

  const check = () => {
    if (!selected || !current) return;
    setRevealed(true);
    setAnswered((a) => a + 1);
    if (selected === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setIdx((i) => (i + 1) % shuffled.length);
  };

  const restart = () => {
    setShuffled([...CHALLENGE_SCENARIOS].sort(() => Math.random() - 0.5));
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setAnswered(0);
  };

  if (!current || !formula) return null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <button onClick={onExit} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Formula Lab
        </button>

        <div className="mb-8">
          <div className="section-label mb-3">Which Formula Would You Use?</div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Formula Challenge</h1>
          <p className="text-slate-500">Read the scenario and choose the right formula. Learn by understanding, not memorizing.</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-500">Question {answered + 1} of {shuffled.length}</div>
          <div className="text-sm text-slate-500">Score: <span className="text-cyan-400 font-bold">{score}</span> / {answered}</div>
        </div>

        <div className="lab-card p-6 mb-6">
          <p className="text-slate-300 leading-relaxed mb-6">{current.scenario}</p>
          <div className="space-y-2">
            {current.options.map((optId) => {
              const optFormula = FORMULAS.find((f) => f.id === optId);
              if (!optFormula) return null;
              const isCorrect = optId === current.answer;
              const isSelected = selected === optId;
              let className = 'bg-lab-surface border border-lab-border text-slate-400 hover:border-primary-500/30';
              if (revealed && isCorrect) className = 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300';
              else if (revealed && isSelected && !isCorrect) className = 'bg-red-500/10 border border-red-500/40 text-red-300';
              else if (isSelected) className = 'bg-primary-500/15 border border-primary-500/40 text-primary-300';
              return (
                <button
                  key={optId}
                  onClick={() => !revealed && setSelected(optId)}
                  disabled={revealed}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${className}`}
                >
                  <div className="font-semibold text-sm">{optFormula.name}</div>
                  <div className="font-mono text-xs mt-0.5 opacity-70">{optFormula.formula}</div>
                  {revealed && isCorrect && <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400"><Check className="w-3 h-3" /> Correct!</div>}
                  {revealed && isSelected && !isCorrect && <div className="flex items-center gap-1 mt-1 text-xs text-red-400"><X className="w-3 h-3" /> Not this one</div>}
                </button>
              );
            })}
          </div>
        </div>

        {revealed && formula && (
          <div className="lab-card p-5 mb-6 space-y-2 border-emerald-500/20">
            <h3 className="text-sm font-semibold text-emerald-300">The Answer: {formula.name}</h3>
            <div className="formula-box text-center">{formula.formula}</div>
            <p className="text-sm text-slate-400 leading-relaxed">{formula.intuition}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          {!revealed ? (
            <button onClick={check} disabled={!selected} className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Check Answer
            </button>
          ) : (
            <>
              <button onClick={next} className="btn-primary text-sm">Next Question</button>
              <button onClick={restart} className="btn-secondary text-sm inline-flex items-center gap-2"><Shuffle className="w-4 h-4" /> Restart</button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

function FormulaVisualizer({ formula }: { formula: Formula }) {
  const [radius, setRadius] = useState(5);
  const [legA, setLegA] = useState(3);
  const [legB, setLegB] = useState(4);
  const [coeffA, setCoeffA] = useState(1);
  const [coeffB, setCoeffB] = useState(-5);
  const [coeffC, setCoeffC] = useState(6);
  const [angle, setAngle] = useState(30);
  const [firstTerm, setFirstTerm] = useState(3);
  const [commonDiff, setCommonDiff] = useState(4);
  const [nTerms, setNTerms] = useState(10);
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(6);
  const [y2, setY2] = useState(8);
  const [dataVals, setDataVals] = useState<number[]>([4, 7, 13, 2, 9]);

  const Slider = ({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) => (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}: <span className="text-cyan-400 font-mono">{value}</span></label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-primary-500" />
    </div>
  );

  if (formula.interactiveType === 'circle-area') {
    const area = Math.PI * radius * radius;
    const circ = 2 * Math.PI * radius;
    return (
      <div className="lab-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-cyan-300">Interactive Visualization</h3>
        <div className="flex items-center justify-center py-4">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius * 8} fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2" />
            <line x1="100" y1="100" x2={100 + radius * 8} y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
            <text x={100 + radius * 4} y="95" fill="#f59e0b" fontSize="12" textAnchor="middle">r={radius}</text>
          </svg>
        </div>
        <Slider label="Radius (r)" value={radius} min={1} max={12} step={0.5} onChange={setRadius} />
        <div className="grid grid-cols-2 gap-3">
          <div className="lab-card p-3"><div className="text-xs text-slate-500">Area (πr²)</div><div className="text-lg font-mono font-bold text-cyan-400">{area.toFixed(2)}</div></div>
          <div className="lab-card p-3"><div className="text-xs text-slate-500">Circumference (2πr)</div><div className="text-lg font-mono font-bold text-primary-400">{circ.toFixed(2)}</div></div>
        </div>
      </div>
    );
  }

  if (formula.interactiveType === 'pythagorean') {
    const hyp = Math.sqrt(legA * legA + legB * legB);
    const scale = 120 / Math.max(legA, legB, hyp);
    return (
      <div className="lab-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-cyan-300">Interactive Visualization</h3>
        <div className="flex items-center justify-center py-4">
          <svg width="220" height="220" viewBox="0 0 220 220">
            <polygon points={`20,200 ${20 + legA * scale},200 20,${200 - legB * scale}`} fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2" />
            <rect x="20" y="200" width={legA * scale * 0.3} height={legA * scale * 0.3} fill="rgba(96,165,250,0.15)" stroke="#60a5fa" strokeWidth="1" />
            <text x="20 + 30" y="220" fill="#60a5fa" fontSize="11">a²={legA*legA}</text>
            <text x="5" y={200 - legB * scale / 2} fill="#f59e0b" fontSize="11">b²={legB*legB}</text>
            <text x={20 + legA * scale * 0.4} y={200 - legB * scale * 0.7} fill="#22d3ee" fontSize="11">c²={(hyp*hyp).toFixed(0)}</text>
          </svg>
        </div>
        <Slider label="Leg a" value={legA} min={1} max={10} step={1} onChange={setLegA} />
        <Slider label="Leg b" value={legB} min={1} max={10} step={1} onChange={setLegB} />
        <div className="lab-card p-3"><div className="text-xs text-slate-500">Hypotenuse (c)</div><div className="text-lg font-mono font-bold text-cyan-400">{hyp.toFixed(4)}</div></div>
        <div className="text-xs text-slate-500 text-center">a² + b² = {legA*legA} + {legB*legB} = {legA*legA + legB*legB} = c² = {(hyp*hyp).toFixed(2)}</div>
      </div>
    );
  }

  if (formula.interactiveType === 'quadratic') {
    const disc = coeffB * coeffB - 4 * coeffA * coeffC;
    const hasRealRoots = disc >= 0;
    const root1 = hasRealRoots ? (-coeffB + Math.sqrt(disc)) / (2 * coeffA) : NaN;
    const root2 = hasRealRoots ? (-coeffB - Math.sqrt(disc)) / (2 * coeffA) : NaN;
    const points: { x: number; y: number }[] = [];
    for (let x = -10; x <= 10; x += 0.5) {
      points.push({ x, y: coeffA * x * x + coeffB * x + coeffC });
    }
    const yMax = Math.max(...points.map((p) => p.y), 1);
    const yMin = Math.min(...points.map((p) => p.y), -1);
    const xScale = 10;
    const yScale = 80 / Math.max(Math.abs(yMax), Math.abs(yMin), 1);
    return (
      <div className="lab-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-cyan-300">Interactive Visualization</h3>
        <div className="flex items-center justify-center py-4">
          <svg width="240" height="180" viewBox="0 0 240 180">
            <line x1="0" y1="90" x2="240" y2="90" stroke="#1a3a5c" strokeWidth="1" />
            <line x1="120" y1="0" x2="120" y2="180" stroke="#1a3a5c" strokeWidth="1" />
            <polyline points={points.map((p) => `${120 + p.x * xScale},${90 - p.y * yScale}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2" />
            {hasRealRoots && (
              <>
                <circle cx={120 + root1 * xScale} cy="90" r="4" fill="#f59e0b" />
                <circle cx={120 + root2 * xScale} cy="90" r="4" fill="#f59e0b" />
              </>
            )}
          </svg>
        </div>
        <div className="text-center text-sm font-mono text-slate-300">{coeffA}x² + ({coeffB})x + ({coeffC}) = 0</div>
        <Slider label="a" value={coeffA} min={-3} max={3} step={1} onChange={setCoeffA} />
        <Slider label="b" value={coeffB} min={-10} max={10} step={1} onChange={setCoeffB} />
        <Slider label="c" value={coeffC} min={-10} max={10} step={1} onChange={setCoeffC} />
        <div className="grid grid-cols-3 gap-2">
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Discriminant</div><div className="font-mono font-bold text-amber-400">{disc}</div></div>
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Root 1</div><div className="font-mono font-bold text-cyan-400">{hasRealRoots ? root1.toFixed(2) : '—'}</div></div>
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Root 2</div><div className="font-mono font-bold text-cyan-400">{hasRealRoots ? root2.toFixed(2) : '—'}</div></div>
        </div>
        <div className="text-xs text-slate-500 text-center">{disc > 0 ? 'Two distinct real roots' : disc === 0 ? 'One repeated root' : 'No real roots (complex)'}</div>
      </div>
    );
  }

  if (formula.interactiveType === 'slope' || formula.interactiveType === 'distance') {
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const slope = x2 !== x1 ? (y2 - y1) / (x2 - x1) : Infinity;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const scale = 16;
    return (
      <div className="lab-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-cyan-300">Interactive Visualization</h3>
        <div className="flex items-center justify-center py-4">
          <svg width="240" height="200" viewBox="0 0 240 200">
            <line x1="0" y1="100" x2="240" y2="100" stroke="#1a3a5c" strokeWidth="1" />
            <line x1="120" y1="0" x2="120" y2="200" stroke="#1a3a5c" strokeWidth="1" />
            <line x1={120 + x1 * scale} y1={100 - y1 * scale} x2={120 + x2 * scale} y2={100 - y2 * scale} stroke="#22d3ee" strokeWidth="2" />
            <circle cx={120 + x1 * scale} cy={100 - y1 * scale} r="5" fill="#60a5fa" />
            <circle cx={120 + x2 * scale} cy={100 - y2 * scale} r="5" fill="#f59e0b" />
            <circle cx={120 + midX * scale} cy={100 - midY * scale} r="4" fill="#a78bfa" />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Slider label="x₁" value={x1} min={-6} max={6} step={1} onChange={setX1} />
          <Slider label="y₁" value={y1} min={-5} max={5} step={1} onChange={setY1} />
          <Slider label="x₂" value={x2} min={-6} max={6} step={1} onChange={setX2} />
          <Slider label="y₂" value={y2} min={-5} max={5} step={1} onChange={setY2} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Distance</div><div className="font-mono font-bold text-cyan-400">{dist.toFixed(2)}</div></div>
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Slope</div><div className="font-mono font-bold text-primary-400">{isFinite(slope) ? slope.toFixed(2) : '∞'}</div></div>
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Midpoint</div><div className="font-mono font-bold text-amber-400 text-xs">({midX}, {midY})</div></div>
        </div>
      </div>
    );
  }

  if (formula.interactiveType === 'trig') {
    const rad = (angle * Math.PI) / 180;
    const sinV = Math.sin(rad);
    const cosV = Math.cos(rad);
    const tanV = Math.tan(rad);
    const r = 70;
    const px = 120 + cosV * r;
    const py = 100 - sinV * r;
    return (
      <div className="lab-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-cyan-300">Interactive Visualization</h3>
        <div className="flex items-center justify-center py-4">
          <svg width="240" height="200" viewBox="0 0 240 200">
            <circle cx="120" cy="100" r={r} fill="none" stroke="#1a3a5c" strokeWidth="1" />
            <line x1="120" y1="100" x2={120 + r} y2="100" stroke="#1a3a5c" strokeWidth="1" />
            <line x1="120" y1="100" x2={px} y2={py} stroke="#22d3ee" strokeWidth="2" />
            <line x1={px} y1={py} x2={px} y2="100" stroke="#f59e0b" strokeWidth="2" />
            <line x1="120" y1="100" x2={px} y2={py} stroke="#22d3ee" strokeWidth="2" />
            <circle cx={px} cy={py} r="4" fill="#22d3ee" />
          </svg>
        </div>
        <Slider label="Angle (degrees)" value={angle} min={0} max={90} step={1} onChange={setAngle} />
        <div className="grid grid-cols-3 gap-2">
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">sin θ</div><div className="font-mono font-bold text-cyan-400">{sinV.toFixed(4)}</div></div>
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">cos θ</div><div className="font-mono font-bold text-primary-400">{cosV.toFixed(4)}</div></div>
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">tan θ</div><div className="font-mono font-bold text-amber-400">{tanV.toFixed(4)}</div></div>
        </div>
      </div>
    );
  }

  if (formula.interactiveType === 'sequence') {
    const terms = Array.from({ length: nTerms }, (_, i) => firstTerm + i * commonDiff);
    const sum = terms.reduce((a, b) => a + b, 0);
    return (
      <div className="lab-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-cyan-300">Interactive Visualization</h3>
        <div className="flex flex-wrap gap-1.5 py-2">
          {terms.map((t, i) => (
            <span key={i} className="px-2 py-1 rounded bg-lab-surface border border-lab-border text-xs font-mono text-slate-300">{t}</span>
          ))}
        </div>
        <Slider label="First term (a)" value={firstTerm} min={-10} max={20} step={1} onChange={setFirstTerm} />
        <Slider label="Common difference (d)" value={commonDiff} min={-5} max={10} step={1} onChange={setCommonDiff} />
        <Slider label="Number of terms (n)" value={nTerms} min={2} max={15} step={1} onChange={setNTerms} />
        <div className="grid grid-cols-2 gap-3">
          <div className="lab-card p-3"><div className="text-xs text-slate-500">nth term: a + (n-1)d</div><div className="text-lg font-mono font-bold text-cyan-400">{terms[nTerms - 1]}</div></div>
          <div className="lab-card p-3"><div className="text-xs text-slate-500">Sum Sₙ = n/2 × (2a + (n-1)d)</div><div className="text-lg font-mono font-bold text-primary-400">{sum}</div></div>
        </div>
      </div>
    );
  }

  if (formula.interactiveType === 'statistics') {
    const mean = dataVals.reduce((a, b) => a + b, 0) / dataVals.length;
    const sorted = [...dataVals].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
    const freq: Record<number, number> = {};
    dataVals.forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const mode = Object.entries(freq).filter(([, c]) => c === maxFreq && maxFreq > 1).map(([v]) => v);
    return (
      <div className="lab-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-cyan-300">Interactive Visualization</h3>
        <div className="flex flex-wrap gap-1.5 py-2">
          {dataVals.map((v, i) => (
            <button key={i} onClick={() => setDataVals(dataVals.filter((_, idx) => idx !== i))} className="px-2 py-1 rounded bg-lab-surface border border-lab-border text-xs font-mono text-slate-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all">
              {v} ×
            </button>
          ))}
          <button onClick={() => setDataVals([...dataVals, Math.floor(Math.random() * 20) + 1])} className="px-2 py-1 rounded bg-primary-500/15 border border-primary-500/30 text-xs text-primary-300 hover:bg-primary-500/25 transition-all">
            + Add
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Mean</div><div className="font-mono font-bold text-cyan-400">{mean.toFixed(2)}</div></div>
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Median</div><div className="font-mono font-bold text-primary-400">{median}</div></div>
          <div className="lab-card p-2 text-center"><div className="text-xs text-slate-500">Mode</div><div className="font-mono font-bold text-amber-400 text-xs">{mode.length ? mode.join(', ') : 'None'}</div></div>
        </div>
      </div>
    );
  }

  return null;
}
