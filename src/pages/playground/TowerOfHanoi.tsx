import { useState, useCallback } from 'react';
import { RotateCcw, Play, Info, Trophy } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

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
        <div className="lab-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">The Mathematics</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The minimum number of moves to solve the Tower of Hanoi with <strong className="text-cyan-300">n</strong> disks is <strong className="text-cyan-300">2ⁿ − 1</strong>. This grows exponentially — 3 disks need 7 moves, but 8 disks need 255 moves.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The solution is recursive: to move n disks from A to C, first move n−1 disks from A to B, then move the largest disk from A to C, then move n−1 disks from B to C. This self-referential structure is the heart of recursion.
          </p>
          <div className="formula-box text-center">min_moves(n) = 2ⁿ − 1</div>
        </div>
      </div>
    </Layout>
  );
}
