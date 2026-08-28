import { useState, useRef, useCallback } from 'react';
import { RotateCcw, Info, Shuffle, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

interface Piece {
  id: number;
  shape: string;
  x: number;
  y: number;
  rotation: number;
  placed: boolean;
}

const PENTOMINO_SHAPES: Record<string, { cells: [number, number][]; color: string }> = {
  F: { cells: [[1,0],[0,1],[1,1],[1,2],[2,2]], color: '#ef4444' },
  I: { cells: [[0,0],[1,0],[2,0],[3,0],[4,0]], color: '#22d3ee' },
  L: { cells: [[0,0],[0,1],[0,2],[0,3],[1,3]], color: '#f59e0b' },
  N: { cells: [[0,0],[0,1],[1,1],[1,2],[1,3]], color: '#3b82f6' },
  P: { cells: [[0,0],[1,0],[0,1],[1,1],[0,2]], color: '#10b981' },
  T: { cells: [[0,0],[1,0],[2,0],[1,1],[1,2]], color: '#a855f7' },
  U: { cells: [[0,0],[0,1],[1,1],[2,1],[2,0]], color: '#ec4899' },
  V: { cells: [[0,0],[0,1],[0,2],[1,2],[2,2]], color: '#14b8a6' },
  W: { cells: [[0,0],[0,1],[1,1],[1,2],[2,2]], color: '#f97316' },
  X: { cells: [[1,0],[0,1],[1,1],[2,1],[1,2]], color: '#eab308' },
  Y: { cells: [[1,0],[0,1],[1,1],[1,2],[1,3]], color: '#8b5cf6' },
  Z: { cells: [[0,0],[1,0],[1,1],[1,2],[2,2]], color: '#06b6d4' },
};

const SHAPE_NAMES = Object.keys(PENTOMINO_SHAPES);

const INITIAL_PIECES: Piece[] = SHAPE_NAMES.map((name, i) => ({
  id: i,
  shape: name,
  x: 20 + (i % 4) * 80,
  y: 320 + Math.floor(i / 4) * 60,
  rotation: 0,
  placed: false,
}));

const BOARD_SIZE = 6;
const CELL_SIZE = 40;

function rotateCells(cells: [number, number][], rotation: number): [number, number][] {
  let result = cells.map(([x, y]) => [x, y] as [number, number]);
  const turns = ((rotation / 90) % 4 + 4) % 4;
  for (let t = 0; t < turns; t++) {
    result = result.map(([x, y]) => [-y, x] as [number, number]);
  }
  const minX = Math.min(...result.map(c => c[0]));
  const minY = Math.min(...result.map(c => c[1]));
  return result.map(([x, y]) => [x - minX, y - minY] as [number, number]);
}

export default function Pentominoes() {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [selected, setSelected] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const piece = pieces.find(p => p.id === id);
    if (!piece || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    dragRef.current = {
      id,
      offsetX: ((e.clientX - rect.left) * scaleX) - piece.x,
      offsetY: ((e.clientY - rect.top) * scaleY) - piece.y,
    };
    setSelected(id);
  }, [pieces]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    const x = ((e.clientX - rect.left) * scaleX) - dragRef.current.offsetX;
    const y = ((e.clientY - rect.top) * scaleY) - dragRef.current.offsetY;
    setPieces(prev => prev.map(p => p.id === dragRef.current!.id ? { ...p, x: Math.max(0, Math.min(380, x)), y: Math.max(0, Math.min(380, y)) } : p));
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) {
      setMoveCount(m => m + 1);
      dragRef.current = null;
    }
  }, []);

  const rotatePiece = (id: number) => {
    setPieces(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
    setMoveCount(m => m + 1);
  };

  const reset = () => {
    setPieces(INITIAL_PIECES);
    setMoveCount(0);
    setSelected(null);
  };

  const shuffle = () => {
    setPieces(prev => prev.map(p => ({
      ...p,
      x: Math.random() * 300 + 20,
      y: Math.random() * 300 + 20,
      rotation: Math.floor(Math.random() * 4) * 90,
    })));
    setMoveCount(0);
  };

  const placedCount = pieces.filter(p => p.placed).length;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Mathematical Playground</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Pentominoes</h1>
          <p className="text-slate-500 max-w-2xl">
            Twelve unique shapes, each made of 5 squares. Fit them into a rectangle to explore area, symmetry, and combinatorics. There are 2,339 solutions for a 6×10 rectangle.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-5">
            <div className="lab-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300">Board (6×6 area)</h3>
                <span className="text-xs text-slate-600">Drag pieces onto the grid</span>
              </div>
              <svg
                ref={svgRef}
                viewBox="0 0 400 400"
                className="w-full h-[400px] bg-lab-surface rounded-xl touch-none"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <defs>
                  <pattern id="pent-grid" width={CELL_SIZE} height={CELL_SIZE} patternUnits="userSpaceOnUse">
                    <path d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`} fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#pent-grid)" />

                {pieces.map(piece => {
                  const shape = PENTOMINO_SHAPES[piece.shape];
                  const cells = rotateCells(shape.cells, piece.rotation);
                  return (
                    <g
                      key={piece.id}
                      transform={`translate(${piece.x},${piece.y})`}
                      onMouseDown={(e) => handleMouseDown(e, piece.id)}
                      style={{ cursor: 'grab' }}
                    >
                      {cells.map(([cx, cy], i) => (
                        <rect
                          key={i}
                          x={cx * (CELL_SIZE / 2)}
                          y={cy * (CELL_SIZE / 2)}
                          width={CELL_SIZE / 2 - 1}
                          height={CELL_SIZE / 2 - 1}
                          fill={shape.color}
                          fillOpacity={selected === piece.id ? 0.7 : 0.5}
                          stroke={selected === piece.id ? '#fff' : shape.color}
                          strokeWidth={selected === piece.id ? 1.5 : 0.5}
                          rx="2"
                        />
                      ))}
                      <text x={cells[0][0] * (CELL_SIZE / 2) + 4} y={cells[0][1] * (CELL_SIZE / 2) + 12} fill="#fff" fontSize="10" fontWeight="bold" opacity={0.8}>
                        {piece.shape}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {selected !== null && (
              <div className="lab-card p-4 flex items-center gap-3">
                <span className="text-sm text-slate-400">Piece: {pieces.find(p => p.id === selected)?.shape}</span>
                <Button onClick={() => rotatePiece(selected)} variant="secondary" size="sm">Rotate 90°</Button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="lab-card p-5 space-y-3">
              <div className="section-label">Controls</div>
              <Button onClick={shuffle} variant="primary" size="sm" className="w-full">
                <Shuffle className="w-3 h-3" /> Shuffle
              </Button>
              <Button onClick={reset} variant="secondary" size="sm" className="w-full">
                <RotateCcw className="w-3 h-3" /> Reset
              </Button>
            </div>

            <div className="lab-card p-5 space-y-3">
              <div className="section-label">Statistics</div>
              <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">Moves</span>
                <span className="font-mono text-lg text-cyan-400">{moveCount}</span>
              </div>
              <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">Pieces</span>
                <span className="font-mono text-sm text-slate-300">{pieces.length} total</span>
              </div>
            </div>

            <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-300">The Mathematics</span>
              </div>
              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <p>There are exactly <span className="text-cyan-300 font-mono">12</span> free pentominoes — shapes made of 5 equal squares connected edge-to-edge.</p>
                <p>They can tile a 6×10 rectangle in <span className="text-amber-300 font-mono">2,339</span> distinct ways (excluding rotations and reflections).</p>
                <p>The total area of all 12 pieces is 60 squares, matching 6×10, 5×12, 4×15, and 3×20 rectangles.</p>
              </div>
            </div>

            <div className="lab-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">All 12 Pentominoes</h3>
              <div className="grid grid-cols-4 gap-2">
                {SHAPE_NAMES.map(name => {
                  const shape = PENTOMINO_SHAPES[name];
                  return (
                    <div key={name} className="bg-lab-surface rounded-lg p-2 flex flex-col items-center gap-1">
                      <svg viewBox="0 0 50 50" className="w-8 h-8">
                        {shape.cells.map(([cx, cy], i) => (
                          <rect key={i} x={cx * 10} y={cy * 10} width="9" height="9" fill={shape.color} fillOpacity={0.6} rx="1" />
                        ))}
                      </svg>
                      <span className="text-xs font-mono text-slate-500">{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
