import { useState, useCallback, useRef } from 'react';
import { Play, RotateCcw, DoorOpen, Info, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ExperimentLayout from '@/components/layout/ExperimentLayout';
import Button from '@/components/ui/Button';
import { EXPERIMENT_MAP } from '@/data/experiments';
import { formatPercent } from '@/utils/math';

const experiment = EXPERIMENT_MAP['monty-hall'];

type Phase = 'idle' | 'choosing' | 'revealed' | 'result';

interface SimResult {
  stayWins: number;
  switchWins: number;
  total: number;
}

function simulateOnce(switchDoor: boolean): boolean {
  const prizeDoor = Math.floor(Math.random() * 3);
  const choice = Math.floor(Math.random() * 3);
  let revealed: number;
  do {
    revealed = Math.floor(Math.random() * 3);
  } while (revealed === prizeDoor || revealed === choice);

  if (switchDoor) {
    let newChoice: number;
    do {
      newChoice = Math.floor(Math.random() * 3);
    } while (newChoice === choice || newChoice === revealed);
    return newChoice === prizeDoor;
  }
  return choice === prizeDoor;
}

function simulateMany(runs: number): SimResult {
  let stayWins = 0;
  let switchWins = 0;
  for (let i = 0; i < runs; i++) {
    if (simulateOnce(false)) stayWins++;
    if (simulateOnce(true)) switchWins++;
  }
  return { stayWins, switchWins, total: runs };
}

export default function MontyHall() {
  const [tab, setTab] = useState('experiment');
  const [phase, setPhase] = useState<Phase>('idle');
  const [doors, setDoors] = useState<number[]>([0, 1, 2]);
  const [prizeDoor, setPrizeDoor] = useState(-1);
  const [chosenDoor, setChosenDoor] = useState(-1);
  const [revealedDoor, setRevealedDoor] = useState(-1);
  const [switched, setSwitched] = useState(false);
  const [won, setWon] = useState(false);
  const [simResult, setSimResult] = useState<SimResult | null>(null);
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState(1000);
  const runRef = useRef(false);

  const startGame = () => {
    const prize = Math.floor(Math.random() * 3);
    setPrizeDoor(prize);
    setChosenDoor(-1);
    setRevealedDoor(-1);
    setSwitched(false);
    setWon(false);
    setPhase('choosing');
  };

  const chooseDoor = (door: number) => {
    setChosenDoor(door);
    let revealed: number;
    do {
      revealed = Math.floor(Math.random() * 3);
    } while (revealed === prizeDoor || revealed === door);
    setRevealedDoor(revealed);
    setPhase('revealed');
  };

  const finalChoice = (doSwitch: boolean) => {
    let finalDoor = chosenDoor;
    if (doSwitch) {
      for (let i = 0; i < 3; i++) {
        if (i !== chosenDoor && i !== revealedDoor) { finalDoor = i; break; }
      }
    }
    setSwitched(doSwitch);
    setWon(finalDoor === prizeDoor);
    setPhase('result');
  };

  const runSim = useCallback(async () => {
    setRunning(true);
    runRef.current = true;
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!runRef.current) { resolve(); return; }
        setSimResult(simulateMany(runs));
        resolve();
      }, 10);
    });
    setRunning(false);
  }, [runs]);

  const reset = () => {
    runRef.current = false;
    setSimResult(null);
    setRunning(false);
    setPhase('idle');
  };

  const TABS = [
    { id: 'experiment', label: 'Play' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'theory', label: 'Theory' },
  ];

  const stayRate = simResult ? simResult.stayWins / simResult.total : null;
  const switchRate = simResult ? simResult.switchWins / simResult.total : null;

  return (
    <Layout noFooter>
      <ExperimentLayout experiment={experiment} activeTab={tab} tabs={TABS} onTabChange={setTab}>
        {tab === 'experiment' && (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-5">
              <div className="lab-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">The Monty Hall Problem</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Behind one door is a car. Behind the other two, goats. Pick a door. The host (who knows what's behind each door) opens a different door revealing a goat. Now you can stay or switch. What should you do?
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {doors.map((door) => {
                    const isChosen = chosenDoor === door;
                    const isRevealed = revealedDoor === door;
                    const isPrize = prizeDoor === door;
                    const showGoat = isRevealed || (phase === 'result' && !isPrize);
                    const showCar = phase === 'result' && isPrize;
                    return (
                      <button
                        key={door}
                        onClick={() => phase === 'choosing' && chooseDoor(door)}
                        disabled={phase !== 'choosing'}
                        className={`aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                          isChosen && phase !== 'idle' ? 'border-primary-500 bg-primary-500/10' : 'border-lab-border bg-lab-surface'
                        } ${phase === 'choosing' ? 'hover:border-cyan-500/50 hover:bg-lab-hover cursor-pointer' : ''}`}
                      >
                        {phase === 'idle' && <DoorOpen className="w-8 h-8 text-slate-600" />}
                        {phase !== 'idle' && showCar && <span className="text-4xl">🚗</span>}
                        {phase !== 'idle' && showGoat && !showCar && <span className="text-4xl">🐐</span>}
                        {phase !== 'idle' && !showGoat && !showCar && (
                          <div className="text-center">
                            <DoorOpen className="w-8 h-8 text-slate-600 mx-auto" />
                            <span className="text-xs text-slate-600 mt-2 block">Door {door + 1}</span>
                          </div>
                        )}
                        {isChosen && phase !== 'idle' && (
                          <span className="absolute top-2 right-2 text-xs font-bold text-primary-400 bg-primary-500/20 px-2 py-0.5 rounded">YOUR PICK</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  {phase === 'idle' && (
                    <Button onClick={startGame} variant="primary" className="w-full">
                      <Play className="w-4 h-4" /> Start Game
                    </Button>
                  )}
                  {phase === 'choosing' && (
                    <p className="text-center text-sm text-cyan-300">Pick a door to open...</p>
                  )}
                  {phase === 'revealed' && (
                    <div className="space-y-3">
                      <p className="text-center text-sm text-amber-300">
                        Door {revealedDoor + 1} has a goat. Do you stay with door {chosenDoor + 1} or switch?
                      </p>
                      <div className="flex gap-3">
                        <Button onClick={() => finalChoice(false)} variant="secondary" className="flex-1">Stay</Button>
                        <Button onClick={() => finalChoice(true)} variant="primary" className="flex-1">Switch</Button>
                      </div>
                    </div>
                  )}
                  {phase === 'result' && (
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg border text-center ${won ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <p className={`text-lg font-bold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
                          {won ? 'You won the car!' : 'You got a goat!'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          You {switched ? 'switched' : 'stayed'} — {switched ? 'switching' : 'staying'} wins {switched ? '2/3' : '1/3'} of the time.
                        </p>
                      </div>
                      <Button onClick={startGame} variant="secondary" className="w-full">
                        <RotateCcw className="w-4 h-4" /> Play Again
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="lab-card p-5 border-amber-500/20 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">The Counterintuitive Truth</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Switching wins 2/3 of the time. Staying wins only 1/3. Most people think it's 50/50 after a goat is revealed — but the host's knowledge changes everything.
                </p>
              </div>

              <div className="lab-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">Quick Simulation</h3>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Simulations</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[100, 500, 1000, 10000].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setRuns(n); setSimResult(null); }}
                        className={`py-1.5 rounded text-xs font-mono font-medium transition-all ${
                          runs === n ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-500'
                        }`}
                      >
                        {n >= 1000 ? `${n / 1000}K` : n}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={runSim} loading={running} variant="primary" className="w-full" size="sm">
                  <Play className="w-3 h-3" /> Run {runs.toLocaleString()} Games
                </Button>
                {simResult && (
                  <div className="space-y-2 pt-2">
                    <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Stay win rate</span>
                      <span className="font-mono font-bold text-amber-400">{stayRate !== null ? formatPercent(stayRate) : '--'}</span>
                    </div>
                    <div className="bg-lab-surface rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Switch win rate</span>
                      <span className="font-mono font-bold text-cyan-400">{switchRate !== null ? formatPercent(switchRate) : '--'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <TrendingUp className="w-3 h-3" /> Switching is {(switchRate && stayRate ? ((switchRate / stayRate - 1) * 100).toFixed(0) : '--')}% better
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'simulation' && (
          <div className="max-w-3xl space-y-6">
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-cyan-300 mb-3">Run a Mass Simulation</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Play thousands of games automatically. The computer plays both strategies — always stay and always switch — and compares the results.
              </p>
              <div className="flex items-center gap-3 mb-4">
                {[100, 1000, 10000, 50000].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setRuns(n); setSimResult(null); }}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                      runs === n ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' : 'bg-lab-surface border border-lab-border text-slate-500'
                    }`}
                  >
                    {n >= 1000 ? `${n / 1000}K` : n}
                  </button>
                ))}
              </div>
              <Button onClick={runSim} loading={running} variant="primary">
                <Play className="w-4 h-4" /> Run Simulation
              </Button>
            </div>

            {simResult && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="lab-card p-6 text-center">
                  <div className="section-label mb-2">Always Stay</div>
                  <div className="text-4xl font-mono font-bold text-amber-400 mb-2">{stayRate !== null ? formatPercent(stayRate) : '--'}</div>
                  <div className="text-sm text-slate-500">{simResult.stayWins} wins / {simResult.total.toLocaleString()} games</div>
                  <div className="formula-box mt-3 text-xs">Expected: 33.3%</div>
                </div>
                <div className="lab-card p-6 text-center">
                  <div className="section-label mb-2">Always Switch</div>
                  <div className="text-4xl font-mono font-bold text-cyan-400 mb-2">{switchRate !== null ? formatPercent(switchRate) : '--'}</div>
                  <div className="text-sm text-slate-500">{simResult.switchWins} wins / {simResult.total.toLocaleString()} games</div>
                  <div className="formula-box mt-3 text-xs">Expected: 66.7%</div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'theory' && (
          <div className="max-w-3xl space-y-6">
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-cyan-300 mb-3">Why Switching Wins</h3>
              <p className="text-slate-400 leading-relaxed">
                When you pick a door, you have a 1/3 chance of being right and a 2/3 chance of being wrong. The host then reveals a goat behind a different door — but this does not change your original odds. If you were wrong (2/3 probability), the remaining door must have the car. Switching converts that 2/3 chance of being wrong into a 2/3 chance of winning.
              </p>
            </div>
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-primary-300 mb-3">The Three Cases</h3>
              <div className="space-y-3">
                {[
                  { scenario: 'You pick the car (1/3 chance)', result: 'Host reveals a goat. Switching → you get the other goat. Switching LOSES.' },
                  { scenario: 'You pick goat #1 (1/3 chance)', result: 'Host must reveal goat #2. Switching → you get the car. Switching WINS.' },
                  { scenario: 'You pick goat #2 (1/3 chance)', result: 'Host must reveal goat #1. Switching → you get the car. Switching WINS.' },
                ].map(({ scenario, result }) => (
                  <div key={scenario} className="bg-lab-surface rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-300">{scenario}</p>
                    <p className="text-xs text-slate-500 mt-1">{result}</p>
                  </div>
                ))}
              </div>
              <div className="formula-box mt-4 text-center">
                P(win by switching) = 2/3 ≈ 66.7%
              </div>
            </div>
            <div className="lab-card p-6">
              <h3 className="text-sm font-semibold text-amber-300 mb-3">The Host's Knowledge</h3>
              <p className="text-slate-400 leading-relaxed">
                The key is that the host knows where the car is and deliberately avoids revealing it. If the host opened a door at random and sometimes revealed the car, the odds would truly be 50/50. The host's constrained behavior is what transfers probability to the unchosen, unrevealed door.
              </p>
            </div>
          </div>
        )}
      </ExperimentLayout>
    </Layout>
  );
}
