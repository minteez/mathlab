import { useState, useCallback } from 'react';
import { RotateCcw, Shuffle, Info } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

type Face = number[]; // 9 stickers per face
type CubeState = { U: Face; D: Face; F: Face; B: Face; L: Face; R: Face };

const COLORS = ['#f8fafc', '#fbbf24', '#22d3ee', '#f97316', '#3b82f6', '#10b981'];
const LABELS = ['U', 'D', 'F', 'B', 'L', 'R'];

function solvedCube(): CubeState {
  return {
    U: [0,0,0,0,0,0,0,0,0],
    D: [1,1,1,1,1,1,1,1,1],
    F: [2,2,2,2,2,2,2,2,2],
    B: [3,3,3,3,3,3,3,3,3],
    L: [4,4,4,4,4,4,4,4,4],
    R: [5,5,5,5,5,5,5,5,5],
  };
}

function rotateFaceCW(face: Face): Face {
  return [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
}

function rotateFaceCCW(face: Face): Face {
  return [face[2], face[5], face[8], face[1], face[4], face[7], face[0], face[3], face[6]];
}

function rotate(cube: CubeState, face: keyof CubeState, dir: 'CW' | 'CCW'): CubeState {
  const c = { ...cube, U: [...cube.U], D: [...cube.D], F: [...cube.F], B: [...cube.B], L: [...cube.L], R: [...cube.R] };
  const rot = dir === 'CW' ? rotateFaceCW : rotateFaceCCW;
  c[face] = rot(c[face]);

  const cw = dir === 'CW';
  if (face === 'U') {
    const t = [...c.F.slice(0, 3)];
    if (cw) { c.F.splice(0, 3, ...c.R.slice(0, 3)); c.R.splice(0, 3, ...c.B.slice(0, 3)); c.B.splice(0, 3, ...c.L.slice(0, 3)); c.L.splice(0, 3, ...t); }
    else { c.F.splice(0, 3, ...c.L.slice(0, 3)); c.L.splice(0, 3, ...c.B.slice(0, 3)); c.B.splice(0, 3, ...c.R.slice(0, 3)); c.R.splice(0, 3, ...t); }
  } else if (face === 'D') {
    const t = [...c.F.slice(6, 9)];
    if (cw) { c.F.splice(6, 3, ...c.L.slice(6, 9)); c.L.splice(6, 3, ...c.B.slice(6, 9)); c.B.splice(6, 3, ...c.R.slice(6, 9)); c.R.splice(6, 3, ...t); }
    else { c.F.splice(6, 3, ...c.R.slice(6, 9)); c.R.splice(6, 3, ...c.B.slice(6, 9)); c.B.splice(6, 3, ...c.L.slice(6, 9)); c.L.splice(6, 3, ...t); }
  } else if (face === 'F') {
    const t = [c.U[6], c.U[7], c.U[8]];
    if (cw) { c.U.splice(6, 3, c.L[8], c.L[5], c.L[2]); c.L.splice(2, 1, c.D[2]); c.L.splice(5, 1, c.D[1]); c.L.splice(8, 1, c.D[0]); c.D.splice(0, 3, c.R[6], c.R[3], c.R[0]); c.R.splice(0, 1, t[2]); c.R.splice(3, 1, t[1]); c.R.splice(6, 1, t[0]); }
    else { c.U.splice(6, 3, c.R[0], c.R[3], c.R[6]); c.R.splice(0, 1, c.D[2]); c.R.splice(3, 1, c.D[1]); c.R.splice(6, 1, c.D[0]); c.D.splice(0, 3, c.L[8], c.L[5], c.L[2]); c.L.splice(2, 1, t[0]); c.L.splice(5, 1, t[1]); c.L.splice(8, 1, t[2]); }
  } else if (face === 'R') {
    const t = [c.U[2], c.U[5], c.U[8]];
    if (cw) { c.U.splice(2, 1, c.F[2]); c.U.splice(5, 1, c.F[5]); c.U.splice(8, 1, c.F[8]); c.F.splice(2, 1, c.D[2]); c.F.splice(5, 1, c.D[5]); c.F.splice(8, 1, c.D[8]); c.D.splice(2, 1, c.B[6]); c.D.splice(5, 1, c.B[3]); c.D.splice(8, 1, c.B[0]); c.B.splice(0, 1, t[0]); c.B.splice(3, 1, t[1]); c.B.splice(6, 1, t[2]); }
    else { c.U.splice(2, 1, c.B[6]); c.U.splice(5, 1, c.B[3]); c.U.splice(8, 1, c.B[0]); c.B.splice(0, 1, c.D[8]); c.B.splice(3, 1, c.D[5]); c.B.splice(6, 1, c.D[2]); c.D.splice(2, 1, c.F[2]); c.D.splice(5, 1, c.F[5]); c.D.splice(8, 1, c.F[8]); c.F.splice(2, 1, t[0]); c.F.splice(5, 1, t[1]); c.F.splice(8, 1, t[2]); }
  } else if (face === 'L') {
    const t = [c.U[0], c.U[3], c.U[6]];
    if (cw) { c.U.splice(0, 1, c.B[8]); c.U.splice(3, 1, c.B[5]); c.U.splice(6, 1, c.B[2]); c.B.splice(2, 1, c.D[6]); c.B.splice(5, 1, c.D[3]); c.B.splice(8, 1, c.D[0]); c.D.splice(0, 1, c.F[0]); c.D.splice(3, 1, c.F[3]); c.D.splice(6, 1, c.F[6]); c.F.splice(0, 1, t[0]); c.F.splice(3, 1, t[1]); c.F.splice(6, 1, t[2]); }
    else { c.U.splice(0, 1, c.F[0]); c.U.splice(3, 1, c.F[3]); c.U.splice(6, 1, c.F[6]); c.F.splice(0, 1, c.D[0]); c.F.splice(3, 1, c.D[3]); c.F.splice(6, 1, c.D[6]); c.D.splice(0, 1, c.B[8]); c.D.splice(3, 1, c.B[5]); c.D.splice(6, 1, c.B[2]); c.B.splice(2, 1, t[2]); c.B.splice(5, 1, t[1]); c.B.splice(8, 1, t[0]); }
  } else if (face === 'B') {
    const t = [c.U[0], c.U[1], c.U[2]];
    if (cw) { c.U.splice(0, 3, c.R[2], c.R[5], c.R[8]); c.R.splice(2, 1, c.D[6]); c.R.splice(5, 1, c.D[7]); c.R.splice(8, 1, c.D[8]); c.D.splice(6, 3, c.L[0], c.L[3], c.L[6]); c.L.splice(0, 1, t[2]); c.L.splice(3, 1, t[1]); c.L.splice(6, 1, t[0]); }
    else { c.U.splice(0, 3, c.L[6], c.L[3], c.L[0]); c.L.splice(0, 1, c.D[8]); c.L.splice(3, 1, c.D[7]); c.L.splice(6, 1, c.D[6]); c.D.splice(6, 3, c.R[8], c.R[5], c.R[2]); c.R.splice(2, 1, t[0]); c.R.splice(5, 1, t[1]); c.R.splice(8, 1, t[2]); }
  }
  return c;
}

function isSolved(cube: CubeState): boolean {
  return (['U', 'D', 'F', 'B', 'L', 'R'] as const).every(f => cube[f].every(s => s === cube[f][0]));
}

function FaceView({ face, label }: { face: Face; label: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-600 text-center font-mono">{label}</div>
      <div className="grid grid-cols-3 gap-0.5 w-[90px]">
        {face.map((color, i) => (
          <div key={i} className="w-[28px] h-[28px] rounded-sm border border-slate-900/40" style={{ backgroundColor: COLORS[color] }} />
        ))}
      </div>
    </div>
  );
}

export default function RubiksCube() {
  const [cube, setCube] = useState<CubeState>(solvedCube());
  const [moveCount, setMoveCount] = useState(0);
  const [scrambled, setScrambled] = useState(false);

  const doMove = useCallback((face: keyof CubeState, dir: 'CW' | 'CCW') => {
    setCube(c => rotate(c, face, dir));
    setMoveCount(m => m + 1);
  }, []);

  const scramble = useCallback(() => {
    let c = solvedCube();
    const faces: (keyof CubeState)[] = ['U', 'D', 'F', 'B', 'L', 'R'];
    for (let i = 0; i < 20; i++) {
      const f = faces[Math.floor(Math.random() * 6)];
      const d = Math.random() < 0.5 ? 'CW' : 'CCW';
      c = rotate(c, f, d);
    }
    setCube(c);
    setMoveCount(0);
    setScrambled(true);
  }, []);

  const reset = () => {
    setCube(solvedCube());
    setMoveCount(0);
    setScrambled(false);
  };

  const solved = isSolved(cube);
  const totalStates = 43_252_003_274_489_856_000;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Mathematical Playground</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Rubik's Cube</h1>
          <p className="text-slate-500 max-w-2xl">
            Explore the mathematics of the world's most famous puzzle. Rotate faces, scramble, and discover the combinatorics behind 43 quintillion states.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div className="lab-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300">Cube State</h3>
                {solved ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">SOLVED</span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Scrambled</span>
                )}
              </div>

              <div className="flex flex-col items-center gap-3">
                <FaceView face={cube.U} label="U (Up)" />
                <div className="flex gap-3">
                  <FaceView face={cube.L} label="L" />
                  <FaceView face={cube.F} label="F" />
                  <FaceView face={cube.R} label="R" />
                  <FaceView face={cube.B} label="B" />
                </div>
                <FaceView face={cube.D} label="D (Down)" />
              </div>
            </div>

            <div className="lab-card p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Controls</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['U', 'D', 'F', 'B', 'L', 'R'] as const).map(f => (
                  <div key={f} className="space-y-1">
                    <button onClick={() => doMove(f, 'CW')} className="w-full py-2 rounded-lg bg-lab-surface border border-lab-border text-sm font-mono text-slate-300 hover:border-cyan-500/40 hover:bg-lab-hover transition-all">
                      {f}
                    </button>
                    <button onClick={() => doMove(f, 'CCW')} className="w-full py-1.5 rounded-lg bg-lab-surface border border-lab-border text-xs font-mono text-slate-500 hover:border-amber-500/40 hover:bg-lab-hover transition-all">
                      {f}'
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={scramble} variant="primary" size="sm" className="flex-1">
                  <Shuffle className="w-3 h-3" /> Scramble
                </Button>
                <Button onClick={reset} variant="secondary" size="sm">
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="lab-card p-5 space-y-3">
              <div className="section-label">Statistics</div>
              <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">Moves</span>
                <span className="font-mono text-lg text-cyan-400">{moveCount}</span>
              </div>
              <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">Status</span>
                <span className={`font-mono text-sm ${solved ? 'text-emerald-400' : 'text-amber-400'}`}>{solved ? 'Solved' : 'Unsolved'}</span>
              </div>
            </div>

            <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-300">The Mathematics</span>
              </div>
              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <p>The Rubik's Cube has <span className="text-cyan-300 font-mono">43,252,003,274,489,856,000</span> possible states — that's 43 quintillion.</p>
                <p>Despite this enormous number, any cube can be solved in at most <span className="text-amber-300 font-mono">20 moves</span> (God's Number).</p>
                <p>The cube demonstrates group theory: each rotation is a permutation, and sequences of moves form algebraic structures.</p>
              </div>
            </div>

            <div className="lab-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">Key Concepts</h3>
              <div className="space-y-2">
                {[
                  { term: 'Permutations', desc: 'Each face rotation rearranges 20 pieces' },
                  { term: 'Group Theory', desc: 'Moves form a mathematical group' },
                  { term: 'Symmetry', desc: 'The cube has 24 rotational symmetries' },
                  { term: "God's Number", desc: '20 moves suffice for any state' },
                ].map(({ term, desc }) => (
                  <div key={term} className="bg-lab-surface rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-300">{term}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
