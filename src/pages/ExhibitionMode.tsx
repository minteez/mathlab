import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Eye, ArrowRight, RotateCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { EXPERIMENTS } from '@/data/experiments';

const STEPS = [
  { step: '01', label: 'Predict', desc: 'Ask the visitor: "What do you think will happen?" Let them make a prediction before touching anything.', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
  { step: '02', label: 'Experiment', desc: 'Run the simulation together. Change variables and let the visitor observe what happens.', color: 'text-primary-400', border: 'border-primary-500/30', bg: 'bg-primary-500/10' },
  { step: '03', label: 'Observe', desc: 'Discuss the results. Did the outcome match the prediction? What changed when variables changed?', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  { step: '04', label: 'Compare', desc: 'Compare experimental results with mathematical theory. Show the formula that explains the behavior.', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
  { step: '05', label: 'Discover', desc: 'Reveal the mathematical principle. The visitor now understands the concept through direct experience.', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
];

const exhibitionExps = EXPERIMENTS.filter((e) => e.exhibitionPick);

export default function ExhibitionMode() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = exhibitionExps[activeIndex] ?? exhibitionExps[0];

  return (
    <Layout noFooter>
      <div className="min-h-screen bg-gradient-to-b from-lab-bg via-lab-bg to-lab-surface">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <div className="flex items-center gap-3 mb-3">
            <Star className="w-6 h-6 text-amber-400" />
            <div className="section-label text-amber-400/70">Exhibition Mode</div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-3">Live Demonstration</h1>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            Designed for presenting MathLab at a Science Exhibition. Follow the structured investigation flow to guide visitors through a complete mathematical discovery.
          </p>
        </div>

        {/* The 5-step flow */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STEPS.map(({ step, label, desc, color, border, bg }) => (
              <div key={step} className={`lab-card p-5 space-y-3 border ${border} ${bg}`}>
                <div className={`text-3xl font-bold font-mono ${color} opacity-60`}>{step}</div>
                <div className={`text-lg font-semibold ${color}`}>{label}</div>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active experiment showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="lab-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-slate-100">Now Demonstrating</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveIndex((i) => (i - 1 + exhibitionExps.length) % exhibitionExps.length)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-lab-hover transition-all"
                  aria-label="Previous experiment"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-600 font-mono">{activeIndex + 1} / {exhibitionExps.length}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="branch" branch={active.branch}>{active.branch}</Badge>
                  <Badge variant="difficulty" difficulty={active.difficulty}>{active.difficulty}</Badge>
                  <Badge variant="exhibition">Exhibition Pick</Badge>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">{active.title}</h3>
                <p className="text-slate-400 leading-relaxed">{active.longDescription}</p>
                <div className="flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs bg-lab-surface border border-lab-border text-slate-500">{tag}</span>
                  ))}
                </div>
                <Link to={`/experiments/${active.id}`} className="btn-primary inline-flex items-center gap-2">
                  Launch Experiment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-slate-500 mb-2">Exhibition Picks</div>
                {exhibitionExps.map((exp, i) => (
                  <button
                    key={exp.id}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      i === activeIndex ? 'bg-amber-500/10 border-amber-500/30' : 'bg-lab-surface border-lab-border hover:border-primary-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-sm font-medium ${i === activeIndex ? 'text-amber-300' : 'text-slate-300'}`}>{exp.shortTitle}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{exp.branch}</div>
                      </div>
                      {i === activeIndex && <ChevronRight className="w-4 h-4 text-amber-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Keep It Interactive', desc: 'Let the visitor press the buttons and change the variables. Discovery is more powerful when it is hands-on.' },
              { title: 'Ask Before Telling', desc: 'Always ask "What do you think will happen?" before running the experiment. This creates engagement.' },
              { title: 'Connect to Theory', desc: 'After the experiment, show the mathematical formula that explains the result. This bridges experience and understanding.' },
            ].map((tip) => (
              <div key={tip.title} className="lab-card p-5 space-y-2">
                <h4 className="text-sm font-semibold text-cyan-300">{tip.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
