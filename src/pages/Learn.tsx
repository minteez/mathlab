import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, ChevronRight, Check, X, Lightbulb, Calculator, Globe, ArrowRight,
  Link2, Sparkles, Route, Layers, Search, Filter, BookMarked, GraduationCap,
  Target, Cpu, Building2, Telescope, Hash, Sigma, Triangle, TrendingUp,
  Dices, Compass, Waves, Boxes, Grid3x3, Network, GitBranch,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { MATH_CONCEPTS, CONCEPT_PATHS, BRANCHES, DEPTH_LEVELS } from '@/data/concepts';
import type { MathConcept, ConceptStep, DepthLevel, ProofTechnique } from '@/types';

import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Hash, Sigma, Triangle, TrendingUp, Dices, Cpu, Compass, Waves, Boxes, Grid3x3,
  Network, GitBranch, GraduationCap, Target, Building2, Telescope, BookMarked,
};

const DEPTH_COLORS: Record<DepthLevel, string> = {
  Foundation: 'emerald',
  Core: 'cyan',
  Extension: 'amber',
  University: 'primary',
  Research: 'rose',
};

const DEPTH_DOTS: Record<DepthLevel, number> = {
  Foundation: 1,
  Core: 2,
  Extension: 3,
  University: 4,
  Research: 5,
};

function ProofStepRow({ index, label, detail, color, forceShow }: { index: number; label: string; detail: string; color: string; forceShow: boolean }) {
  const [open, setOpen] = useState(false);
  const visible = forceShow || open;
  return (
    <div className="lab-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3 flex items-center gap-3 text-left hover:bg-lab-hover transition-colors"
      >
        <span className={`w-7 h-7 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-xs font-bold text-${color}-400 flex-shrink-0`}>
          {index + 1}
        </span>
        <span className="text-sm font-medium text-slate-300 flex-1">{label}</span>
        <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${visible ? 'rotate-90' : ''}`} />
      </button>
      {visible && (
        <div className="px-3 pb-3 pl-13">
          <p className="text-sm text-slate-400 leading-relaxed pl-10">{detail}</p>
        </div>
      )}
    </div>
  );
}

function DepthIndicator({ level, maxLevel = 5 }: { level: DepthLevel; maxLevel?: number }) {
  const filled = DEPTH_DOTS[level];
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLevel }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all ${i < filled ? `bg-${DEPTH_COLORS[level]}-400` : 'bg-lab-border'}`}
        />
      ))}
    </div>
  );
}

