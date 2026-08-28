import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Shuffle, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { FUN_FACTS, FUN_FACT_CATEGORIES } from '@/data/funFacts';

export default function FunFacts() {
  const [category, setCategory] = useState('All');
  const [randomIdx, setRandomIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (category === 'All') return FUN_FACTS;
    return FUN_FACTS.filter((f) => f.category === category);
  }, [category]);

  const randomFact = randomIdx !== null ? FUN_FACTS[randomIdx] : null;

  const pickRandom = () => {
    setRandomIdx(Math.floor(Math.random() * FUN_FACTS.length));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Did You Know?</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Mathematical Fun Facts</h1>
          <p className="text-slate-500 max-w-2xl">
            Mathematics is full of surprises. Explore facts about numbers, geometry, infinity, patterns, and more — each with an explanation and a link to explore further.
          </p>
        </div>

        {/* Random fact */}
        <div className="mb-8">
          <button onClick={pickRandom} className="btn-primary inline-flex items-center gap-2 text-sm">
            <Shuffle className="w-4 h-4" />
            Random Fact
          </button>
          {randomFact && (
            <div className="mt-4 lab-card p-6 space-y-3 border-primary-500/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <Badge variant="tag">{randomFact.category}</Badge>
              </div>
              <p className="text-slate-300 leading-relaxed">{randomFact.fact}</p>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Why?</p>
                <p className="text-sm text-slate-400 leading-relaxed">{randomFact.why}</p>
              </div>
              <Link to={randomFact.exploreLink} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                Explore: {randomFact.exploreLabel} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {FUN_FACT_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === c ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Facts list */}
        <div className="space-y-4">
          {filtered.map((fact, i) => (
            <div key={fact.id} className="lab-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <Badge variant="tag">{fact.category}</Badge>
              </div>
              <p className="text-slate-300 leading-relaxed">{fact.fact}</p>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Why?</p>
                <p className="text-sm text-slate-400 leading-relaxed">{fact.why}</p>
              </div>
              <Link to={fact.exploreLink} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                Explore: {fact.exploreLabel} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p>No facts in this category yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
