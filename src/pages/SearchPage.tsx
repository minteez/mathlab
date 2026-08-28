import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ArrowRight, FlaskConical, Hash, Sigma, SquareFunction, BarChart3, Dices, Shapes, Snowflake, Target, Star, Brain, Calculator, Globe, Gamepad2, BookOpen, Lightbulb } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { EXPERIMENTS } from '@/data/experiments';
import { MATHEMATICIANS } from '@/data/mathematicians';
import { FORMULAS } from '@/data/formulas';
import { FUN_FACTS } from '@/data/funFacts';
import { REAL_WORLD_TOPICS } from '@/data/realWorld';
import { LEARN_TOPICS } from '@/data/learnTopics';
import { CHALLENGES } from '@/data/challenges';

interface SearchResult {
  type: string;
  title: string;
  description: string;
  link: string;
  icon: React.ElementType;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    EXPERIMENTS.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.shortTitle.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q)) || e.branch.toLowerCase().includes(q)) {
        results.push({ type: 'Experiment', title: e.shortTitle, description: e.description, link: `/experiments/${e.id}`, icon: FlaskConical });
      }
    });

    MATHEMATICIANS.forEach((m) => {
      if (m.name.toLowerCase().includes(q) || m.branch.toLowerCase().includes(q) || m.contributions.some((c) => c.toLowerCase().includes(q))) {
        results.push({ type: 'Mathematician', title: m.name, description: `${m.era} · ${m.region}`, link: '/math-minds', icon: Brain });
      }
    });

    FORMULAS.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q)) {
        results.push({ type: 'Formula', title: f.name, description: f.formula, link: '/formula-lab', icon: Calculator });
      }
    });

    FUN_FACTS.forEach((ff) => {
      if (ff.fact.toLowerCase().includes(q) || ff.category.toLowerCase().includes(q)) {
        results.push({ type: 'Fun Fact', title: ff.category, description: ff.fact.slice(0, 100) + '...', link: ff.exploreLink, icon: Lightbulb });
      }
    });

    REAL_WORLD_TOPICS.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.concept.toLowerCase().includes(q) || t.mathConcept.toLowerCase().includes(q)) {
        results.push({ type: 'Real World', title: t.title, description: t.concept, link: '/math-world', icon: Globe });
      }
    });

    LEARN_TOPICS.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.area.toLowerCase().includes(q) || t.concept.toLowerCase().includes(q)) {
        results.push({ type: `Class ${t.classLevel} Topic`, title: t.title, description: t.concept.slice(0, 100) + '...', link: '/learn', icon: BookOpen });
      }
    });

    CHALLENGES.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.branch.toLowerCase().includes(q) || c.problem.toLowerCase().includes(q)) {
        results.push({ type: 'Challenge', title: c.title, description: c.problem.slice(0, 100) + '...', link: '/challenges', icon: Target });
      }
    });

    return results;
  }, [query]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Search the Mathematical Universe</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Search</h1>
          <p className="text-slate-500 max-w-2xl">
            Search across all of MathLab — topics, formulas, experiments, mathematicians, puzzles, challenges, and real-world applications.
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for 'Pythagoras', 'probability', 'circles'..."
            className="lab-input w-full pl-12 py-3 text-base"
            autoFocus
          />
        </div>

        {query.trim() && (
          <div className="mb-4 text-sm text-slate-500">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </div>
        )}

        <div className="space-y-3">
          {results.map((r, i) => (
            <Link
              key={i}
              to={r.link}
              className="lab-card p-4 flex items-center gap-4 hover:border-primary-500/40 hover:bg-lab-hover transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-lab-surface border border-lab-border flex items-center justify-center flex-shrink-0">
                <r.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="tag">{r.type}</Badge>
                </div>
                <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors truncate">{r.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{r.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary-400 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        {query.trim() && results.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No results found for "{query}". Try a different search term.</p>
          </div>
        )}

        {!query.trim() && (
          <div className="text-center py-16 text-slate-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Start typing to search across all of MathLab.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Pythagoras', 'probability', 'circles', 'Fibonacci', 'algebra', 'statistics'].map((s) => (
                <button key={s} onClick={() => setQuery(s)} className="px-3 py-1.5 rounded-lg bg-lab-surface border border-lab-border text-xs text-slate-400 hover:text-slate-200 hover:border-primary-500/30 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
