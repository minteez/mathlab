import { useState, useCallback } from 'react';
import { RotateCcw, Info, Trophy, Brain } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

const INITIAL_PILES = [3, 4, 5];

function nimSum(piles: number[]): number {
  return piles.reduce((a, b) => a ^ b, 0);
}

function computerMove(piles: number[]): number[] {
  const sum = nimSum(piles);
  if (sum === 0) {
    // Losing position — take 1 from the first non-empty pile
    const idx = piles.findIndex((p) => p > 0);
    if (idx === -1) return piles;
    const next = [...piles];
    next[idx] -= 1;
    return next;
  }
  for (let i = 0; i < piles.length; i++) {
    const target = piles[i] ^ sum;
    if (target < piles[i]) {
      const next = [...piles];
      next[i] = piles[i] - target;
      return next;
    }
  }
  return piles;
}

export default function Nim() {
  const [piles, setPiles] = useState<number[]>(INITIAL_PILES);
  const [selectedPile, setSelectedPile] = useState<number | null>(null);
  const [removeCount, setRemoveCount] = useState(1);
  const [turn, setTurn] = useState<'player' | 'computer'>('player');
  const [winner, setWinner] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<string>('');

  const total = piles.reduce((a, b) => a + b, 0);

  const checkWinner = useCallback((next: number[], nextTurn: 'player' | 'computer') => {
    if (next.every((p) => p === 0)) {
      // The player whose turn it is now lost (they took the last object in misère? No — standard Nim: last to move wins)
      setWinner(nextTurn === 'player' ? 'computer' : 'player');
    }
  }, []);

  const playerMove = () => {
    if (selectedPile === null || winner) return;
    const count = Math.min(removeCount, piles[selectedPile]);
    if (count <= 0) return;
    const next = [...piles];
    next[selectedPile] -= count;
    setPiles(next);
    setLastMove(`You took ${count} from pile ${selectedPile + 1}`);
    setSelectedPile(null);
    setRemoveCount(1);
    if (next.every((p) => p === 0)) {
      setWinner('player');
      return;
    }
    setTurn('computer');
    setTimeout(() => {
      const compNext = computerMove(next);
      setPiles(compNext);
      const compIdx = next.findIndex((p, i) => p !== compNext[i]);
      const compCount = compIdx >= 0 ? next[compIdx] - compNext[compIdx] : 0;
      setLastMove(`Computer took ${compCount} from pile ${compIdx + 1}`);
      if (compNext.every((p) => p === 0)) {
        setWinner('computer');
        return;
      }
      setTurn('player');
    }, 600);
  };

  const reset = () => {
    setPiles(INITIAL_PILES);
    setSelectedPile(null);
    setRemoveCount(1);
    setTurn('player');
    setWinner(null);
    setLastMove('');
  };

  const currentNimSum = nimSum(piles);

  return (
    <Layout noFooter>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Math Playground</div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Nim</h1>
          <p className="text-slate-500">Take objects from a pile. The player who takes the last object wins. Can you beat the computer?</p>
        </div>

        {winner && (
          <div className={`mb-6 p-5 rounded-xl border flex items-center gap-3 ${winner === 'player' ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-red-500/10 border-red-500/25'}`}>
            <Trophy className={`w-6 h-6 flex-shrink-0 ${winner === 'player' ? 'text-amber-400' : 'text-red-400'}`} />
            <div>
              <h3 className="font-bold text-slate-100">{winner === 'player' ? 'You win!' : 'Computer wins!'}</h3>
              <p className="text-sm text-slate-400">{winner === 'player' ? 'You took the last object. Well played!' : 'The computer took the last object. Try again!'}</p>
            </div>
          </div>
        )}

        {/* Piles */}
        <div className="lab-card p-6 mb-6">
          <div className="flex justify-around items-end gap-4">
            {piles.map((count, i) => (
              <button
                key={i}
                onClick={() => !winner && turn === 'player' && count > 0 && setSelectedPile(selectedPile === i ? null : i)}
                disabled={count === 0 || winner !== null || turn !== 'player'}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  selectedPile === i
                    ? 'border-primary-500/50 bg-primary-500/10'
                    : count === 0
                    ? 'border-lab-border bg-lab-surface opacity-30'
                    : 'border-lab-border bg-lab-surface hover:border-primary-500/30'
                }`}
              >
                <div className="flex flex-col-reverse gap-1 items-center">
                  {Array.from({ length: count }, (_, j) => (
                    <div key={j} className="w-8 h-3 rounded bg-gradient-to-r from-cyan-500/40 to-primary-500/40 border border-cyan-500/30" />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-mono">Pile {i + 1}: {count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        {turn === 'player' && !winner && (
          <div className="flex items-center gap-3 mb-6">
            {selectedPile !== null && (
              <>
                <label className="text-xs text-slate-500">Remove:</label>
                <select value={removeCount} onChange={(e) => setRemoveCount(parseInt(e.target.value))} className="lab-input text-sm w-20">
                  {Array.from({ length: piles[selectedPile] }, (_, j) => j + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <Button onClick={playerMove} size="sm">Take</Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="w-4 h-4" /> Reset</Button>
          </div>
        )}

        {turn === 'computer' && !winner && (
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
            <Brain className="w-4 h-4 text-amber-400 animate-pulse" />
            Computer is thinking...
          </div>
        )}

        {lastMove && <div className="text-xs text-slate-600 mb-4">{lastMove}</div>}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="lab-card p-3"><div className="text-xs text-slate-500">Nim Sum (XOR)</div><div className="text-lg font-mono font-bold text-cyan-400">{currentNimSum} {currentNimSum === 0 ? '(losing)' : '(winning)'}</div></div>
          <div className="lab-card p-3"><div className="text-xs text-slate-500">Objects Left</div><div className="text-lg font-mono font-bold text-primary-400">{total}</div></div>
        </div>

        {/* Math explanation */}
        <div className="lab-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">The Mathematics</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The key to Nim is the <strong className="text-cyan-300">nim sum</strong> — the XOR (exclusive OR) of all pile sizes, written in binary. XOR compares numbers bit by bit: 1 XOR 1 = 0, 1 XOR 0 = 1, 0 XOR 0 = 0.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            If the nim sum is <strong className="text-emerald-300">non-zero</strong>, the player whose turn it is can force a win. If it is <strong className="text-red-300">zero</strong>, any move will make it non-zero — so that player is in a losing position (assuming the opponent plays optimally).
          </p>
          <div className="formula-box text-center">nim_sum = pile₁ ⊕ pile₂ ⊕ ... ⊕ pileₙ</div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The computer uses this strategy: it finds a pile to reduce so the nim sum becomes zero, putting you in a losing position. This is an application of <strong className="text-cyan-300">combinatorial game theory</strong> and binary arithmetic.
          </p>
        </div>
      </div>
    </Layout>
  );
}
