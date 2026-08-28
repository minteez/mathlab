import { Link } from 'react-router-dom';
import {
  ChevronRight, Zap, ArrowRight, FlaskConical, Hash, Sigma, SquareFunction,
  BarChart3, Dices, Shapes, Snowflake, Target, Star, Eye, TrendingUp, Leaf,
  Pi, Infinity, Shuffle, Layers, Ratio, BookOpen, Calculator, Brain, Gamepad2,
  Globe, Calendar, Search, Trophy
} from 'lucide-react';
import HeroCanvas from '@/components/math/HeroCanvas';
import Badge from '@/components/ui/Badge';
import { EXPERIMENTS } from '@/data/experiments';

const CATEGORIES = [
  { label: 'Number', icon: Hash, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', to: '/explore?branch=Number' },
  { label: 'Algebra', icon: SquareFunction, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', to: '/explore?branch=Algebra' },
  { label: 'Geometry', icon: Shapes, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', to: '/explore?branch=Geometry' },
  { label: 'Statistics', icon: BarChart3, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', to: '/explore?branch=Statistics' },
  { label: 'Probability', icon: Dices, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', to: '/explore?branch=Probability' },
  { label: 'Functions', icon: TrendingUp, color: 'text-primary-400', bg: 'bg-primary-500/10', border: 'border-primary-500/20', to: '/explore?branch=Functions' },
  { label: 'Sequences', icon: Sigma, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', to: '/explore?branch=Sequences' },
  { label: 'Patterns', icon: Snowflake, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', to: '/explore?branch=Patterns' },
  { label: 'Logic', icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', to: '/explore?branch=Logic' },
];

const HOW_STEPS = [
  { step: '01', label: 'Predict', desc: 'Make a mathematical prediction before running the experiment.', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
  { step: '02', label: 'Experiment', desc: 'Change variables and run the interactive simulation.', color: 'text-primary-400', border: 'border-primary-500/30', bg: 'bg-primary-500/10' },
  { step: '03', label: 'Observe', desc: 'Watch the mathematical behavior emerge in real time.', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  { step: '04', label: 'Compare', desc: 'Compare your experimental result with the mathematical theory.', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
  { step: '05', label: 'Discover', desc: 'Understand the mathematics that explains what you observed.', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
];

const DISCOVERIES = [
  { icon: Pi, label: 'Why π appears everywhere', color: 'text-cyan-400', bg: 'bg-cyan-500/10', to: '/discover' },
  { icon: Leaf, label: 'Fibonacci in nature', color: 'text-emerald-400', bg: 'bg-emerald-500/10', to: '/discover' },
  { icon: Infinity, label: 'Not all infinities are equal', color: 'text-primary-400', bg: 'bg-primary-500/10', to: '/discover' },
  { icon: Shuffle, label: 'Probability paradoxes', color: 'text-amber-400', bg: 'bg-amber-500/10', to: '/discover' },
  { icon: Layers, label: 'The mathematics of symmetry', color: 'text-purple-400', bg: 'bg-purple-500/10', to: '/discover' },
  { icon: Ratio, label: 'The golden ratio', color: 'text-rose-400', bg: 'bg-rose-500/10', to: '/discover' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Dices, BarChart3, TrendingUp, Shapes, Sigma, Hash, Snowflake, Target,
  Grid3x3: Hash, SquareFunction: TrendingUp,
};

const featuredExp = EXPERIMENTS.find((e) => e.featured) ?? EXPERIMENTS[0];
const exhibitionExps = EXPERIMENTS.filter((e) => e.exhibitionPick).slice(0, 4);

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background canvas */}
        <div className="absolute inset-0 opacity-60">
          <HeroCanvas />
        </div>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-lab-bg/20 via-transparent to-lab-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-lab-bg/80 via-lab-bg/40 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-3 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/25 text-primary-300 text-xs font-semibold tracking-wide">
                <FlaskConical className="w-3.5 h-3.5" />
                Senior Category Science Exhibition — Mathematics
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="text-slate-100">Math</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Lab</span>
              </h1>
              <p className="text-xl sm:text-2xl font-light text-slate-300 tracking-wide">
                Explore. Experiment. Discover.
              </p>
            </div>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              An interactive mathematical laboratory where you test ideas, visualize relationships, run experiments, and discover the mathematics behind every result.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/experiments"
                className="btn-primary text-base px-7 py-3.5 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Enter the Laboratory
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/explore"
                className="btn-secondary text-base px-7 py-3.5 flex items-center gap-2"
              >
                Explore Experiments
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { value: '9', label: 'Experiments' },
                { value: '10+', label: 'Challenges' },
                { value: '8', label: 'Discoveries' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-cyan-300">{value}</div>
                  <div className="text-xs text-slate-500 tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED EXPERIMENT ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="section-label">Featured Investigation</div>
          <div className="flex-1 h-px bg-lab-border" />
          <Badge variant="featured">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>

        <div className="bg-gradient-to-br from-lab-card to-lab-surface border border-lab-border rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 sm:p-10 flex flex-col justify-center space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="branch" branch={featuredExp.branch}>{featuredExp.branch}</Badge>
                <Badge variant="exhibition">Exhibition Pick</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 leading-tight">
                {featuredExp.title}
              </h2>
              <p className="text-slate-400 leading-relaxed">{featuredExp.longDescription}</p>
              <div className="flex flex-wrap gap-2">
                {featuredExp.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-xs bg-lab-surface border border-lab-border text-slate-400">{tag}</span>
                ))}
              </div>
              <Link
                to={`/experiments/${featuredExp.id}`}
                className="btn-primary self-start"
              >
                Start This Experiment
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-primary-900/30 to-cyan-900/20 border-l border-lab-border">
              <div className="absolute inset-0 experiment-grid opacity-40" />
              <div className="relative z-10 space-y-4 w-full max-w-xs">
                {[
                  { label: 'Theoretical Probability', value: '50.00%', color: 'text-cyan-400' },
                  { label: 'Experimental (100 trials)', value: '47.00%', color: 'text-primary-400' },
                  { label: 'Experimental (10,000 trials)', value: '49.86%', color: 'text-emerald-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="lab-card p-3">
                    <div className="text-xs text-slate-500 mb-1">{label}</div>
                    <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
                  </div>
                ))}
                <div className="lab-card p-3">
                  <div className="text-xs text-slate-500 mb-2">Convergence</div>
                  <div className="h-1.5 bg-lab-surface rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-600 to-cyan-400 rounded-full" style={{ width: '94%' }} />
                  </div>
                  <div className="text-xs text-emerald-400 mt-1.5 font-mono">98.6% accuracy at 10,000 trials</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPLORE CATEGORIES ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="section-label">Explore Mathematics</div>
          <div className="flex-1 h-px bg-lab-border" />
          <Link to="/explore" className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
            All topics <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {CATEGORIES.map(({ label, icon: Icon, color, bg, border, to }) => (
            <Link
              key={label}
              to={to}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${bg} ${border} hover:scale-105 transition-all group`}
            >
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW MATHLAB WORKS ─────────────────────────────────────── */}
      <section className="bg-lab-surface border-y border-lab-border py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label mb-3">The MathLab Method</div>
            <h2 className="text-3xl font-bold text-slate-100">How MathLab Works</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Don't just learn mathematics. Experiment with it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {HOW_STEPS.map(({ step, label, desc, color, border, bg }, i) => (
              <div key={step} className="relative">
                <div className={`lab-card p-5 space-y-3 h-full border ${border} ${bg}`}>
                  <div className={`text-3xl font-bold font-mono ${color} opacity-60`}>{step}</div>
                  <div className={`text-lg font-semibold ${color}`}>{label}</div>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL EXPERIMENTS ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="section-label">The Laboratory</div>
          <div className="flex-1 h-px bg-lab-border" />
          <Link to="/experiments" className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
            All experiments <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPERIMENTS.map((exp) => {
            const Icon = ICON_MAP[exp.icon] ?? FlaskConical;
            const colorMap: Record<string, string> = {
              cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
              primary: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
              amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            };
            const ic = colorMap[exp.color] ?? colorMap.primary;
            return (
              <Link
                key={exp.id}
                to={`/experiments/${exp.id}`}
                className="lab-card p-5 hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${ic}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {exp.exhibitionPick && <Badge variant="exhibition">Exhibition</Badge>}
                    <Badge variant="difficulty" difficulty={exp.difficulty}>{exp.difficulty}</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug mb-1.5">
                    {exp.shortTitle}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="branch" branch={exp.branch}>{exp.branch}</Badge>
                  <span className="text-xs text-primary-400 group-hover:text-primary-300 flex items-center gap-1 transition-colors">
                    Start <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── MATHEMATICAL DISCOVERY ──────────────────────────────────── */}
      <section className="bg-lab-surface border-y border-lab-border py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="section-label">Mathematical Phenomena</div>
            <div className="flex-1 h-px bg-lab-border" />
            <Link to="/discover" className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
              Discover more <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {DISCOVERIES.map(({ icon: Icon, label, color, bg, to }) => (
              <Link
                key={label}
                to={to}
                className={`${bg} border border-lab-border rounded-xl p-4 flex flex-col items-center gap-3 text-center hover:border-primary-500/40 transition-all group`}
              >
                <Icon className={`w-6 h-6 ${color}`} />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW SECTIONS SHOWCASE ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="section-label">Explore the Full Platform</div>
          <div className="flex-1 h-px bg-lab-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: '/learn', icon: BookOpen, label: 'Learn', desc: 'CBSE Class 6–10 topics with interactive challenges', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
            { to: '/formula-lab', icon: Calculator, label: 'Formula Lab', desc: 'Understand formulas with live visualizations', color: 'text-primary-400 bg-primary-500/10 border-primary-500/20' },
            { to: '/math-minds', icon: Brain, label: 'Math Minds', desc: 'The people who changed mathematics', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            { to: '/playground', icon: Gamepad2, label: 'Playground', desc: 'Puzzles and games that teach mathematical thinking', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { to: '/math-world', icon: Globe, label: 'Math World', desc: 'How mathematics shapes the real world', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
            { to: '/daily', icon: Calendar, label: 'Daily Discovery', desc: 'A new mathematical discovery every day', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
            { to: '/search', icon: Search, label: 'Search', desc: 'Find anything across all of MathLab', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
            { to: '/challenges', icon: Trophy, label: 'Challenges', desc: 'Test your skills across all math branches', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className="lab-card p-5 hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-3"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── EXHIBITION MODE CTA ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-900/20 via-lab-card to-lab-surface p-8 sm:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="section-label text-amber-400/70">Exhibition Mode</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
                Designed for Live Demonstration
              </h2>
              <p className="text-slate-400 leading-relaxed">
                MathLab's Exhibition Mode is optimized for demonstrating mathematical concepts to visitors at a Science Exhibition. Large controls, clear explanations, and a structured investigation flow.
              </p>
              <Link
                to="/exhibition"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-all shadow-glow-amber"
              >
                <Star className="w-4 h-4" />
                Launch Exhibition Mode
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {exhibitionExps.map((exp) => {
                const Icon = ICON_MAP[exp.icon] ?? FlaskConical;
                return (
                  <div key={exp.id} className="lab-card p-4 border-amber-500/20 space-y-2">
                    <Icon className="w-5 h-5 text-amber-400" />
                    <div className="text-sm font-medium text-slate-300">{exp.shortTitle}</div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-amber-400/60" />
                      <span className="text-xs text-amber-400/60">Exhibition Pick</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
