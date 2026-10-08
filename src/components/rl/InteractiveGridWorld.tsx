"use client"
import { useState, useEffect, useCallback } from 'react';
import { useJournal } from '@/context/JournalContextRL';
import { X, Play, RotateCcw, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

type Action = 0 | 1 | 2 | 3; // 0: Up, 1: Right, 2: Down, 3: Left
const ACTIONS: { name: string; arrow: string; dr: number; dc: number }[] = [
  { name: 'Up', arrow: '↑', dr: -1, dc: 0 },
  { name: 'Right', arrow: '→', dr: 0, dc: 1 },
  { name: 'Down', arrow: '↓', dr: 1, dc: 0 },
  { name: 'Left', arrow: '←', dr: 0, dc: -1 },
];

export default function InteractiveGridworld() {
  const { activeLab, setActiveLab } = useJournal();

  const [gamma, setGamma] = useState(0.9);
  const [stepReward, setStepReward] = useState(-0.1);
  const [noise, setNoise] = useState(0.1); // slip probability
  const [values, setValues] = useState<number[][]>(() => 
    Array(4).fill(0).map(() => Array(4).fill(0))
  );
  const [iteration, setIteration] = useState(0);
  const [maxDelta, setMaxDelta] = useState<number | null>(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>({ r: 0, c: 0 });

  const isWall = (r: number, c: number) => r === 1 && c === 1;
  const isGoal = (r: number, c: number) => r === 3 && c === 3;
  const isTrap = (r: number, c: number) => r === 1 && c === 2;

  // Bellman backup iteration
  const stepBellman = useCallback(() => {
    let delta = 0;
    const newValues = values.map(row => [...row]);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (isWall(r, c) || isGoal(r, c) || isTrap(r, c)) continue;

        let maxQ = -Infinity;

        // For each action, compute Q(s, a)
        for (let aIdx = 0; aIdx < 4; aIdx++) {
          const intended = ACTIONS[aIdx];
          const leftSlip = ACTIONS[(aIdx + 3) % 4];
          const rightSlip = ACTIONS[(aIdx + 1) % 4];

          const outcomes = [
            { prob: 1 - noise, action: intended },
            { prob: noise / 2, action: leftSlip },
            { prob: noise / 2, action: rightSlip },
          ];

          let expectedReturn = 0;
          for (const outcome of outcomes) {
            let nextR = Math.min(3, Math.max(0, r + outcome.action.dr));
            let nextC = Math.min(3, Math.max(0, c + outcome.action.dc));

            // If hits wall, bounce back
            if (isWall(nextR, nextC)) {
              nextR = r;
              nextC = c;
            }

            let reward = stepReward;
            let nextVal = values[nextR][nextC];

            if (isGoal(nextR, nextC)) {
              reward = 10.0;
              nextVal = 0; // terminal
            } else if (isTrap(nextR, nextC)) {
              reward = -10.0;
              nextVal = 0; // terminal
            }

            expectedReturn += outcome.prob * (reward + gamma * nextVal);
          }

          if (expectedReturn > maxQ) {
            maxQ = expectedReturn;
          }
        }

        delta = Math.max(delta, Math.abs(newValues[r][c] - maxQ));
        newValues[r][c] = maxQ;
      }
    }

    setValues(newValues);
    setIteration(prev => prev + 1);
    setMaxDelta(delta);
    return delta;
  }, [values, gamma, stepReward, noise]);

  // Auto running loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoRunning) {
      timer = setTimeout(() => {
        const d = stepBellman();
        if (d < 0.001 || iteration >= 100) {
          setIsAutoRunning(false);
        }
      }, 120);
    }
    return () => clearTimeout(timer);
  }, [isAutoRunning, stepBellman, iteration]);

  const handleReset = () => {
    setIsAutoRunning(false);
    setValues(Array(4).fill(0).map(() => Array(4).fill(0)));
    setIteration(0);
    setMaxDelta(null);
  };

  // Get best action arrow for cell
  const getBestAction = (r: number, c: number) => {
    if (isWall(r, c)) return 'WALL';
    if (isGoal(r, c)) return 'GOAL';
    if (isTrap(r, c)) return 'TRAP';

    let bestAction = ACTIONS[0];
    let maxQ = -Infinity;

    for (let aIdx = 0; aIdx < 4; aIdx++) {
      const intended = ACTIONS[aIdx];
      const leftSlip = ACTIONS[(aIdx + 3) % 4];
      const rightSlip = ACTIONS[(aIdx + 1) % 4];

      const outcomes = [
        { prob: 1 - noise, action: intended },
        { prob: noise / 2, action: leftSlip },
        { prob: noise / 2, action: rightSlip },
      ];

      let expectedReturn = 0;
      for (const outcome of outcomes) {
        let nextR = Math.min(3, Math.max(0, r + outcome.action.dr));
        let nextC = Math.min(3, Math.max(0, c + outcome.action.dc));
        if (isWall(nextR, nextC)) {
          nextR = r;
          nextC = c;
        }

        let reward = stepReward;
        let nextVal = values[nextR][nextC];
        if (isGoal(nextR, nextC)) {
          reward = 10.0;
          nextVal = 0;
        } else if (isTrap(nextR, nextC)) {
          reward = -10.0;
          nextVal = 0;
        }
        expectedReturn += outcome.prob * (reward + gamma * nextVal);
      }

      if (expectedReturn > maxQ) {
        maxQ = expectedReturn;
        bestAction = intended;
      }
    }

    return bestAction.arrow;
  };

  // Compute Q-values for inspected cell
  const getSelectedQValues = () => {
    if (!selectedCell || isWall(selectedCell.r, selectedCell.c) || isGoal(selectedCell.r, selectedCell.c) || isTrap(selectedCell.r, selectedCell.c)) {
      return null;
    }
    const { r, c } = selectedCell;
    const qList: { name: string; arrow: string; q: number }[] = [];

    for (let aIdx = 0; aIdx < 4; aIdx++) {
      const intended = ACTIONS[aIdx];
      const leftSlip = ACTIONS[(aIdx + 3) % 4];
      const rightSlip = ACTIONS[(aIdx + 1) % 4];

      const outcomes = [
        { prob: 1 - noise, action: intended },
        { prob: noise / 2, action: leftSlip },
        { prob: noise / 2, action: rightSlip },
      ];

      let expectedReturn = 0;
      for (const outcome of outcomes) {
        let nextR = Math.min(3, Math.max(0, r + outcome.action.dr));
        let nextC = Math.min(3, Math.max(0, c + outcome.action.dc));
        if (isWall(nextR, nextC)) {
          nextR = r;
          nextC = c;
        }

        let reward = stepReward;
        let nextVal = values[nextR][nextC];
        if (isGoal(nextR, nextC)) {
          reward = 10.0;
          nextVal = 0;
        } else if (isTrap(nextR, nextC)) {
          reward = -10.0;
          nextVal = 0;
        }
        expectedReturn += outcome.prob * (reward + gamma * nextVal);
      }
      qList.push({ name: intended.name, arrow: intended.arrow, q: expectedReturn });
    }
    return qList;
  };

  if (activeLab !== 'gridworld') return null;

  const inspectedQ = getSelectedQValues();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl text-foreground overflow-hidden my-auto">
        {/* Lab Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                Interactive RL Lab 01
              </span>
              <h3 className="font-editorial text-xl font-bold text-foreground">
                GridWorld Bellman Value Iteration
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Watch state values V(s) and greedy policy arrows π*(s) converge via dynamic programming contraction mapping.
            </p>
          </div>

          <button
            type="button"
            onClick={() => { setIsAutoRunning(false); setActiveLab(null); }}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lab Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 4x4 GridWorld Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-muted/20 p-6 rounded-xl border border-border">
            <div className="grid grid-cols-4 gap-2.5 w-full max-w-md aspect-square">
              {values.map((row, r) =>
                row.map((val, c) => {
                  const wall = isWall(r, c);
                  const goal = isGoal(r, c);
                  const trap = isTrap(r, c);
                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const arrow = getBestAction(r, c);

                  let cellStyle = 'bg-card border-border text-foreground';
                  if (wall) cellStyle = 'bg-muted/80 border-border text-muted-foreground cursor-not-allowed';
                  else if (goal) cellStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-bold';
                  else if (trap) cellStyle = 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-300 font-bold';
                  else if (val > 0) cellStyle = 'bg-emerald-500/10 border-emerald-500/40 text-foreground';
                  else if (val < 0) cellStyle = 'bg-red-500/10 border-red-500/40 text-foreground';

                  if (isSelected && !wall) {
                    cellStyle += ' ring-2 ring-emerald-500 shadow-md';
                  }

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => !wall && setSelectedCell({ r, c })}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer font-mono select-none ${cellStyle}`}
                    >
                      {/* State Coordinate */}
                      <span className="absolute top-1.5 left-2 text-[10px] text-muted-foreground">
                        ({r},{c})
                      </span>

                      {/* Cell Content */}
                      {wall ? (
                        <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground">WALL</span>
                      ) : goal ? (
                        <div className="text-center">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">+10 GOAL</span>
                          <span className="text-[10px] text-muted-foreground">Terminal</span>
                        </div>
                      ) : trap ? (
                        <div className="text-center">
                          <span className="text-xs font-bold text-red-600 dark:text-red-400 block">-10 TRAP</span>
                          <span className="text-[10px] text-muted-foreground">Terminal</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-lg font-bold text-foreground">
                            {arrow}
                          </span>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {val.toFixed(2)}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Iteration metrics readout */}
            <div className="w-full max-w-md mt-4 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <div>
                <span>Iteration: </span>
                <span className="font-bold text-foreground">{iteration}</span>
              </div>
              <div>
                <span>Max Delta (Δ): </span>
                <span className={`font-bold tabular-nums ${maxDelta !== null && maxDelta < 0.001 ? 'text-emerald-500' : 'text-foreground'}`}>
                  {maxDelta !== null ? maxDelta.toFixed(4) : '0.0000'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Controls & Inspector */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            {/* Interactive Parameters */}
            <div className="space-y-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
              <span className="font-mono text-emerald-400 uppercase tracking-wider font-semibold block">
                MDP Hyperparameters
              </span>

              {/* Gamma */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Discount Factor (γ)</span>
                  <span className="font-mono text-emerald-400 font-bold">{gamma.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={gamma}
                  onChange={(e) => setGamma(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Step Reward */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Step Penalty Reward (R_step)</span>
                  <span className="font-mono text-emerald-400 font-bold">{stepReward.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1.0"
                  max="0.0"
                  step="0.05"
                  value={stepReward}
                  onChange={(e) => setStepReward(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Stochastic noise */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Stochastic Slip Noise</span>
                  <span className="font-mono text-emerald-400 font-bold">{(noise * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.4"
                  step="0.05"
                  value={noise}
                  onChange={(e) => setNoise(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={stepBellman}
                className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>1 Backup Step</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAutoRunning(!isAutoRunning)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  isAutoRunning
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isAutoRunning ? 'Pause Loop' : 'Iterate to Convergence'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-neutral-400 hover:text-neutral-200 rounded-lg text-xs cursor-pointer"
                title="Reset values to 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inspected State Q-Values */}
            {selectedCell && inspectedQ && (
              <div className="bg-muted/30 p-4 rounded-xl border border-border text-xs font-mono">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span>Inspecting State ({selectedCell.r}, {selectedCell.c})</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">V = {values[selectedCell.r][selectedCell.c].toFixed(3)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {inspectedQ.map((qItem) => (
                    <div key={qItem.name} className="p-2 bg-card rounded border border-border flex items-center justify-between">
                      <span className="text-foreground">{qItem.arrow} {qItem.name}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{qItem.q.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
