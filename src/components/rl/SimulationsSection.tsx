"use client"
import { useJournal } from '@/context/JournalContextRL';
import { 
  FlaskConical, 
  SlidersHorizontal, 
  Maximize2, 
  Zap
} from 'lucide-react';

export default function SimulationsSection(){
  const { setActiveLab } = useJournal();

  return (
    <div className="space-y-8 relative">
      <span className="ch ch-tl hidden md:block" />
      <span className="ch ch-tr hidden md:block" />

      {/* Header */}
      <div className="pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Interactive RL Simulators
          </span>
          <span aria-hidden="true" className="text-muted-foreground opacity-40">/</span>
          <span className="text-xs font-mono text-foreground">Mathematical Dynamic Programming & Exploration</span>
        </div>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground mt-1">
          Interactive Algorithmic Laboratories
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl font-light">
          Verify theoretical proofs with live computation. Run contraction mapping updates and observe regret curves step-by-step.
        </p>
      </div>

      {/* Two Interactive Lab Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab 01: GridWorld Bellman Solver */}
        <div className="p-6 rounded-xl border border-border/80 bg-card flex flex-col justify-between space-y-5 hover:border-border transition-all shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                Lab 01 · Dynamic Programming
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-xl font-bold text-foreground">
                GridWorld Bellman Value Iteration
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1.5 font-mono">
                Simulate state-value Bellman updates V*(s) = max_a [ R(s,a) + γ ∑ P(s'|s,a) V(s') ] on a stochastic 4x4 Markov Decision Process.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Live contraction factor $\gamma \in [0.5, 0.99]$</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Adjustable transition slip noise & step penalties</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Directional arrows showing optimal policy $\pi^*(s)$</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveLab('gridworld')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-background font-mono text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Launch GridWorld Solver Lab &rarr;</span>
          </button>
        </div>

        {/* Lab 02: Multi-Armed Bandit Testbed */}
        <div className="p-6 rounded-xl border border-border/80 bg-card flex flex-col justify-between space-y-5 hover:border-border transition-all shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                Lab 02 · Exploration vs Exploitation
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-xl font-bold text-foreground">
                Multi-Armed Bandit Testbed
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1.5">
                Empirically evaluate regret bounds across 5 stationary Gaussian slot arms. Compare Upper Confidence Bound (UCB1) against $\epsilon$-greedy and pure greedy.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>UCB1 exploration bonus: c · √(ln(t) / N(a))</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Single step and batch runs (+50, +200 pulls)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Real-time cumulative regret scoreboard</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveLab('bandit')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-background font-mono text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Launch Bandit Testbed &rarr;</span>
          </button>
        </div>
      </div>

      {/* Educational grounding note */}
      <div className="p-5 rounded-lg border border-border/60 bg-muted/10 font-mono text-xs text-muted-foreground space-y-1.5">
        <div className="font-bold text-foreground uppercase tracking-wider text-[11px]">
          Theoretical Note on Simulations
        </div>
        <p className="font-sans font-light leading-relaxed">
          These interactive visualizers run directly in WebAssembly/TypeScript in your browser. They correspond to the foundational theory documented in Days 01–20 of this research notebook, illustrating the exact mathematical dynamics of the Bellman expectation operator and logarithmic Lai-Robbins regret bounds.
        </p>
      </div>
    </div>
  );
};
 