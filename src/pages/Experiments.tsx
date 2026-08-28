import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FlaskConical, Filter, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { EXPERIMENTS } from '@/data/experiments';
import type { Difficulty, MathBranch } from '@/types';

const BRANCHES: (MathBranch | 'All')[] = [
  'All', 'Number Theory', 'Algebra', 'Geometry', 'Statistics', 'Probability', 'Functions', 'Sequences', 'Patterns',
];
const DIFFICULTIES: (Difficulty | 'All')[] = ['All', 'Foundation', 'Intermediate', 'Advanced', 'Exhibition Challenge'];

const ICON_COLORS: Record<string, string> = {
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  primary: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function Experiments() {
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState<MathBranch | 'All'>('All');
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');

  const filtered = EXPERIMENTS.filter((e) => {
    const q = query.toLowerCase();
    const matchQ = !q || e.shortTitle.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q));
    const matchB = branch === 'All' || e.branch === branch;
    const matchD = difficulty === 'All' || e.difficulty === difficulty;
    return matchQ && matchB && matchD;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="section-label mb-3">The Laboratory</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Experiments</h1>
          <p className="text-slate-500 max-w-2xl">
            Choose an experiment to start exploring mathematics interactively. Each experiment lets you manipulate variables, observe patterns, and discover mathematical relationships.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              placeholder="Search experiments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="lab-input pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value as MathBranch | 'All')}
              className="lab-input text-sm min-w-[120px]"
            >
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | 'All')}
              className="lab-input text-sm min-w-[150px]"
            >
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-slate-600 mb-5">
          Showing {filtered.length} of {EXPERIMENTS.length} experiments
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No experiments match your filter.</p>
            <button onClick={() => { setQuery(''); setBranch('All'); setDifficulty('All'); }} className="mt-3 text-sm text-primary-400 hover:text-primary-300">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((exp) => {
              const ic = ICON_COLORS[exp.color] ?? ICON_COLORS.primary;
              return (
                <Link
                  key={exp.id}
                  to={`/experiments/${exp.id}`}
                  className="lab-card p-6 hover:border-primary-500/40 hover:bg-lab-hover transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${ic}`}>
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {exp.exhibitionPick && <Badge variant="exhibition">Exhibition</Badge>}
                      {exp.featured && <Badge variant="featured">Featured</Badge>}
                      <Badge variant="difficulty" difficulty={exp.difficulty}>{exp.difficulty}</Badge>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors leading-snug mb-2 text-lg">
                    {exp.shortTitle}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{exp.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {exp.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs bg-lab-surface border border-lab-border text-slate-500">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-lab-border">
                    <Badge variant="branch" branch={exp.branch}>{exp.branch}</Badge>
                    <span className="text-sm text-primary-400 group-hover:text-primary-300 flex items-center gap-1 font-medium transition-colors">
                      Start Experiment <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
