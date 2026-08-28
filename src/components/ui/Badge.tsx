import type { Difficulty, MathBranch } from '@/types';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'difficulty' | 'branch' | 'tag' | 'featured' | 'exhibition' | 'new';
  difficulty?: Difficulty;
  branch?: MathBranch;
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Foundation: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Advanced: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Exhibition Challenge': 'bg-red-500/15 text-red-400 border-red-500/30',
};

const BRANCH_STYLES: Record<string, string> = {
  Number: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Algebra: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Geometry: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  Statistics: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  Probability: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  Functions: 'bg-primary-500/15 text-primary-400 border-primary-500/30',
  Sequences: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Logic: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  Patterns: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  'Number Theory': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
};

export default function Badge({ children, className, variant = 'tag', difficulty, branch }: BadgeProps) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide';

  const styles = {
    difficulty: difficulty ? DIFFICULTY_STYLES[difficulty] : '',
    branch: branch ? (BRANCH_STYLES[branch] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/30') : '',
    tag: 'bg-lab-surface text-slate-400 border-lab-border',
    featured: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    exhibition: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    new: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  };

  return (
    <span className={cn(base, styles[variant], className)}>
      {children}
    </span>
  );
}
