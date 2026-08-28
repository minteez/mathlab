import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Check, X, Lightbulb, Calculator, Globe, ArrowRight, Link2, Sparkles, Route, Layers } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import { LEARN_TOPICS, CLASS_LEVELS } from '@/data/learnTopics';
import { LEARNING_PATHS } from '@/data/learningPaths';
import type { LearnTopic } from '@/types';

export default function Learn() {
  const [classLevel, setClassLevel] = useState<number>(6);
  const [selectedTopic, setSelectedTopic] = useState<LearnTopic | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'visualize' | 'example' | 'practice' | 'explore'>('learn');
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [practiceResult, setPracticeResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showPaths, setShowPaths] = useState(false);

  const topics = LEARN_TOPICS.filter((t) => t.classLevel === classLevel);

  const topicMap = useMemo(() => {
    const map: Record<string, LearnTopic> = {};
    LEARN_TOPICS.forEach(t => { map[t.id] = t; });
    return map;
  }, []);

  const selectTopic = (topic: LearnTopic) => {
    setSelectedTopic(topic);
    setActiveTab('learn');
    setPracticeAnswer('');
    setPracticeResult(null);
  };

  const checkAnswer = () => {
    if (!selectedTopic) return;
    const correct = selectedTopic.challenge.answer.toString().toLowerCase().trim();
    const given = practiceAnswer.toString().toLowerCase().trim();
    setPracticeResult(given === correct ? 'correct' : 'incorrect');
  };

  if (selectedTopic) {
    const connectedTopics = (selectedTopic.connections || [])
      .map(id => topicMap[id])
      .filter(Boolean);

    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Class {classLevel}
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="tag">Class {selectedTopic.classLevel}</Badge>
            <Badge variant="branch" branch={selectedTopic.area as any}>{selectedTopic.area}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-6">{selectedTopic.title}</h1>

          {/* Prerequisites */}
          {selectedTopic.prerequisites && selectedTopic.prerequisites.length > 0 && (
            <div className="mb-6 lab-card p-4 border-primary-500/15 bg-primary-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-primary-400" />
                <span className="text-xs font-semibold text-primary-300">Builds On</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.prerequisites.map(prereqId => {
                  const prereq = topicMap[prereqId];
                  if (!prereq) return null;
                  return (
                    <button
                      key={prereqId}
                      onClick={() => selectTopic(prereq)}
                      className="px-3 py-1.5 rounded-lg bg-lab-surface border border-lab-border text-xs text-slate-400 hover:border-primary-500/30 hover:text-slate-200 transition-all"
                    >
                      {prereq.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 border-b border-lab-border mb-6 overflow-x-auto">
            {(['learn', 'visualize', 'example', 'practice', 'explore'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'learn' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Concept</h3>
                <p className="text-slate-400 leading-relaxed">{selectedTopic.concept}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary-300 mb-2 flex items-center gap-2"><Calculator className="w-4 h-4" /> Formula / Key Idea</h3>
                <div className="formula-box whitespace-pre-line">{selectedTopic.formula}</div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2"><Globe className="w-4 h-4" /> Real-World Connection</h3>
                <p className="text-slate-400 leading-relaxed">{selectedTopic.realWorld}</p>
              </div>
            </div>
          )}

          {activeTab === 'visualize' && (
            <div className="space-y-4">
              <p className="text-slate-400 leading-relaxed">{selectedTopic.concept}</p>
              <div className="lab-card p-6">
                <div className="formula-box text-center text-base whitespace-pre-line mb-4">{selectedTopic.formula}</div>
                <p className="text-sm text-slate-500 text-center">Interactive visualization for this concept is available in the related experiment below.</p>
              </div>
            </div>
          )}

          {activeTab === 'example' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2"><Calculator className="w-4 h-4" /> Worked Example</h3>
              <div className="lab-card p-5">
                <p className="text-slate-400 leading-relaxed font-mono text-sm">{selectedTopic.example}</p>
              </div>
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Challenge</h3>
              <div className="lab-card p-5 space-y-4">
                <p className="text-slate-300 leading-relaxed">{selectedTopic.challenge.question}</p>
                {selectedTopic.challenge.type === 'multiple-choice' && selectedTopic.challenge.options ? (
                  <div className="space-y-2">
                    {selectedTopic.challenge.options.map((opt) => (
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
                    <X className="w-4 h-4" /> Not quite. The answer is {selectedTopic.challenge.answer}. Try again!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-cyan-300 mb-2">Related Experiment</h3>
                <p className="text-slate-400 leading-relaxed mb-3">Take this concept further with an interactive experiment:</p>
                {selectedTopic.relatedExperiment ? (
                  <Link to={selectedTopic.relatedExperiment} className="lab-card p-5 hover:border-primary-500/40 hover:bg-lab-hover transition-all group flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-white">Open Experiment</div>
                      <div className="text-xs text-slate-500">Explore this concept interactively</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link to="/experiments" className="lab-card p-5 hover:border-primary-500/40 hover:bg-lab-hover transition-all group flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-white">Browse All Experiments</div>
                      <div className="text-xs text-slate-500">Find related interactive experiments</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              {/* Go Further */}
              {selectedTopic.goFurther && (
                <div className="lab-card p-5 border-cyan-500/20 bg-cyan-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-300">Go Further</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    <span className="text-slate-300 font-medium">{selectedTopic.goFurther.title}</span> — {selectedTopic.goFurther.description}
                  </p>
                  <p className="text-xs text-slate-500 italic mb-3">Curious about where this idea leads?</p>
                  {selectedTopic.goFurther.topicId && topicMap[selectedTopic.goFurther.topicId] && (
                    <button
                      onClick={() => selectTopic(topicMap[selectedTopic.goFurther!.topicId!])}
                      className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Explore: {topicMap[selectedTopic.goFurther.topicId].title}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  {selectedTopic.goFurther.experimentId && (
                    <Link
                      to={selectedTopic.goFurther.experimentId}
                      className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Try the experiment
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}

              {/* Connected Mathematics */}
              {connectedTopics.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-primary-300 mb-3 flex items-center gap-2"><Link2 className="w-4 h-4" /> Connected Mathematics</h3>
                  <p className="text-xs text-slate-500 mb-3">This concept connects to other areas of mathematics:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {connectedTopics.map(ct => (
                      <button
                        key={ct.id}
                        onClick={() => selectTopic(ct)}
                        className="lab-card p-3 text-left hover:border-primary-500/30 hover:bg-lab-hover transition-all group flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-200 group-hover:text-white">{ct.title}</div>
                          <div className="text-xs text-slate-500">Class {ct.classLevel} · {ct.area}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Mathematics · Classes 6–10</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Learn</h1>
          <p className="text-slate-500 max-w-2xl">
            Explore mathematics as one continuous journey from Class 6 to Class 10. Each topic connects to what comes before and reveals where it leads next.
          </p>
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
              {LEARNING_PATHS.map(path => (
                <div key={path.id} className="lab-card p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="branch" branch={path.color as any}>{path.title}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{path.subtitle}</p>
                  <div className="space-y-1">
                    {path.steps.map((step, i) => {
                      const topic = topicMap[step.topicId];
                      if (!topic) return null;
                      return (
                        <button
                          key={step.topicId}
                          onClick={() => { setClassLevel(step.classLevel); selectTopic(topic); }}
                          className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-lab-hover transition-all"
                        >
                          <span className="font-mono text-slate-600">{i + 1}.</span>
                          <span>{step.label}</span>
                          <span className="text-slate-700">· C{step.classLevel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Class selector */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {CLASS_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setClassLevel(level)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${classLevel === level ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : 'bg-lab-surface border border-lab-border text-slate-500 hover:text-slate-300'}`}
            >
              Class {level}
            </button>
          ))}
        </div>

        {/* Topics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => selectTopic(topic)}
              className="lab-card p-5 text-left hover:border-primary-500/40 hover:bg-lab-hover transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="branch" branch={topic.area as any}>{topic.area}</Badge>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">{topic.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{topic.concept}</p>
              {topic.goFurther && (
                <div className="flex items-center gap-1.5 text-xs text-cyan-500/70">
                  <Sparkles className="w-3 h-3" />
                  <span>Go further available</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p>Topics for Class {classLevel} are coming soon.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
