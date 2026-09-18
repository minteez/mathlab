import { useState } from 'react';
import { Telescope, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface ResearchProblem {
  id: string;
  title: string;
  field: string;
  prize: string;
  status: 'unsolved' | 'partially solved';
  plainLanguage: string;
  formalStatement: string;
  whyItMatters: string;
  whatIsKnown: string;
  whatRemains: string;
  relatedFields: string[];
  color: string;
}

const PROBLEMS: ResearchProblem[] = [
  {
    id: 'riemann',
    title: 'Riemann Hypothesis',
    field: 'Number Theory',
    prize: '$1,000,000 (Clay Millennium Prize)',
    status: 'unsolved',
    plainLanguage: 'The Riemann Hypothesis is about the distribution of prime numbers. It states that all non-trivial zeros of the Riemann zeta function lie on a single vertical line in the complex plane. If true, it would mean primes are distributed as evenly as possible — there are no unexpected "gaps" or "clusters" in the primes beyond what statistical fluctuation predicts.',
    formalStatement: 'All non-trivial zeros of the Riemann zeta function zeta(s) have real part equal to 1/2.',
    whyItMatters: 'The distribution of prime numbers underpins modern cryptography, number theory, and the structure of integers. Hundreds of results in mathematics begin with "Assuming the Riemann Hypothesis..." — proving it would instantly make all of them true.',
    whatIsKnown: 'The first 10 trillion zeros have been computed and all lie on the line Re(s) = 1/2. It is known that at least 41% of zeros lie on the critical line. But computation cannot prove a result about infinitely many zeros.',
    whatRemains: 'A proof (or disproof) that ALL non-trivial zeros lie on Re(s) = 1/2. Most mathematicians believe it is true, but belief is not proof.',
    relatedFields: ['Complex Analysis', 'Number Theory', 'Analytic Number Theory'],
    color: 'cyan',
  },
  {
    id: 'p-vs-np',
    title: 'P vs NP',
    field: 'Computer Science',
    prize: '$1,000,000 (Clay Millennium Prize)',
    status: 'unsolved',
    plainLanguage: 'P is the class of problems that can be solved quickly (in polynomial time). NP is the class of problems where a proposed solution can be verified quickly. The question: is P = NP? Can every problem whose answer can be checked quickly also be solved quickly?',
    formalStatement: 'Is the complexity class P equal to NP? That is, can every problem in NP be solved by an algorithm in polynomial time?',
    whyItMatters: 'If P = NP, then many problems we currently believe are hard (factoring, optimization, scheduling, theorem-proving) would actually be easy. This would revolutionize computing — and break most of cryptography, which relies on certain problems being hard to solve but easy to verify.',
    whatIsKnown: 'Most experts believe P is not equal to NP. Some barriers (relativization, natural proofs, algebrization) show that standard proof techniques cannot resolve the question. The problem has been open since 1971.',
    whatRemains: 'A proof that P is not equal to NP (showing some NP problems are genuinely hard) or P = NP (providing polynomial algorithms for NP-complete problems). Either result would transform computer science.',
    relatedFields: ['Complexity Theory', 'Algorithms', 'Cryptography'],
    color: 'amber',
  },
  {
    id: 'collatz',
    title: 'Collatz Conjecture',
    field: 'Number Theory',
    prize: 'Paul Erdos offered $500 (no formal prize)',
    status: 'unsolved',
    plainLanguage: 'Start with any positive integer n. If n is even, divide by 2. If n is odd, multiply by 3 and add 1. Repeat. The conjecture: you will always eventually reach 1. For example: 6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1.',
    formalStatement: 'For every positive integer n, the Collatz sequence (n/2 if even, 3n+1 if odd) eventually reaches 1.',
    whyItMatters: 'Despite its simplicity, the Collatz conjecture has resisted proof for over 80 years. It reveals how little we understand about the behavior of simple iterative processes. Paul Erdos said: "Mathematics may not be ready for such problems."',
    whatIsKnown: 'Verified computationally for all starting values up to 2^68 (approximately 2.95 x 10^20). It is known that the sequence eventually reaches a value below the starting point for "almost all" numbers, but this is not a proof for all numbers.',
    whatRemains: 'A proof that every starting value eventually reaches 1, or a counterexample — a number whose sequence diverges to infinity or enters a cycle other than 1 -> 4 -> 2 -> 1.',
    relatedFields: ['Number Theory', 'Dynamical Systems', 'Discrete Mathematics'],
    color: 'primary',
  },
  {
    id: 'navier-stokes',
    title: 'Navier-Stokes Existence and Smoothness',
    field: 'Differential Equations',
    prize: '$1,000,000 (Clay Millennium Prize)',
    status: 'unsolved',
    plainLanguage: 'The Navier-Stokes equations describe how fluids (water, air) flow. They are used to design airplanes, predict weather, and model blood flow. But we cannot prove that solutions always exist and remain smooth (no sudden infinite spikes) for all initial conditions in 3D.',
    formalStatement: 'Prove that smooth, globally defined solutions exist for the 3D Navier-Stokes equations for all smooth initial data.',
    whyItMatters: 'The equations govern all fluid dynamics. If solutions can break down (develop singularities), our mathematical model of fluids may be incomplete. Understanding this would impact weather prediction, aerodynamics, and engineering.',
    whatIsKnown: 'Solutions are known to exist and be smooth in 2D. In 3D, weak (non-smooth) solutions exist, but smoothness is only proven for short times. No singularity has been found, but none has been ruled out either.',
    whatRemains: 'A proof that 3D Navier-Stokes solutions remain smooth for all time, or a demonstration that singularities can form. This is one of the deepest open problems in mathematical physics.',
    relatedFields: ['Partial Differential Equations', 'Fluid Dynamics', 'Mathematical Physics'],
    color: 'rose',
  },
  {
    id: 'bsd',
    title: 'Birch and Swinnerton-Dyer Conjecture',
    field: 'Algebraic Geometry / Number Theory',
    prize: '$1,000,000 (Clay Millennium Prize)',
    status: 'partially solved',
    plainLanguage: 'An elliptic curve is a smooth curve defined by y^2 = x^3 + ax + b. The Birch and Swinnerton-Dyer conjecture connects the number of rational solutions to the behavior of a function (the L-function) associated with the curve. It says: if the L-function vanishes at s=1, the curve has infinitely many rational points.',
    formalStatement: 'The rank of an elliptic curve E over Q equals the order of vanishing of its L-function L(E, s) at s = 1.',
    whyItMatters: 'Elliptic curves are central to modern number theory and cryptography (elliptic curve cryptography). This conjecture provides a way to determine whether an elliptic curve has infinitely many rational solutions — a question that is otherwise extremely difficult to answer.',
    whatIsKnown: 'Proven for curves of rank 0 and 1 (by Gross-Zagier and Kolyvagin). The general case for higher ranks remains open. Computational evidence strongly supports the conjecture.',
    whatRemains: 'A proof for all ranks. The conjecture is one of the deepest connections between algebraic geometry and number theory.',
    relatedFields: ['Algebraic Geometry', 'Number Theory', 'Elliptic Curves'],
    color: 'cyan',
  },
];

export default function ResearchFrontier() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Open Problems</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Research Frontier</h1>
          <p className="text-slate-500 max-w-2xl">
            The greatest unsolved problems in mathematics. Each one represents the boundary between what mathematics can currently explain and what remains unknown. These are the questions that drive mathematical research today.
          </p>
        </div>

        <div className="space-y-4">
          {PROBLEMS.map((p) => {
            const isOpen = expanded === p.id;
            return (
              <div key={p.id} className="lab-card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-lab-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${p.color}-500/10 border border-${p.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                      <Telescope className={`w-5 h-5 text-${p.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200">{p.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-600">{p.field}</span>
                        {p.status === 'unsolved' ? (
                          <span className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Unsolved</span>
                        ) : (
                          <span className="text-xs text-amber-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Partially solved</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-lab-border">
                    <div>
                      <span className="text-xs font-semibold text-cyan-400">In Plain Language</span>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed">{p.plainLanguage}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-amber-400">Formal Statement</span>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed font-mono">{p.formalStatement}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-primary-400">Why It Matters</span>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.whyItMatters}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-lab-surface rounded-lg p-3">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> What Is Known</span>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.whatIsKnown}</p>
                      </div>
                      <div className="bg-lab-surface rounded-lg p-3">
                        <span className="text-xs font-semibold text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> What Remains</span>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.whatRemains}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.relatedFields.map(f => (
                        <span key={f} className="px-2.5 py-1 rounded-full text-xs bg-lab-surface border border-lab-border text-slate-500">{f}</span>
                      ))}
                    </div>
                    <div className="text-xs text-amber-400/80 italic">Prize: {p.prize}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 lab-card p-6 border-amber-500/15 bg-amber-500/5">
          <p className="text-sm text-slate-400 leading-relaxed">
            <strong className="text-amber-300">A note on unsolved problems:</strong> Mathematics advances by asking questions it cannot yet answer. These problems are not failures — they are the frontier. Each one defines the edge of human knowledge and invites the next generation of mathematicians to push further.
          </p>
        </div>
      </div>
    </Layout>
  );
}
