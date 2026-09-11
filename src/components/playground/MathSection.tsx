import type { ReactNode } from 'react';
import { Info, Sparkles, Lightbulb, ChevronRight } from 'lucide-react';

interface MathSectionProps {
  title: string;
  intro: ReactNode;
  concepts: { term: string; desc: string }[];
  formula?: string;
  tryThis?: string;
  whyMath?: string;
  children?: ReactNode;
}

export default function MathSection({ title, intro, concepts, formula, tryThis, whyMath, children }: MathSectionProps) {
  return (
    <div className="space-y-4">
      {/* Main math explanation */}
      <div className="lab-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        </div>
        <div className="text-sm text-slate-400 leading-relaxed space-y-2">{intro}</div>
        {formula && <div className="formula-box text-center">{formula}</div>}
        {children}
      </div>

      {/* Key concepts */}
      <div className="lab-card p-5 space-y-3">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Concepts</h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {concepts.map(c => (
            <div key={c.term} className="bg-lab-surface rounded-lg p-3">
              <p className="text-sm font-semibold text-slate-300">{c.term}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why it's mathematical */}
      {whyMath && (
        <div className="lab-card p-4 border-cyan-500/15 bg-cyan-500/5">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-cyan-300">Why It's Mathematical</span>
              <p className="text-sm text-slate-400 leading-relaxed mt-1">{whyMath}</p>
            </div>
          </div>
        </div>
      )}

      {/* Try This */}
      {tryThis && (
        <div className="lab-card p-4 border-amber-500/15 bg-amber-500/5">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-amber-300">Try This</span>
              <p className="text-sm text-slate-400 leading-relaxed mt-1">{tryThis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
