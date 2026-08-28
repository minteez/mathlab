import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Building2, Rocket, Trophy, Cpu, Lock, Cog, Music, Leaf, Navigation, Gamepad2, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { REAL_WORLD_TOPICS } from '@/data/realWorld';

const ICON_MAP: Record<string, React.ElementType> = {
  Building2, Rocket, Trophy, Cpu, Lock, Cog, Music, Leaf, Navigation, Gamepad2,
};

export default function MathWorld() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = REAL_WORLD_TOPICS.find((t) => t.id === selectedId);

  if (selected) {
    const Icon = ICON_MAP[selected.icon] ?? Building2;
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Math in the World
          </button>

          <div className="space-y-6">
            <div className={`w-14 h-14 rounded-xl border flex items-center justify-center ${selected.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : selected.color === 'primary' ? 'bg-primary-500/10 border-primary-500/20 text-primary-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
              <Icon className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-slate-100">{selected.title}</h1>
            <p className="text-slate-500 text-sm">{selected.concept}</p>

            <div className="h-px bg-lab-border" />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-cyan-300">Real-World Scenario</h3>
              <p className="text-slate-400 leading-relaxed">{selected.scenario}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary-300">Mathematical Concept</h3>
              <p className="text-slate-400 leading-relaxed">{selected.mathConcept}</p>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <h3 className="text-sm font-semibold text-amber-300 mb-1">Related School Topic</h3>
              <p className="text-sm text-slate-400">{selected.relatedClass}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link to="/learn" className="btn-secondary inline-flex items-center gap-2 text-sm">
                Learn this in class
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/experiments" className="btn-ghost inline-flex items-center gap-2 text-sm">
                Try an experiment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Mathematics Is Everywhere</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Math in the World</h1>
          <p className="text-slate-500 max-w-2xl">
            From architecture to cryptography, from music to space travel — mathematics is the hidden language of the universe. Explore how mathematical concepts shape the world around us.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REAL_WORLD_TOPICS.map((topic) => {
            const Icon = ICON_MAP[topic.icon] ?? Building2;
            const colorClass = topic.color === 'cyan' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : topic.color === 'primary' ? 'text-primary-400 bg-primary-500/10 border-primary-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedId(topic.id)}
                className="lab-card p-6 text-left hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">{topic.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{topic.concept}</p>
                <div className="text-xs text-slate-600">{topic.relatedClass}</div>
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
