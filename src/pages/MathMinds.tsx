import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Brain, Sparkles, Globe, Lightbulb } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { MATHEMATICIANS } from '@/data/mathematicians';

export default function MathMinds() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = MATHEMATICIANS.find((m) => m.id === selectedId);

  if (selected) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Mathematical Minds
          </button>

          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="branch" branch={selected.branch}>{selected.branch}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">{selected.name}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Brain className="w-4 h-4" /> {selected.era}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {selected.region}</span>
            </div>

            <div className="h-px bg-lab-border" />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-cyan-300">Major Contributions</h3>
              <ul className="space-y-1.5">
                {selected.contributions.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-slate-300 text-sm leading-relaxed">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary-300">Why They Matter</h3>
              <p className="text-slate-400 leading-relaxed">{selected.whyTheyMatter}</p>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex gap-3">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-300 mb-1">Interesting Fact</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{selected.interestingFact}</p>
              </div>
            </div>

            <Link to={selected.exploreLink} className="btn-primary inline-flex items-center gap-2">
              Explore the Mathematics: {selected.exploreLabel}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">The People Behind the Mathematics</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Mathematical Minds</h1>
          <p className="text-slate-500 max-w-2xl">
            The people who changed mathematics. Each mathematician connected the abstract to the real, building the foundation that we still use today. Click a profile to explore their story and the mathematics they discovered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MATHEMATICIANS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className="lab-card p-6 text-left hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-lab-surface border border-lab-border flex items-center justify-center">
                  <Brain className="w-5 h-5 text-cyan-400" />
                </div>
                <Badge variant="branch" branch={m.branch}>{m.branch}</Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">{m.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{m.era} · {m.region}</p>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{m.whyTheyMatter}</p>
              <span className="text-xs text-primary-400 flex items-center gap-1 pt-1">
                Read profile <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
