import { useState, useCallback } from 'react';
import { RotateCcw, Play, Trophy } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import MathSection from '@/components/playground/MathSection';

type Peg = number[];

const DISK_COLORS = ['#22d3ee', '#3b82f6', '#60a5fa', '#a78bfa', '#f59e0b', '#fb7185', '#2dd4bf', '#fbbf24'];

export default function TowerOfHanoi() {
  const [numDisks, setNumDisks] = useState(4);
  const [pegs, setPegs] = useState<Peg[]>([[4, 3, 2, 1], [], []]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [solving, setSolving] = useState(false);
  const [won, setWon] = useState(false);

  const minMoves = Math.pow(2, numDisks) - 1;

  const reset = useCallback((n: number) => {
    setPegs([Array.from({ length: n }, (_, i) => n - i), [], []]);
    setSelected(null);
    setMoves(0);
    setWon(false);
    setSolving(false);
  }, []);

  const move = useCallback((from: number, to: number) => {
    setPegs((prev) => {
      const next = prev.map((p) => [...p]);
      const disk = next[from][next[from].length - 1];
      if (disk === undefined) return prev;
      if (next[to].length > 0 && next[to][next[to].length - 1] < disk) return prev;
      next[from].pop();
      next[to].push(disk);
      return next;
    });
    setMoves((m) => m + 1);
  }, []);

  const handleClick = (pegIdx: number) => {
    if (won || solving) return;
    if (selected === null) {
      if (pegs[pegIdx].length > 0) setSelected(pegIdx);
    } else if (selected === pegIdx) {
      setSelected(null);
    } else {
      move(selected, pegIdx);
      setSelected(null);
    }
  };

  const checkWin = () => {
    if (pegs[2].length === numDisks && !won) {
      setWon(true);
    }
  };
  if (pegs[2].length === numDisks && moves > 0 && !won) checkWin();

  const solveStep = (n: number, from: number, to: number, via: number, seq: [number, number][]) => {
    if (n === 0) return;
    solveStep(n - 1, from, via, to, seq);
    seq.push([from, to]);
    solveStep(n - 1, via, to, from, seq);
  };

  const autoSolve = async () => {
    if (solving || won) return;
    reset(numDisks);
    setSolving(true);
    const seq: [number, number][] = [];
    solveStep(numDisks, 0, 2, 1, seq);
    for (const [from, to] of seq) {
      await new Promise((r) => setTimeout(r, 400));
      move(from, to);
    }
    setSolving(false);
  };

  return (
    <Layout noFooter>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Math Playground</div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Tower of Hanoi</h1>
          <p className="text-slate-500">Move all disks from the left peg to the right peg. You can only place a smaller disk on a larger one.</p>
        </div>

        {won && (
          <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/25 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-slate-100">Solved in {moves} moves!</h3>
              <p className="text-sm text-slate-400">The minimum is {minMoves} moves. {moves === minMoves ? 'Perfect solution!' : `That's ${moves - minMoves} more than optimal.`}</p>
            </div>
          </div>
        )}

        {/* Game board */}
        <div className="lab-card p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 h-56 items-end">
            {pegs.map((peg, pegIdx) => (
              <button
                key={pegIdx}
                onClick={() => handleClick(pegIdx)}
                className={`relative h-full flex flex-col-reverse items-center pb-2 rounded-lg transition-all ${selected === pegIdx ? 'bg-primary-500/10 border border-primary-500/30' : 'border border-transparent hover:bg-lab-hover'}`}
              >
                {/* Base */}
                <div className="absolute bottom-0 w-full h-2 bg-lab-border rounded" />
                {/* Rod */}
                <div className="absolute bottom-2 w-1.5 h-full bg-lab-border rounded-t" style={{ left: '50%', transform: 'translateX(-50%)' }} />
                {/* Disks */}
                {peg.map((disk, i) => (
                  <div
                    key={i}
                    className="relative z-10 rounded-t-md mb-0.5 transition-all"
                    style={{
                      width: `${20 + disk * 12}px`,
                      height: '14px',
                      background: DISK_COLORS[disk - 1] ?? '#60a5fa',
                      opacity: i === peg.length - 1 ? 1 : 0.7,
                    }}
                  />
                ))}
                <div className="absolute bottom-3 text-xs text-slate-600 font-mono">{pegIdx === 0 ? 'A' : pegIdx === 1 ? 'B' : 'C'}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Disks:</label>
            <select value={numDisks} onChange={(e) => { const n = parseInt(e.target.value); setNumDisks(n); reset(n); }} className="lab-input text-sm w-16">
              {[3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={() => reset(numDisks)}><RotateCcw className="w-4 h-4" /> Reset</Button>
          <Button variant="cyan" size="sm" onClick={autoSolve} disabled={solving}><Play className="w-4 h-4" /> {solving ? 'Solving...' : 'Auto Solve'}</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="lab-card p-4"><div className="text-xs text-slate-500">Your Moves</div><div className="text-2xl font-mono font-bold text-cyan-400">{moves}</div></div>
          <div className="lab-card p-4"><div className="text-xs text-slate-500">Minimum (2ⁿ−1)</div><div className="text-2xl font-mono font-bold text-primary-400">{minMoves}</div></div>
        </div>

        {/* Math explanation */}
        <MathSection
          title="The Math Behind the Tower"
          intro={<>
            <p>The Tower of Hanoi is a classic example of <strong className="text-cyan-300">recursion</strong> — solving a problem by breaking it into smaller versions of itself. To move n disks from peg A to peg C, you first move the top n−1 disks to peg B, then move the largest disk to peg C, then move the n−1 disks from B to C.</p>
            <p>This gives the recurrence relation T(n) = 2T(n−1) + 1. Each step doubles the previous work plus one extra move. Solving this gives T(n) = 2ⁿ − 1, which is <strong className="text-cyan-300">exponential growth</strong>.</p>
          </>}
          formula="T(n) = 2T(n−1) + 1  ⟹  T(n) = 2ⁿ − 1"
          concepts={[
            { term: 'Recursion', desc: 'The solution references itself: move n−1 disks, then 1 disk, then n−1 disks again' },
            { term: 'Exponential Growth', desc: 'Each added disk doubles the minimum moves: 1, 3, 7, 15, 31, 63, 127, 255...' },
            { term: 'Mathematical Induction', desc: 'If the formula works for n, it provably works for n+1 — building from the base case up' },
            { term: 'Binary Pattern', desc: 'The move sequence maps to counting in binary — each bit flip corresponds to a disk move' },
          ]}
          whyMath="The Tower of Hanoi demonstrates that some problems grow exponentially with size. A mere 64 disks would require 18,446,744,073,709,551,615 moves — far more than the age of the universe in seconds. This is why exponential growth matters in computer science."
          tryThis="Set the disk count to 3 and solve it in exactly 7 moves. Then try 4 disks — the minimum is 15. Notice how each extra disk roughly doubles the effort."
        >
          {/* Interactive exponential growth chart */}
          <div className="bg-lab-surface rounded-lg p-4 space-y-2">
            <p className="text-xs text-slate-500 font-semibold">Exponential Growth: Moves vs Disks</p>
            <div className="space-y-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                const moves = Math.pow(2, n) - 1;
                const maxMoves = Math.pow(2, 8) - 1;
                const width = (moves / maxMoves) * 100;
                const isCurrent = n === numDisks;
                return (
                  <div key={n} className="flex items-center gap-2">
                    <span className={`text-xs font-mono w-12 ${isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>{n} disks</span>
                    <div className="flex-1 h-5 bg-lab-bg rounded overflow-hidden relative">
                      <div
                        className={`h-full rounded transition-all ${isCurrent ? 'bg-gradient-to-r from-cyan-500 to-primary-500' : 'bg-slate-700'}`}
                        style={{ width: `${Math.max(width, 2)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono w-16 text-right ${isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>{moves}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-600 italic mt-2">Each bar is twice as long as the previous — exponential growth made visible.</p>
          </div>
        </MathSection>
      </div>
    </Layout>
  );
}
