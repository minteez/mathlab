import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Telescope } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { EXPERIMENTS } from '@/data/experiments';
import { DISCOVER_ARTICLES } from '@/data/discover';
import { CHALLENGES } from '@/data/challenges';
import type { MathBranch } from '@/types';

const BRANCHES: (MathBranch | 'All')[] = [
  'All', 'Number Theory', 'Algebra', 'Geometry', 'Statistics', 'Probability', 'Functions', 'Sequences', 'Logic', 'Patterns',
];

export default function Explore() {
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState<MathBranch | 'All'>('All');

  const q = query.toLowerCase();
  const matchBranch = (b: MathBranch) => branch === 'All' || b === branch;

  const experiments = EXPERIMENTS.filter((e) => matchBranch(e.branch) && (!q || e.shortTitle.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q))));
  const articles = DISCOVER_ARTICLES.filter((a) => matchBranch(a.branch) && (!q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q))));
  const challenges = CHALLENGES.filter((c) => matchBranch(c.branch) && (!q || c.title.toLowerCase().includes(q) || c.problem.toLowerCase().includes(q)));

  const total = experiments.length + articles.length + challenges.length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Explore Mathematics</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Explore</h1>
          <p className="text-slate-500 max-w-2xl">
            Browse every experiment, discovery article, and challenge in the MathLab by topic or keyword. Find something that sparks your curiosity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              placeholder="Search everything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="lab-input pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {BRANCHES.map((b) => (
              <button
                key={b}
                onClick={() => setBranch(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${branch === b ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-600 mb-6">{total} results</div>

        {total === 0 && (
          <div className="text-center py-20 text-slate-500">
            <Telescope className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nothing matches your search.</p>
          </div>
        )}

        {experiments.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Experiments ({experiments.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiments.map((exp) => (
                <Link key={exp.id} to={`/experiments/${exp.id}`} className="lab-card p-5 hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-2">
                  <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{exp.shortTitle}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="branch" branch={exp.branch}>{exp.branch}</Badge>
                    <span className="text-xs text-primary-400 flex items-center gap-1">Start <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Discoveries ({articles.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <Link key={article.id} to="/discover" className="lab-card p-5 hover:border-cyan-500/40 hover:bg-lab-hover transition-all group space-y-2">
                  <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{article.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{article.subtitle}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs bg-lab-surface border border-lab-border text-slate-500">{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {challenges.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Challenges ({challenges.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map((ch) => (
                <Link key={ch.id} to="/challenges" className="lab-card p-5 hover:border-amber-500/40 hover:bg-lab-hover transition-all group space-y-2">
                  <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{ch.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{ch.problem}</p>
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="branch" branch={ch.branch}>{ch.branch}</Badge>
                    <Badge variant="difficulty" difficulty={ch.difficulty}>{ch.difficulty}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
