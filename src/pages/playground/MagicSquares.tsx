import { useState } from 'react';
import { RotateCcw, Check, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import MathSection from '@/components/playground/MathSection';

const SIZE = 3;
const MAGIC_SUM = 15;

function generateSolved(): number[] {
  // Siamese method for 3x3
  return [2, 7, 6, 9, 5, 1, 4, 3, 8];
}

function generatePuzzle(): { grid: (number | null)[]; solution: number[] } {
  const solution = generateSolved();
  const grid: (number | null)[] = [...solution];
  // Remove 4 random cells
  const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).slice(0, 4);
  indices.forEach((i) => { grid[i] = null; });
  return { grid, solution };
}

export default function MagicSquares() {
  const [{ grid, solution }, setPuzzle] = useState(generatePuzzle);
  const [userGrid, setUserGrid] = useState<(number | null)[]>(grid);
  const [selected, setSelected] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const reset = () => {
    const p = generatePuzzle();
    setPuzzle(p);
    setUserGrid(p.grid);
    setSelected(null);
    setShowSolution(false);
  };

  const placeNumber = (n: number) => {
    if (selected === null) return;
    setUserGrid((prev) => {
      const next = [...prev];
      next[selected] = n;
      return next;
    });
    setSelected(null);
  };

  const isComplete = userGrid.every((v, i) => v === solution[i]);
  const rows = [0, 1, 2].map((r) => userGrid.slice(r * 3, r * 3 + 3).reduce<number>((a, b) => a + (b ?? 0), 0));
  const cols = [0, 1, 2].map((c) => [0, 1, 2].reduce<number>((a, r) => a + (userGrid[r * 3 + c] ?? 0), 0));
  const diag1 = userGrid[0]! + userGrid[4]! + userGrid[8]!;
  const diag2 = userGrid[2]! + userGrid[4]! + userGrid[6]!;

  return (
    <Layout noFooter>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Math Playground</div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Magic Squares</h1>
          <p className="text-slate-500">Fill the empty cells so every row, column, and diagonal sums to {MAGIC_SUM}.</p>
        </div>

        {isComplete && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-semibold">Correct! Every row, column, and diagonal sums to {MAGIC_SUM}.</span>
          </div>
        )}

        {/* Grid */}
        <div className="lab-card p-6 mb-6">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {userGrid.map((val, i) => {
              const isGiven = grid[i] !== null;
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => !isGiven && setSelected(isSelected ? null : i)}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold font-mono transition-all ${
                    isGiven
                      ? 'bg-lab-surface border-lab-border text-slate-400 cursor-default'
                      : isSelected
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                      : val !== null
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:border-cyan-500/50'
                      : 'bg-lab-surface border-lab-border border-dashed text-slate-600 hover:border-primary-500/30'
                  }`}
                >
                  {val ?? ''}
                </button>
              );
            })}
          </div>

          {/* Number picker */}
          {selected !== null && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => placeNumber(n)}
                  className="w-10 h-10 rounded-lg bg-lab-surface border border-lab-border text-lg font-mono font-bold text-slate-300 hover:bg-primary-500/15 hover:border-primary-500/40 hover:text-primary-300 transition-all"
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sums */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6 text-center">
          {rows.map((s, i) => (
            <div key={i} className={`text-sm font-mono font-bold ${s === MAGIC_SUM ? 'text-emerald-400' : 'text-slate-500'}`}>{s}</div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button variant="secondary" size="sm" onClick={reset}><RotateCcw className="w-4 h-4" /> New Puzzle</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowSolution(!showSolution)}><Sparkles className="w-4 h-4" /> {showSolution ? 'Hide' : 'Show'} Solution</Button>
        </div>

        {showSolution && (
          <div className="lab-card p-4 mb-6">
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
              {solution.map((v, i) => (
                <div key={i} className="aspect-square rounded-lg bg-lab-surface border border-lab-border flex items-center justify-center text-lg font-mono font-bold text-slate-400">{v}</div>
              ))}
            </div>
          </div>
        )}

        {/* Math explanation */}
        <MathSection
          title="The Math Behind Magic Squares"
          intro={<>
            <p>A magic square of size {SIZE} uses the numbers 1 to 9, each exactly once. Every row, column, and diagonal sums to the same value — the <strong className="text-cyan-300">magic constant</strong>.</p>
            <p>Why is the magic constant 15? The sum of all numbers from 1 to 9 is 1+2+3+...+9 = 45. There are 3 rows, and each row sums to the same value, so the magic constant = 45 ÷ 3 = 15.</p>
            <p>The challenge is a <strong className="text-cyan-300">constraint satisfaction problem</strong>: arrange 9 numbers so that 8 lines (3 rows + 3 columns + 2 diagonals) all sum to 15 simultaneously. This is much harder than it looks.</p>
          </>}
          formula="Magic constant = n(n² + 1) / 2 = 3(9 + 1) / 2 = 15"
          concepts={[
            { term: 'Magic Constant', desc: 'The fixed sum every row, column, and diagonal must equal: 15 for a 3×3 square' },
            { term: 'Constraint Satisfaction', desc: 'Multiple conditions must hold simultaneously — changing one cell affects many lines' },
            { term: 'Symmetry', desc: 'All 3×3 magic squares are rotations or reflections of a single solution' },
            { term: 'Permutations', desc: 'There are 9! = 362,880 ways to arrange 1–9 in a grid, but only 8 satisfy all constraints' },
          ]}
          whyMath="A magic square is a constraint problem: 8 equations must all be satisfied by a single arrangement of 9 numbers. The fact that only one fundamental solution exists (up to symmetry) is a beautiful result in combinatorics."
          tryThis="Notice that 5 is always in the center. Even numbers always occupy the corners. Try to find a magic square where this is NOT true — you will not succeed, because mathematics forbids it."
        >
          <div className="bg-lab-surface rounded-lg p-4 space-y-2">
            <p className="text-xs text-slate-500 font-semibold">Why 15? The Derivation</p>
            <div className="space-y-1 text-sm text-slate-400 font-mono">
              <p>Sum of 1 to 9: 1 + 2 + 3 + ... + 9 = 45</p>
              <p>3 rows, each summing to the same value S</p>
              <p>3 × S = 45  →  S = 15</p>
            </div>
          </div>
        </MathSection>
      </div>
    </Layout>
  );
}
