import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Lightbulb, Calculator, Brain, FlaskConical, ArrowRight, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { FUN_FACTS } from '@/data/funFacts';
import { FORMULAS } from '@/data/formulas';
import { MATHEMATICIANS } from '@/data/mathematicians';
import { EXPERIMENTS } from '@/data/experiments';
import { CHALLENGES } from '@/data/challenges';

export default function DailyDiscovery() {
  const dayOfYear = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now.getTime() - start.getTime()) / 86400000);
  }, []);

  const fact = FUN_FACTS[dayOfYear % FUN_FACTS.length];
  const formula = FORMULAS[dayOfYear % FORMULAS.length];
  const mathematician = MATHEMATICIANS[dayOfYear % MATHEMATICIANS.length];
  const experiment = EXPERIMENTS[dayOfYear % EXPERIMENTS.length];
  const challenge = CHALLENGES[dayOfYear % CHALLENGES.length];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="section-label">{today}</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Daily Discovery</h1>
          <p className="text-slate-500 max-w-2xl">
            A new mathematical discovery every day — a fun fact, a formula, a mathematician, an experiment, and a challenge. Come back tomorrow for more.
          </p>
        </div>

        <div className="space-y-4">
          {/* Fun Fact */}
          <div className="lab-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-300">Did You Know?</h3>
              <Badge variant="tag">{fact.category}</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed">{fact.fact}</p>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Why?</p>
              <p className="text-sm text-slate-400 leading-relaxed">{fact.why}</p>
            </div>
            <Link to={fact.exploreLink} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              Explore: {fact.exploreLabel} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Formula */}
          <div className="lab-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-cyan-300">Formula of the Day</h3>
              <Badge variant="tag">{formula.category}</Badge>
            </div>
            <h4 className="text-lg font-bold text-slate-100">{formula.name}</h4>
            <div className="formula-box text-center text-base">{formula.formula}</div>
            <p className="text-sm text-slate-400 leading-relaxed">{formula.intuition}</p>
            <Link to="/formula-lab" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              Open Formula Lab <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mathematician */}
          <div className="lab-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-400" />
              <h3 className="text-sm font-semibold text-primary-300">Mathematician of the Day</h3>
              <Badge variant="branch" branch={mathematician.branch}>{mathematician.branch}</Badge>
            </div>
            <h4 className="text-lg font-bold text-slate-100">{mathematician.name}</h4>
            <p className="text-xs text-slate-500">{mathematician.era} · {mathematician.region}</p>
            <p className="text-sm text-slate-400 leading-relaxed">{mathematician.whyTheyMatter}</p>
            <Link to="/math-minds" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              Read full profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Experiment */}
          <div className="lab-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-300">Experiment of the Day</h3>
            </div>
            <h4 className="text-lg font-bold text-slate-100">{experiment.shortTitle}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{experiment.description}</p>
            <Link to={`/experiments/${experiment.id}`} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              Start experiment <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Challenge */}
          <div className="lab-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-semibold text-rose-300">Challenge of the Day</h3>
              <Badge variant="difficulty" difficulty={challenge.difficulty}>{challenge.difficulty}</Badge>
            </div>
            <h4 className="text-lg font-bold text-slate-100">{challenge.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{challenge.problem}</p>
            <Link to="/challenges" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              Try this challenge <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
