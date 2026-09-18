import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface Paradox {
  id: string;
  title: string;
  field: string;
  setup: string;
  expectation: string;
  explanation: string;
  resolution: string;
  color: string;
}

const PARADOXES: Paradox[] = [
  {
    id: 'monty-hall',
    title: 'Monty Hall Problem',
    field: 'Probability',
    setup: 'You are on a game show with 3 doors. Behind one is a car; behind the other two are goats. You pick Door 1. The host (who knows what is behind each door) opens Door 3, revealing a goat. He asks: "Do you want to switch to Door 2?"',
    expectation: 'Intuitively, it seems like switching makes no difference — there are two doors left, so the odds should be 50/50.',
    explanation: 'When you first chose Door 1, you had a 1/3 chance of being right and a 2/3 chance of being wrong. The host opening Door 3 does not change these probabilities — it only reveals information about where the car is NOT. The 2/3 probability that the car is behind Door 2 or 3 collapses entirely onto Door 2.',
    resolution: 'Switching doubles your chance of winning: 2/3 vs 1/3. This is because the host\'s action is not random — he always reveals a goat, which concentrates the probability onto the remaining unchosen door.',
    color: 'cyan',
  },
  {
    id: 'banach-tarski',
    title: 'Banach-Tarski Paradox',
    field: 'Set Theory / Geometry',
    setup: 'It is possible to take a solid sphere, cut it into a finite number of pieces, and reassemble those pieces (using only rotations and translations) into TWO identical copies of the original sphere.',
    expectation: 'This seems to violate conservation of volume — how can you create more volume from the same pieces?',
    explanation: 'The pieces are not ordinary 3D shapes — they are non-measurable sets constructed using the Axiom of Choice. These sets have no well-defined volume, so the concept of volume conservation does not apply to them. The reassembly uses only rigid motions (rotations and translations), but the pieces are so pathological that they cannot be assigned a volume.',
    resolution: 'The paradox reveals that the Axiom of Choice has surprising consequences. It does not work in 2D (where such decompositions are impossible) and relies on the non-measurability of the pieces. In practice, these pieces cannot be physically constructed — they exist only in the mathematical universe of set theory.',
    color: 'amber',
  },
  {
    id: 'gabriels-horn',
    title: 'Gabriel\'s Horn',
    field: 'Calculus',
    setup: 'Take the curve y = 1/x for x >= 1 and rotate it around the x-axis. The resulting 3D shape (Gabriel\'s Horn) has a finite volume but an infinite surface area.',
    expectation: 'If a shape has finite volume, surely its surface area must also be finite? How can you fill it with a finite amount of paint but never have enough paint to coat its surface?',
    explanation: 'The volume is V = pi * integral from 1 to infinity of (1/x)^2 dx = pi, which converges. The surface area is A = 2*pi * integral from 1 to infinity of (1/x)*sqrt(1 + 1/x^4) dx, which diverges because the integral of 1/x diverges. The integrals behave differently because squaring 1/x makes it decay fast enough to converge, while 1/x itself does not.',
    resolution: 'This is a genuine mathematical fact, not a contradiction. It highlights that our intuition about finite objects does not always extend to infinite ones. The "paint" analogy breaks down because real paint has a minimum thickness, while mathematical surface area has no thickness at all.',
    color: 'primary',
  },
  {
    id: 'russell',
    title: 'Russell\'s Paradox',
    field: 'Set Theory / Logic',
    setup: 'Consider the set R of all sets that do not contain themselves. Does R contain itself? If R contains itself, then by definition it should not. If R does not contain itself, then by definition it should.',
    expectation: 'This creates an inescapable logical contradiction — a set that both must and must not contain itself.',
    explanation: 'The paradox arises from unrestricted self-reference in set formation — allowing any property to define a set. The "set of all sets that do not contain themselves" is a self-referential definition that creates a loop.',
    resolution: 'Modern set theory (Zermelo-Fraenkel) resolves this by restricting which sets can be formed. The Axiom of Specification only allows creating subsets of existing sets, preventing the construction of R. This showed that naive set theory was inconsistent and motivated the rigorous axiomatic foundations of modern mathematics.',
    color: 'rose',
  },
];

export default function Paradoxes() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Mathematical Curiosities</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Mathematical Paradoxes</h1>
          <p className="text-slate-500 max-w-2xl">
            Where mathematics challenges intuition. Each paradox reveals a place where our common sense fails but mathematics remains correct — teaching us to trust rigorous reasoning over gut feelings.
          </p>
        </div>

        <div className="space-y-4">
          {PARADOXES.map((p) => {
            const isOpen = expanded === p.id;
            return (
              <div key={p.id} className="lab-card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-lab-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${p.color}-500/10 border border-${p.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                      <AlertTriangle className={`w-5 h-5 text-${p.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200">{p.title}</h3>
                      <span className="text-xs text-slate-600">{p.field}</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-lab-border">
                    <div>
                      <span className="text-xs font-semibold text-cyan-400">The Setup</span>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed">{p.setup}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-amber-400">Why It Feels Wrong</span>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.expectation}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-primary-400">The Mathematics</span>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.explanation}</p>
                    </div>
                    <div className="bg-lab-surface rounded-lg p-3">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Resolution</span>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.resolution}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 lab-card p-6 border-cyan-500/15 bg-cyan-500/5">
          <p className="text-sm text-slate-400 leading-relaxed">
            <strong className="text-cyan-300">Why study paradoxes?</strong> Paradoxes are not failures of mathematics — they are stress tests. Each one forced mathematicians to build stronger foundations, from the axioms of set theory to the rigorous definitions of calculus. They remind us that intuition must be guided by proof.
          </p>
        </div>
      </div>
    </Layout>
  );
}
