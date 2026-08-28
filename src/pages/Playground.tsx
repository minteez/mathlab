import { Link } from 'react-router-dom';
import { ChevronRight, Layers, Hash, Grid3x3, Sparkles, Gamepad2, Box, Shapes, Puzzle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';

const GAMES = [
  { id: 'tower-of-hanoi', title: 'Tower of Hanoi', icon: Layers, desc: 'Move all disks to the right peg. The minimum is 2ⁿ−1 moves — discover exponential growth and recursion.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', tags: ['Recursion', 'Exponential Growth'] },
  { id: 'magic-squares', title: 'Magic Squares', icon: Grid3x3, desc: 'Fill a grid so every row, column, and diagonal sums to the same number. Explore the patterns behind the magic.', color: 'text-primary-400 bg-primary-500/10 border-primary-500/20', tags: ['Patterns', 'Combinatorics'] },
  { id: 'nim', title: 'Nim', icon: Hash, desc: 'Take objects from piles. The player who takes the last one wins — or loses. Master the mathematical winning strategy.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', tags: ['Game Theory', 'Binary'] },
  { id: '15-puzzle', title: '15 Puzzle', icon: Gamepad2, desc: 'Slide tiles to arrange numbers 1–15 in order. Learn about permutations, parity, and solvability.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', tags: ['Permutations', 'Parity'] },
  { id: 'rubiks-cube', title: "Rubik's Cube", icon: Box, desc: 'Explore 43 quintillion possible states. Rotate faces, scramble, and discover the group theory behind the cube.', color: 'text-red-400 bg-red-500/10 border-red-500/20', tags: ['Group Theory', 'Permutations'] },
  { id: 'tangram', title: 'Tangram', icon: Shapes, desc: 'Seven ancient puzzle pieces. Arrange them to form shapes, animals, and figures. Explore area and spatial reasoning.', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', tags: ['Geometry', 'Transformations'] },
  { id: 'pentominoes', title: 'Pentominoes', icon: Puzzle, desc: 'Twelve unique shapes made of 5 squares each. Fit them into rectangles and discover combinatorial tiling.', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20', tags: ['Combinatorics', 'Tiling'] },
];

export default function Playground() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Mathematics You Can Play With</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Math Playground</h1>
          <p className="text-slate-500 max-w-2xl">
            Every activity here demonstrates mathematical thinking. Puzzles, games, and simulations that reveal patterns, strategy, and the mathematics hiding inside play.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GAMES.map(({ id, title, icon: Icon, desc, color, tags }) => (
            <Link
              key={id}
              to={`/playground/${id}`}
              className="lab-card p-6 hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-xs bg-lab-surface border border-lab-border text-slate-500">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-primary-900/20 to-lab-card border border-lab-border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-200">Why Play With Mathematics?</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Mathematical play builds intuition. When you solve a puzzle, you are doing real mathematics — exploring patterns, testing strategies, and discovering structure. The best mathematicians play with ideas the same way you play with these puzzles.
          </p>
        </div>
      </div>
    </Layout>
  );
}
