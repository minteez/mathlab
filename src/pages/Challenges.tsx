import { useState } from 'react';
import { Trophy, Lightbulb, Check, X, ChevronRight, RotateCcw, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CHALLENGES } from '@/data/challenges';
import { getScores, saveScore } from '@/utils/storage';
import type { Challenge } from '@/types';

export default function Challenges() {
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Record<string, number>>(getScores());

  const challenge: Challenge = CHALLENGES[current];
  const total = CHALLENGES.length;
  const solvedCount = solved.size;

  const checkAnswer = () => {
    const expected = String(challenge.answer).trim();
    const given = userAnswer.trim();
    const correct = challenge.type === 'numeric'
      ? Math.abs(parseFloat(given) - (challenge.answer as number)) < 0.01
      : given.toLowerCase() === expected.toLowerCase();
    setResult(correct ? 'correct' : 'wrong');
    if (correct) {
      const newSolved = new Set(solved);
      newSolved.add(challenge.id);
      setSolved(newSolved);
      saveScore(challenge.id, 1);
      setScores(getScores());
    }
  };

  const next = () => {
    setCurrent((c) => (c + 1) % total);
    setUserAnswer('');
    setShowHint(false);
    setResult(null);
  };

  const reset = () => {
    setCurrent(0);
    setUserAnswer('');
    setShowHint(false);
    setResult(null);
    setSolved(new Set());
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="section-label mb-3">Test Your Reasoning</div>
          <h1 className="text-4xl font-bold text-slate-100 mb-3">Mathematical Challenges</h1>
          <p className="text-slate-500 max-w-2xl">
            Work through interactive challenges across algebra, geometry, probability, number theory, and more. Make a prediction, check your answer, and learn from the explanation.
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-2 bg-lab-surface rounded-full overflow-hidden border border-lab-border">
            <div className="h-full bg-gradient-to-r from-primary-600 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${(solvedCount / total) * 100}%` }} />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-mono">{solvedCount}/{total}</span>
          </div>
        </div>

        {/* Challenge card */}
        <div className="lab-card p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="branch" branch={challenge.branch}>{challenge.branch}</Badge>
                <Badge variant="difficulty" difficulty={challenge.difficulty}>{challenge.difficulty}</Badge>
                {solved.has(challenge.id) && <Badge variant="new">Solved</Badge>}
              </div>
              <h2 className="text-xl font-bold text-slate-100">{challenge.title}</h2>
            </div>
            <div className="text-sm text-slate-600 font-mono flex-shrink-0">{current + 1} / {total}</div>
          </div>

          <p className="text-slate-300 text-lg leading-relaxed">{challenge.problem}</p>

          {/* Multiple choice options */}
          {challenge.type === 'multiple-choice' && challenge.options && (
            <div className="grid sm:grid-cols-2 gap-2">
              {challenge.options.map((opt) => {
                const selected = userAnswer === opt;
                const isCorrect = result && opt === String(challenge.answer);
                const isWrong = result === 'wrong' && selected && opt !== String(challenge.answer);
                return (
                  <button
                    key={opt}
                    onClick={() => !result && setUserAnswer(opt)}
                    disabled={!!result}
                    className={`px-4 py-3 rounded-lg border text-left font-mono text-sm transition-all ${
                      isCorrect ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' :
                      isWrong ? 'bg-red-500/15 border-red-500/40 text-red-300' :
                      selected ? 'bg-primary-500/15 border-primary-500/40 text-primary-300' :
                      'bg-lab-surface border-lab-border text-slate-400 hover:text-slate-200 hover:border-primary-500/30'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Numeric input */}
          {challenge.type === 'numeric' && (
            <div className="flex gap-2">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !result && userAnswer && checkAnswer()}
                placeholder="Enter your answer..."
                disabled={!!result}
                className="lab-input flex-1"
              />
              <Button onClick={checkAnswer} disabled={!userAnswer || !!result}>Check</Button>
            </div>
          )}

          {/* Hint */}
          {showHint && !result && (
            <div className="flex gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200/80 leading-relaxed">{challenge.hint}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`p-5 rounded-lg border ${result === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-2 mb-3">
                {result === 'correct' ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-red-400" />}
                <span className={`font-semibold ${result === 'correct' ? 'text-emerald-300' : 'text-red-300'}`}>
                  {result === 'correct' ? 'Correct!' : 'Not quite.'}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-2">
                <span className="text-slate-500">Answer: </span>
                <span className="font-mono text-cyan-300">{String(challenge.answer)}</span>
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">{challenge.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-lab-border">
            {!result ? (
              <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)}>
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button onClick={next} size="sm">
                Next Challenge
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Challenge list */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">All Challenges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CHALLENGES.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => { setCurrent(i); setUserAnswer(''); setShowHint(false); setResult(null); }}
                className={`px-3 py-2 rounded-lg border text-xs font-mono transition-all ${
                  i === current ? 'bg-primary-500/15 border-primary-500/40 text-primary-300' :
                  solved.has(ch.id) ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' :
                  'bg-lab-surface border-lab-border text-slate-500 hover:text-slate-300'
                }`}
              >
                {solved.has(ch.id) && <Check className="w-3 h-3 inline mr-1" />}
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {solvedCount === total && (
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/25 text-center">
            <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-100">All Challenges Solved!</h3>
            <p className="text-slate-400 text-sm mt-1">You have demonstrated mathematical reasoning across every branch.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
