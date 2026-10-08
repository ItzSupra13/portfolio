"use client"
import { useState } from 'react';
import { useJournal } from '@/context/JournalContextRL';
import { X, Play, RotateCcw, Sparkles } from 'lucide-react';

const TRUE_MEANS = [0.2, 0.8, 1.5, -0.4, 1.1]; // 5 arms, Arm 2 is optimal with 1.5
const OPTIMAL_MEAN = 1.5;

export default function InteractiveBandit() {
  const { activeLab, setActiveLab } = useJournal();

  const [strategy, setStrategy] = useState<'egreedy' | 'ucb' | 'greedy'>('ucb');
  const [epsilon, setEpsilon] = useState(0.1);
  const [cParam, setCParam] = useState(2.0);
  const [totalSteps, setTotalSteps] = useState(0);

  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const [estimates, setEstimates] = useState<number[]>([0, 0, 0, 0, 0]);
  const [totalReward, setTotalReward] = useState(0);
  const [totalRegret, setTotalRegret] = useState(0);
  const [lastPulledArm, setLastPulledArm] = useState<number | null>(null);

  const pullArm = (armIdx: number) => {
    // True mean + normal noise (approx via Box-Muller)
    const u1 = Math.random() || 0.001;
    const u2 = Math.random() || 0.001;
    const noise = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const reward = TRUE_MEANS[armIdx] + noise;

    const newCounts = [...counts];
    newCounts[armIdx] += 1;
    const newEstimates = [...estimates];
    // Incremental sample average: Q_{n+1} = Q_n + (1/n) * (R - Q_n)
    newEstimates[armIdx] += (reward - newEstimates[armIdx]) / newCounts[armIdx];

    const regret = OPTIMAL_MEAN - TRUE_MEANS[armIdx];

    setCounts(newCounts);
    setEstimates(newEstimates);
    setTotalReward(prev => prev + reward);
    setTotalRegret(prev => prev + regret);
    setTotalSteps(prev => prev + 1);
    setLastPulledArm(armIdx);
  };

  const stepAgent = () => {
    let chosenArm = 0;
    const t = totalSteps + 1;

    if (strategy === 'greedy') {
      chosenArm = estimates.indexOf(Math.max(...estimates));
    } else if (strategy === 'egreedy') {
      if (Math.random() < epsilon) {
        chosenArm = Math.floor(Math.random() * 5);
      } else {
        chosenArm = estimates.indexOf(Math.max(...estimates));
      }
    } else if (strategy === 'ucb') {
      // If any arm count is 0, pull it first
      const unpulled = counts.findIndex(c => c === 0);
      if (unpulled !== -1) {
        chosenArm = unpulled;
      } else {
        let maxUcb = -Infinity;
        for (let a = 0; a < 5; a++) {
          const ucbVal = estimates[a] + cParam * Math.sqrt(Math.log(t) / counts[a]);
          if (ucbVal > maxUcb) {
            maxUcb = ucbVal;
            chosenArm = a;
          }
        }
      }
    }

    pullArm(chosenArm);
  };

  const runBatch = (n: number) => {
    for (let i = 0; i < n; i++) {
      stepAgent();
    }
  };

  const handleReset = () => {
    setCounts([0, 0, 0, 0, 0]);
    setEstimates([0, 0, 0, 0, 0]);
    setTotalReward(0);
    setTotalRegret(0);
    setTotalSteps(0);
    setLastPulledArm(null);
  };

  if (activeLab !== 'bandit') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl text-foreground overflow-hidden my-auto">
        {/* Lab Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold uppercase">
                Interactive RL Lab 02
              </span>
              <h3 className="font-editorial text-xl font-bold text-foreground">
                Multi-Armed Bandit Exploration Testbed
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Empirical exploration vs exploitation: compare ε-Greedy against Upper Confidence Bound (UCB1) regret curves.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveLab(null)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 5 Arms Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {TRUE_MEANS.map((trueMean, armIdx) => {
              const isPulled = lastPulledArm === armIdx;
              const isOptimal = trueMean === OPTIMAL_MEAN;
              return (
                <div
                  key={armIdx}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-between transition-all ${
                    isPulled
                      ? 'border-amber-500 bg-amber-500/10 shadow-md scale-102'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="w-full flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Arm {armIdx + 1}</span>
                    {isOptimal && <span className="text-emerald-600 dark:text-emerald-400 font-bold">Optimal</span>}
                  </div>

                  <div className="my-3 text-center">
                    <span className="text-xs text-muted-foreground block font-mono">Estimated Q̂</span>
                    <span className="text-2xl font-mono font-bold text-foreground tabular-nums">
                      {estimates[armIdx].toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-1 font-mono">
                      True μ = {trueMean.toFixed(1)}
                    </span>
                  </div>

                  <div className="w-full pt-2 border-t border-border text-center font-mono text-xs text-muted-foreground">
                    <span>{counts[armIdx]} pulls</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => pullArm(armIdx)}
                    className="w-full mt-3 py-1 text-[11px] font-mono rounded bg-muted hover:bg-muted/80 text-foreground cursor-pointer transition-colors"
                  >
                    Manual Pull
                  </button>
                </div>
              );
            })}
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border text-xs font-mono">
            <div>
              <span className="text-muted-foreground block uppercase text-[10px]">Total Steps</span>
              <span className="text-xl font-bold text-foreground">{totalSteps}</span>
            </div>
            <div>
              <span className="text-muted-foreground block uppercase text-[10px]">Accumulated Reward</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalReward.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block uppercase text-[10px]">Cumulative Regret</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{totalRegret.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block uppercase text-[10px]">Avg Reward / Step</span>
              <span className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {totalSteps > 0 ? (totalReward / totalSteps).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          {/* Strategy selector & Controls */}
          <div className="p-4 rounded-xl bg-card border border-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Policy:</span>
              <div className="flex items-center p-0.5 bg-muted/40 border border-border rounded-lg">
                <button
                  type="button"
                  onClick={() => setStrategy('ucb')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    strategy === 'ucb' ? 'bg-background text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  UCB1 (c={cParam})
                </button>
                <button
                  type="button"
                  onClick={() => setStrategy('egreedy')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    strategy === 'egreedy' ? 'bg-background text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  ε-Greedy (ε={epsilon})
                </button>
                <button
                  type="button"
                  onClick={() => setStrategy('greedy')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    strategy === 'greedy' ? 'bg-background text-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Greedy (ε=0)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={stepAgent}
                className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold cursor-pointer"
              >
                Step 1
              </button>
              <button
                type="button"
                onClick={() => runBatch(50)}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 cursor-pointer shadow-sm"
              >
                Run +50 Steps
              </button>
              <button
                type="button"
                onClick={() => runBatch(200)}
                className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 border border-border cursor-pointer"
              >
                Run +200 Steps
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
