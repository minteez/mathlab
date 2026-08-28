import { useState, useRef, useCallback } from 'react';
import { RotateCcw, Info, Shuffle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

interface Piece {
  id: number;
  type: 'large-tri' | 'medium-tri' | 'small-tri-1' | 'small-tri-2' | 'square' | 'parallelogram';
  x: number;
  y: number;
  rotation: number;
  flipped: boolean;
}

const PIECE_SHAPES: Record<string, { points: string; color: string; label: string }> = {
  'large-tri': { points: '0,0 100,0 50,50', color: '#ef4444', label: 'Large Triangle 1' },
  'medium-tri': { points: '0,0 70,0 35,35', color: '#22d3ee', label: 'Medium Triangle' },
  'small-tri-1': { points: '0,0 50,0 25,25', color: '#f59e0b', label: 'Small Triangle 1' },
  'small-tri-2': { points: '0,0 50,0 25,25', color: '#3b82f6', label: 'Small Triangle 2' },
  'square': { points: '0,0 35,0 35,35 0,35', color: '#10b981', label: 'Square' },
  'parallelogram': { points: '0,0 50,0 70,35 20,35', color: '#a855f7', label: 'Parallelogram' },
};

const INITIAL_PIECES: Piece[] = [
  { id: 0, type: 'large-tri', x: 50, y: 50, rotation: 0, flipped: false },
  { id: 1, type: 'large-tri', x: 200, y: 50, rotation: 180, flipped: false },
  { id: 2, type: 'medium-tri', x: 50, y: 200, rotation: 90, flipped: false },
  { id: 3, type: 'small-tri-1', x: 200, y: 200, rotation: 0, flipped: false },
  { id: 4, type: 'small-tri-2', x: 280, y: 200, rotation: 270, flipped: false },
  { id: 5, type: 'square', x: 150, y: 280, rotation: 0, flipped: false },
  { id: 6, type: 'parallelogram', x: 250, y: 280, rotation: 0, flipped: false },
];

const TARGETS = [
  { name: 'Square', hint: 'Arrange all 7 pieces into a perfect square' },
  { name: 'Cat', hint: 'Form a cat silhouette using all pieces' },
  { name: 'House', hint: 'Build a house shape with a roof' },
  { name: 'Rocket', hint: 'Create a rocket pointing upward' },
];

export default function Tangram() {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [selected, setSelected] = useState<number | null>(null);
  const [target, setTarget] = useState(0);
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
    setPieces(prev => prev.map(p => p.id === dragRef.current!.id ? { ...p, x: Math.max(0, Math.min(350, x)), y: Math.max(0, Math.min(350, y)) } : p));
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) {
      setMoveCount(m => m + 1);
      dragRef.current = null;
    }
  }, []);

  const rotatePiece = (id: number) => {
    setPieces(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 45) % 360 } : p));
    setMoveCount(m => m + 1);
  };

  const flipPiece = (id: number) => {
    setPieces(prev => prev.map(p => p.id === id ? { ...p, flipped: !p.flipped } : p));
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
      rotation: Math.floor(Math.random() * 8) * 45,
    })));
    setMoveCount(0);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <div className="section-label mb-3">Mathematical Playground</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Tangram</h1>
          <p className="text-slate-500 max-w-2xl">
            Seven ancient Chinese puzzle pieces. Arrange them to form shapes, animals, and figures. Explore area, congruence, and spatial reasoning.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-5">
            <div className="lab-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300">Puzzle Board</h3>
                <span className="text-xs text-slate-600">Target: {TARGETS[target].name}</span>
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
                  <pattern id="tan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#tan-grid)" />

                {pieces.map(piece => {
                  const shape = PIECE_SHAPES[piece.type];
                  return (
                    <g
                      key={piece.id}
                      transform={`translate(${piece.x},${piece.y}) rotate(${piece.rotation}) ${piece.flipped ? 'scale(-1,1)' : ''}`}
                      onMouseDown={(e) => handleMouseDown(e, piece.id)}
                      style={{ cursor: 'grab' }}
                      opacity={selected === piece.id ? 0.9 : 1}
                    >
                    <polygon
                      points={shape.points}
                      fill={shape.color}
                      fillOpacity={selected === piece.id ? 0.7 : 0.5}
                      stroke={selected === piece.id ? '#fff' : shape.color}
                      strokeWidth={selected === piece.id ? 2 : 1}
                    />
                    </g>
                  );
                })}
              </svg>
            </div>

            {selected !== null && (
              <div className="lab-card p-4 flex items-center gap-3">
                <span className="text-sm text-slate-400">Piece: {PIECE_SHAPES[pieces.find(p => p.id === selected)?.type || ''].label}</span>
                <Button onClick={() => rotatePiece(selected)} variant="secondary" size="sm">Rotate 45°</Button>
                <Button onClick={() => flipPiece(selected)} variant="secondary" size="sm">Flip</Button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="lab-card p-5 space-y-3">
              <div className="section-label">Controls</div>
              <Button onClick={shuffle} variant="primary" size="sm" className="w-full">
                <Shuffle className="w-3 h-3" /> Shuffle Pieces
              </Button>
              <Button onClick={reset} variant="secondary" size="sm" className="w-full">
                <RotateCcw className="w-3 h-3" /> Reset
              </Button>
            </div>

            <div className="lab-card p-5 space-y-3">
              <div className="section-label">Target Shape</div>
              <div className="space-y-2">
                {TARGETS.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setTarget(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                      target === i ? 'bg-primary-600/20 border-primary-500/40 text-primary-300' : 'bg-lab-surface border-lab-border text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-medium">{t.name}</span>
                    <p className="text-xs text-slate-600 mt-0.5">{t.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lab-card p-5 space-y-3">
              <div className="section-label">Statistics</div>
              <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">Moves</span>
                <span className="font-mono text-lg text-cyan-400">{moveCount}</span>
              </div>
            </div>

            <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-300">The Mathematics</span>
              </div>
              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <p>The 7 tangram pieces have a total area of 16 square units. They can form a 4×4 square.</p>
                <p>Tangram teaches <span className="text-cyan-300">congruence</span> (pieces match exactly), <span className="text-amber-300">transformations</span> (rotation, reflection), and <span className="text-primary-300">area conservation</span> (total area never changes).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