export default function Learn() {
  const [selectedConcept, setSelectedConcept] = useState<MathConcept | null>(null);
  const [selectedStep, setSelectedStep] = useState<ConceptStep | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'example' | 'practice' | 'proof' | 'explore'>('learn');
  const [showProofSteps, setShowProofSteps] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [practiceResult, setPracticeResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showPaths, setShowPaths] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [depthFilter, setDepthFilter] = useState('All');

  const conceptMap = useMemo(() => {
    const map: Record<string, MathConcept> = {};
    MATH_CONCEPTS.forEach(c => { map[c.id] = c; });
    return map;
  }, []);

  const filteredConcepts = useMemo(() => {
    return MATH_CONCEPTS.filter(c => {
      const matchesSearch = searchQuery === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.steps.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBranch = branchFilter === 'All' || c.branch === branchFilter;
      const matchesDepth = depthFilter === 'All' || c.steps.some(s => s.level === depthFilter);
      return matchesSearch && matchesBranch && matchesDepth;
    });
  }, [searchQuery, branchFilter, depthFilter]);

  const checkAnswer = () => {
    if (!selectedStep?.challenge) return;
    const correct = selectedStep.challenge.answer.toString().toLowerCase().trim();
    const given = practiceAnswer.toString().toLowerCase().trim();
    setPracticeResult(given === correct ? 'correct' : 'incorrect');
  };

  // ─── Step Detail View ──────────────────────────────
  if (selectedStep && selectedConcept) {
    const concept = selectedConcept;
    const step = selectedStep;
    const stepIndex = concept.steps.findIndex(s => s.id === step.id);
    const nextStep = stepIndex < concept.steps.length - 1 ? concept.steps[stepIndex + 1] : null;
    const prevStep = stepIndex > 0 ? concept.steps[stepIndex - 1] : null;

    const PROOF_TECHNIQUE_COLORS: Record<ProofTechnique, string> = {
      Pattern: 'emerald', Visual: 'emerald', Direct: 'cyan',
      Contradiction: 'amber', Contrapositive: 'amber', Induction: 'amber',
      Construction: 'primary', Analysis: 'primary', Diagonalization: 'rose',
    };

    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <button
            onClick={() => setSelectedStep(null)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to {concept.title}
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="tag">{concept.branch}</Badge>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-${DEPTH_COLORS[step.level]}-500/10 text-${DEPTH_COLORS[step.level]}-400 border border-${DEPTH_COLORS[step.level]}-500/20`}>
              {step.level}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">{step.title}</h1>
          <p className="text-sm text-slate-500 mb-6">{concept.title} — Step {stepIndex + 1} of {concept.steps.length}</p>

          {/* Depth indicator */}
          <div className="flex items-center gap-3 mb-6">
            <DepthIndicator level={step.level} maxLevel={concept.steps.length} />
            <span className="text-xs text-slate-600">{step.level} level</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-lab-border mb-6 overflow-x-auto">
            {(['learn', 'example', 'practice', 'proof', 'explore'] as const).map((tab) => {
              const hasContent = tab === 'learn' || (tab === 'example' && step.example) || (tab === 'practice' && step.challenge) || (tab === 'proof' && step.proof) || (tab === 'explore' && (step.relatedExperiment || concept.leadsTo.length > 0));
              if (!hasContent) return null;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {activeTab === 'learn' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Concept</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
              {step.formula && (
                <div>
                  <h3 className="text-sm font-semibold text-primary-300 mb-2 flex items-center gap-2"><Calculator className="w-4 h-4" /> Formula / Key Idea</h3>
                  <div className="formula-box whitespace-pre-line">{step.formula}</div>
                </div>
              )}
              {step.realWorld && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2"><Globe className="w-4 h-4" /> Real-World Connection</h3>
                  <p className="text-slate-400 leading-relaxed">{step.realWorld}</p>
                </div>
              )}
              {step.proofNote && (
                <div className="lab-card p-4 border-primary-500/15 bg-primary-500/5">
                  <h3 className="text-sm font-semibold text-primary-300 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Proof Insight</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.proofNote}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'example' && step.example && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2"><Calculator className="w-4 h-4" /> Worked Example</h3>
              <div className="lab-card p-5">
                <p className="text-slate-400 leading-relaxed font-mono text-sm">{step.example}</p>
              </div>
            </div>
          )}

          {activeTab === 'practice' && step.challenge && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Challenge</h3>
              <div className="lab-card p-5 space-y-4">
                <p className="text-slate-300 leading-relaxed">{step.challenge.question}</p>
                {step.challenge.type === 'multiple-choice' && step.challenge.options ? (
                  <div className="space-y-2">
                    {step.challenge.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setPracticeAnswer(opt); setPracticeResult(null); }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all ${practiceAnswer === opt ? 'bg-primary-500/15 border-primary-500/40 text-primary-300' : 'bg-lab-surface border-lab-border text-slate-400 hover:border-primary-500/30'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={practiceAnswer}
                    onChange={(e) => { setPracticeAnswer(e.target.value); setPracticeResult(null); }}
                    placeholder="Enter your answer..."
                    className="lab-input w-full"
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                )}
                <button onClick={checkAnswer} disabled={!practiceAnswer} className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  Check Answer
                </button>
                {practiceResult === 'correct' && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <Check className="w-4 h-4" /> Correct! Well done.
                  </div>
                )}
                {practiceResult === 'incorrect' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <X className="w-4 h-4" /> Not quite. The answer is {step.challenge.answer}. Try again!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'proof' && step.proof && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${PROOF_TECHNIQUE_COLORS[step.proof.technique]}-500/10 text-${PROOF_TECHNIQUE_COLORS[step.proof.technique]}-400 border border-${PROOF_TECHNIQUE_COLORS[step.proof.technique]}-500/20`}>
                  {step.proof.technique} Proof
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Statement</h3>
                <p className="text-slate-300 leading-relaxed font-medium">{step.proof.statement}</p>
              </div>
              {step.proof.intuition && (
                <div className="lab-card p-4 border-amber-500/15 bg-amber-500/5">
                  <h4 className="text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" /> Intuition</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.proof.intuition}</p>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-primary-300 flex items-center gap-2"><Calculator className="w-4 h-4" /> Proof Steps</h3>
                  <button
                    onClick={() => setShowProofSteps(!showProofSteps)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showProofSteps ? 'Hide all' : 'Reveal all'}
                  </button>
                </div>
                <div className="space-y-2">
                  {step.proof.steps.map((ps, i) => (
                    <ProofStepRow key={i} index={i} label={ps.label} detail={ps.detail} color={PROOF_TECHNIQUE_COLORS[step.proof!.technique]} forceShow={showProofSteps} />
                  ))}
                </div>
              </div>
              <div className="lab-card p-4 border-emerald-500/15 bg-emerald-500/5">
                <h3 className="text-sm font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Check className="w-4 h-4" /> Conclusion</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.proof.conclusion}</p>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-6">
              {step.relatedExperiment && (
                <div>
                  <h3 className="text-sm font-semibold text-cyan-300 mb-2">Related Experiment</h3>
                  <Link to={step.relatedExperiment} className="lab-card p-5 hover:border-primary-500/40 hover:bg-lab-hover transition-all group flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-white">Open Experiment</div>
                      <div className="text-xs text-slate-500">Explore this concept interactively</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Where This Leads */}
              {concept.leadsTo.length > 0 && (
                <div className="lab-card p-5 border-cyan-500/20 bg-cyan-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-300">Where This Leads</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">This concept connects to deeper areas of mathematics:</p>
                  <div className="flex flex-wrap gap-2">
                    {concept.leadsTo.map(id => {
                      const c = conceptMap[id];
                      if (!c) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => { setSelectedConcept(c); setSelectedStep(null); setActiveTab('learn'); }}
                          className="px-3 py-1.5 rounded-lg bg-lab-surface border border-lab-border text-xs text-slate-400 hover:border-cyan-500/30 hover:text-slate-200 transition-all"
                        >
                          {c.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {concept.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-primary-300 mb-3 flex items-center gap-2"><Layers className="w-4 h-4" /> Prerequisites</h3>
                  <div className="flex flex-wrap gap-2">
                    {concept.prerequisites.map(id => {
                      const c = conceptMap[id];
                      if (!c) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => { setSelectedConcept(c); setSelectedStep(null); setActiveTab('learn'); }}
                          className="px-3 py-1.5 rounded-lg bg-lab-surface border border-lab-border text-xs text-slate-400 hover:border-primary-500/30 hover:text-slate-200 transition-all"
                        >
                          {c.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next/Prev steps */}
              <div className="flex items-center justify-between gap-4 pt-4">
                {prevStep ? (
                  <button
                    onClick={() => { setSelectedStep(prevStep); setActiveTab('learn'); setPracticeAnswer(''); setPracticeResult(null); }}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    {prevStep.title}
                  </button>
                ) : <div />}
                {nextStep ? (
                  <button
                    onClick={() => { setSelectedStep(nextStep); setActiveTab('learn'); setPracticeAnswer(''); setPracticeResult(null); }}
                    className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {nextStep.title}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : <div />}
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // ─── Concept Detail View (list of steps) ───────────
  if (selectedConcept) {
    const concept = selectedConcept;
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <button
            onClick={() => setSelectedConcept(null)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Learn
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="tag">{concept.branch}</Badge>
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">{concept.title}</h1>
          <p className="text-slate-500 max-w-2xl mb-6 leading-relaxed">{concept.description}</p>

          {/* Prerequisites */}
          {concept.prerequisites.length > 0 && (
            <div className="mb-6 lab-card p-4 border-primary-500/15 bg-primary-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-primary-400" />
                <span className="text-xs font-semibold text-primary-300">Prerequisites</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {concept.prerequisites.map(id => {
                  const c = conceptMap[id];
                  if (!c) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => { setSelectedConcept(c); setSelectedStep(null); }}
                      className="px-3 py-1.5 rounded-lg bg-lab-surface border border-lab-border text-xs text-slate-400 hover:border-primary-500/30 hover:text-slate-200 transition-all"
                    >
                      {c.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Where This Leads */}
          {concept.leadsTo.length > 0 && (
            <div className="mb-8 lab-card p-4 border-cyan-500/15 bg-cyan-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-300">Where This Leads</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {concept.leadsTo.map(id => {
                  const c = conceptMap[id];
                  if (!c) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => { setSelectedConcept(c); setSelectedStep(null); }}
                      className="px-3 py-1.5 rounded-lg bg-lab-surface border border-lab-border text-xs text-slate-400 hover:border-cyan-500/30 hover:text-slate-200 transition-all"
                    >
                      {c.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Progression steps */}
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Learning Progression</h3>
          <div className="space-y-3">
            {concept.steps.map((step, i) => {
              const color = DEPTH_COLORS[step.level];
              return (
                <button
                  key={step.id}
                  onClick={() => { setSelectedStep(step); setActiveTab('learn'); setPracticeAnswer(''); setPracticeResult(null); }}
                  className="lab-card p-5 text-left hover:border-primary-500/40 hover:bg-lab-hover transition-all group w-full"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0 font-bold text-${color}-400 text-sm`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{step.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>{step.level}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{step.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {step.formula && <span className="text-xs text-slate-600 flex items-center gap-1"><Calculator className="w-3 h-3" /> Formula</span>}
                        {step.challenge && <span className="text-xs text-slate-600 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Challenge</span>}
                        {step.proofNote && <span className="text-xs text-slate-600 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Proof</span>}
                        {step.relatedExperiment && <span className="text-xs text-slate-600 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Experiment</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  }

  // ─── Main Learn Homepage ───────────────────────────
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Mathematics · A Connected Journey</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Learn</h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Learn mathematics as a connected journey. Start with the mathematics you know, explore the ideas behind it, and keep going — from foundational concepts to university mathematics and beyond.
          </p>
        </div>

        {/* Visual progression chain */}
        <div className="mb-10 lab-card p-5 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {['Numbers', 'Algebra', 'Geometry', 'Functions', 'Calculus', 'Analysis', 'Algebraic Structures', 'Advanced Math'].map((label, i, arr) => {
              const conceptId = ['number-systems', 'algebra', 'geometry', 'functions', 'calculus', 'analysis', 'abstract-algebra', ''][i];
              const concept = conceptId ? conceptMap[conceptId] : null;
              return (
                <div key={label} className="flex items-center gap-2">
                  {concept ? (
                    <button
                      onClick={() => setSelectedConcept(concept)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-lab-surface border border-lab-border text-slate-400 hover:text-slate-200 hover:border-primary-500/30 transition-all whitespace-nowrap"
                    >
                      {label}
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-lab-surface border border-lab-border text-slate-600 whitespace-nowrap">
                      {label}
                    </span>
                  )}
                  {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-700 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Paths toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowPaths(!showPaths)}
            className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            <Route className="w-4 h-4" />
            {showPaths ? 'Hide' : 'Show'} Learning Paths
          </button>
          {showPaths && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {CONCEPT_PATHS.map(path => {
                const PathIcon = ICON_MAP[path.icon] || BookOpen;
                return (
                  <div key={path.id} className="lab-card p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-${path.color}-500/10 border border-${path.color}-500/20 flex items-center justify-center`}>
                        <PathIcon className={`w-4 h-4 text-${path.color}-400`} />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200">{path.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{path.subtitle}</p>
                    <div className="space-y-1">
                      {path.conceptIds.map((cid, i) => {
                        const c = conceptMap[cid];
                        if (!c) return null;
                        return (
                          <button
                            key={cid}
                            onClick={() => setSelectedConcept(c)}
                            className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-lab-hover transition-all"
                          >
                            <span className="font-mono text-slate-600">{i + 1}.</span>
                            <span>{c.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search concepts, formulas, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-lab-surface border border-lab-border text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500/40 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Filter className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-xs text-slate-600">Branch:</span>
          <button onClick={() => setBranchFilter('All')} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${branchFilter === 'All' ? 'bg-primary-500/15 border border-primary-500/30 text-primary-300' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}>All</button>
          {BRANCHES.map(b => (
            <button key={b.name} onClick={() => setBranchFilter(b.name)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${branchFilter === b.name ? 'bg-primary-500/15 border border-primary-500/30 text-primary-300' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}>
              {b.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Filter className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-xs text-slate-600">Level:</span>
          <button onClick={() => setDepthFilter('All')} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${depthFilter === 'All' ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}>All</button>
          {DEPTH_LEVELS.map(d => (
            <button key={d.level} onClick={() => setDepthFilter(d.level)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${depthFilter === d.level ? `bg-${d.color}-500/15 border border-${d.color}-500/30 text-${d.color}-300` : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}>
              {d.level}
            </button>
          ))}
        </div>

        {/* Concepts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConcepts.map(concept => {
            const ConceptIcon = ICON_MAP[concept.icon] || BookOpen;
            const levels = [...new Set(concept.steps.map(s => s.level))] as DepthLevel[];
            return (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept)}
                className="lab-card p-5 text-left hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-${concept.color}-500/10 border border-${concept.color}-500/20 flex items-center justify-center`}>
                    <ConceptIcon className={`w-5 h-5 text-${concept.color}-400`} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{concept.title}</h3>
                  <Badge variant="tag">{concept.branch}</Badge>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{concept.description}</p>
                {/* Depth indicators */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {levels.map(lvl => (
                    <span key={lvl} className={`text-xs px-2 py-0.5 rounded-full bg-${DEPTH_COLORS[lvl]}-500/10 text-${DEPTH_COLORS[lvl]}-400 border border-${DEPTH_COLORS[lvl]}-500/20`}>
                      {lvl}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Layers className="w-3 h-3" />
                  {concept.steps.length} steps
                </div>
              </button>
            );
          })}
        </div>

        {filteredConcepts.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p>No concepts match your search. Try different filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
