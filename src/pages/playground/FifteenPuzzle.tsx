import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Info, Trophy, Shuffle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

const SIZE = 4;
const TOTAL = SIZE * SIZE;

function isSolvable(tiles: number[]): boolean {
  let inversions = 0;
  const flat = tiles.filter((t) => t !== 0);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  const emptyRow = Math.floor(tiles.indexOf(0) / SIZE);
  // For 4x4: solvable if (inversions + emptyRowFromBottom) is odd
  const emptyRowFromBottom = SIZE - 1 - emptyRow;
  return (inversions + emptyRowFromBottom) % 2 === 1;
}

function shuffle(): number[] {
  let tiles: number[];
  do {
    tiles = Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL);
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles) || tiles.every((t, i) => t === ((i + 1) % TOTAL)));
  return tiles;
}

export default function FifteenPuzzle() {
  const [tiles, setTiles] = useState<number[]>(() => {
    const t = Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL);
    return t;
  });
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);

  const emptyIdx = tiles.indexOf(0);

  useEffect(() => {
    if (!running || won) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running, won]);

  const checkWin = useCallback((t: number[]) => {
    const solved = Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL);
    if (t.every((v, i) => v === solved[i])) {
      setWon(true);
      setRunning(false);
    }
  }, []);

  const move = useCallback((idx: number) => {
    if (won) return;
    const row = Math.floor(idx / SIZE);
    const col = idx % SIZE;
    const emptyRow = Math.floor(emptyIdx / SIZE);
    const emptyCol = emptyIdx % SIZE;
    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) !== 1) return;

    setTiles((prev) => {
      const next = [...prev];
      [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
      checkWin(next);
      return next;
    });
    setMoves((m) => m + 1);
    if (!running) setRunning(true);
  }, [emptyIdx, won, running, checkWin]);

  const reset = () => {
    setTiles(shuffle());
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setWon(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Layout noFooter>
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Math Playground</div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">15 Puzzle</h1>
          <p className="text-slate-500">Slide tiles to arrange numbers 1–15 in order, with the empty space in the bottom-right corner.</p>
        </div>

        {won && (
          <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/25 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-slate-100">Solved!</h3>
              <p className="text-sm text-slate-400">{moves} moves in {formatTime(seconds)}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="lab-card p-3"><div className="text-xs text-slate-500">Moves</div><div className="text-xl font-mono font-bold text-cyan-400">{moves}</div></div>
          <div className="lab-card p-3"><div className="text-xs text-slate-500">Time</div><div className="text-xl font-mono font-bold text-primary-400">{formatTime(seconds)}</div></div>
        </div>

        {/* Grid */}
        <div className="lab-card p-4 mb-6">
          <div className="grid grid-cols-4 gap-2">
            {tiles.map((val, i) => (
              <button
                key={i}
                onClick={() => move(i)}
                disabled={val === 0 || won}
                className={`aspect-square rounded-lg flex items-center justify-center text-xl font-bold font-mono transition-all ${
                  val === 0
                    ? 'bg-transparent border-2 border-dashed border-lab-border cursor-default'
                    : 'bg-gradient-to-br from-lab-card to-lab-surface border border-lab-border text-slate-200 hover:border-primary-500/40 hover:bg-primary-500/10 active:scale-95'
                }`}
              >
                {val === 0 ? '' : val}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button onClick={reset} size="sm"><Shuffle className="w-4 h-4" /> Shuffle &amp; Start</Button>
          <Button variant="ghost" size="sm" onClick={() => { setTiles(Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL)); setMoves(0); setSeconds(0); setRunning(false); setWon(false); }}><RotateCcw className="w-4 h-4" /> Reset</Button>
        </div>

        {/* Math explanation */}
        <div className="lab-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">The Mathematics</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The 15 Puzzle is a problem in <strong className="text-cyan-300">permutations</strong> and <strong className="text-cyan-300">parity</strong>. Every arrangement of tiles is either solvable or unsolvable — there is no sequence of moves that can transform one into the other.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            A configuration is solvable if and only if the number of inversions (pairs of tiles in the wrong order) plus the row of the empty space (counted from the bottom) is odd. Half of all possible arrangements are unsolvable — no matter how many moves you make.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The total number of possible configurations is <strong className="text-cyan-300">16! / 2 = 10,461,394,944,000</strong> — over 10 trillion. This vast <strong className="text-cyan-300">state space</strong> is what makes the puzzle challenging.
          </p>
        </div>
      </div>
    </Layout>
  );
}
