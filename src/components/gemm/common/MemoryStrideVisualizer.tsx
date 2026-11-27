import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const MemoryStrideVisualizer: React.FC = () => {
  const [stepK, setStepK] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const N = 4; // 4x4 matrix demo (16 elements total)
  const rowA = 1; // Inspect row 1 for Matrix A
  const colB = 1; // Inspect col 1 for Matrix B

  // Auto-play interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStepK((prev) => (prev + 1) % N);
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, N]);

  // Addresses accessed at stepK
  // Matrix A: A[row * K + k] -> rowA * 4 + k (e.g. 1*4 + k = 4, 5, 6, 7)
  const addrA = rowA * N + stepK;
  // Matrix B: B[k * N + col] -> k * 4 + colB (e.g. 0*4+1=1, 1*4+1=5, 2*4+1=9, 3*4+1=13)
  const addrB = stepK * N + colB;

  // Cache line ID (assuming 1 cache line = 4 consecutive floats = 16 bytes for this demo)
  const lineA = Math.floor(addrA / N);
  const lineB = Math.floor(addrB / N);

  // Cache hit or miss status
  // Matrix A: k=0 loads cache line 1 (addr 4..7) -> MISS. k=1,2,3 are HITS because line 1 is already in L1!
  const isHitA = stepK > 0;

  // Cumulative metrics up to current step
  const missesA = 1; // Only k=0 misses
  const hitsA = stepK;
  const missesB = stepK + 1; // Every step misses
  const hitsB = 0;

  return (
    <div id="cache-access-animation-slot" className="my-8 rounded-xl border border-border/80 bg-card/40 p-5 sm:p-7 shadow-xs transition-all font-serif">
      {/* Editorial Header */}
      <div className="pb-3 mb-5 border-b border-border/70">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground font-sans tracking-tight">
          Here's a small visualization between Stride-1 vs. Stride-N
        </h3>
      </div>

      {/* Stepper & Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-lg bg-background/80 border border-border/70 mb-6 text-sm font-mono">
        <div className="flex items-center gap-2.5">
          <span className="text-muted-foreground font-sans text-sm">Inner loop iteration:</span>
          <span className="text-foreground font-bold px-2 py-0.5 rounded bg-muted/60 border border-border text-sm">
            k = {stepK}
          </span>
          <span className="text-muted-foreground text-xs hidden sm:inline font-sans">(range: k = 0 … 3)</span>
        </div>

        {/* Quick Stepper Pills */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => {
                setStepK(step);
                setIsPlaying(false);
              }}
              className={`px-2.5 py-1 rounded text-xs sm:text-sm font-mono transition-all cursor-pointer ${
                stepK === step
                  ? 'bg-foreground text-background shadow-xs font-bold'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
              }`}
            >
              k = {step}
            </button>
          ))}
        </div>

        {/* Play/Pause & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors font-medium text-xs sm:text-sm cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto-Step</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setStepK(0);
              setIsPlaying(false);
            }}
            className="p-1.5 rounded bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Reset to k=0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Main Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ========================================================= */}
        {/* PANEL A: Matrix A (Row-Major Contiguous Stride 1)        */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
            <div className="space-y-0.5">
              <span className="text-sm font-sans font-bold text-emerald-500 tracking-wide">
                Matrix A: Contiguous Stride 1
              </span>
              <div className="text-xs sm:text-sm font-mono text-foreground/90 font-medium">
                A[row={rowA}, k={stepK}] = addr #{addrA}
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1.5 self-start sm:self-auto ${
              isHitA ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
            }`}>
              {isHitA ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>L1 CACHE HIT (1 cycle)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>LINE MISS (Fetch Line {lineA})</span>
                </>
              )}
            </div>
          </div>

          {/* 2D Matrix Logical View */}
          <div>
            <div className="text-xs sm:text-sm font-sans text-muted-foreground mb-2 flex items-center justify-between">
              <span>Row {rowA} being read</span>
              <span className="text-emerald-500 font-mono text-xs font-semibold">Row sweep</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-background border border-border/80">
              {Array.from({ length: 16 }).map((_, idx) => {
                const r = Math.floor(idx / N);
                const c = idx % N;
                const isTargetRow = r === rowA;
                const isCurrentCell = idx === addrA;
                const isAlreadyLoaded = isTargetRow && c <= stepK;

                return (
                  <div
                    key={idx}
                    className={`h-12 rounded flex flex-col items-center justify-center text-xs font-mono transition-all border ${
                      isCurrentCell
                        ? 'bg-emerald-500/25 border-emerald-500 text-emerald-400 font-bold shadow-xs scale-102 ring-1 ring-emerald-500'
                        : isAlreadyLoaded
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500/90'
                        : isTargetRow
                        ? 'bg-muted/40 border-border text-foreground/80'
                        : 'bg-muted/15 border-border/40 text-muted-foreground/40'
                    }`}
                  >
                    <span className="text-[11px] opacity-75">A[{r},{c}]</span>
                    <span className="font-bold text-xs">#{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1D Physical Memory Layout & Cache Lines */}
          <div>
            <div className="text-xs sm:text-sm font-sans text-muted-foreground mb-2 flex items-center justify-between">
              <span>How 4-element Cache Lines Look</span>
              <span className="text-foreground font-mono text-xs font-semibold">Active: Line {lineA}</span>
            </div>

            {/* 4 Cache Lines grouped horizontally */}
            <div className="space-y-1.5">
              {[0, 1, 2, 3].map((lineIdx) => {
                const isLineActive = lineIdx === lineA;
                return (
                  <div
                    key={lineIdx}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isLineActive
                        ? 'bg-emerald-500/5 border-emerald-500/50 ring-1 ring-emerald-500/30'
                        : 'bg-background/60 border-border/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between px-1 mb-1 text-xs font-mono">
                      <span className={isLineActive ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}>
                        CL{lineIdx}
                      </span>
                      {isLineActive && (
                        <span className="text-emerald-500 font-semibold text-xs">
                          {stepK + 1}/4 elements used ({((stepK + 1) / 4) * 100}%)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1">
                      {[0, 1, 2, 3].map((offset) => {
                        const elementAddr = lineIdx * 4 + offset;
                        const isCurrent = elementAddr === addrA;
                        const isConsumed = lineIdx === lineA && offset <= stepK;

                        return (
                          <div
                            key={offset}
                            className={`py-1 text-center rounded text-xs font-mono transition-all border ${
                              isCurrent
                                ? 'bg-emerald-500 text-white font-bold border-emerald-400 shadow-xs'
                                : isConsumed
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-muted/30 text-muted-foreground border-border/40'
                            }`}
                          >
                            addr {elementAddr}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Metric Pill */}
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs sm:text-sm font-mono flex items-center justify-between">
            <span className="text-muted-foreground font-sans">Stride-1 Efficiency:</span>
            <span className="text-emerald-500 font-bold">
              {missesA} Miss, {hitsA} Hits = Hit Rate: {Math.round((hitsA / (stepK + 1)) * 100)}%
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PANEL B: Matrix B (Column-Strided Stride N)               */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 rounded-xl bg-card border border-destructive/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
            <div className="space-y-0.5">
              <span className="text-sm font-sans font-bold text-destructive tracking-wide">
                Matrix B: Strided Access by N
              </span>
              <div className="text-xs sm:text-sm font-mono text-foreground/90 font-medium">
                B[k={stepK}, col={colB}] = addr #{addrB}
              </div>
            </div>
            <div className="px-2.5 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1.5 bg-destructive/15 text-destructive border border-destructive/30 self-start sm:self-auto">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              <span>CACHE MISS (Evicts &amp; Reloads)</span>
            </div>
          </div>

          {/* 2D Matrix Logical View */}
          <div>
            <div className="text-xs sm:text-sm font-sans text-muted-foreground mb-2 flex items-center justify-between">
              <span>Column {colB} being read</span>
              <span className="text-destructive font-mono text-xs font-semibold">Row jump</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-background border border-border/80">
              {Array.from({ length: 16 }).map((_, idx) => {
                const r = Math.floor(idx / N);
                const c = idx % N;
                const isTargetCol = c === colB;
                const isCurrentCell = idx === addrB;
                const isPriorCell = isTargetCol && r < stepK;

                return (
                  <div
                    key={idx}
                    className={`h-12 rounded flex flex-col items-center justify-center text-xs font-mono transition-all border ${
                      isCurrentCell
                        ? 'bg-destructive/25 border-destructive text-destructive font-bold shadow-xs scale-102 ring-1 ring-destructive'
                        : isPriorCell
                        ? 'bg-destructive/10 border-destructive/30 text-destructive/70 line-through'
                        : isTargetCol
                        ? 'bg-muted/40 border-border text-foreground/80'
                        : 'bg-muted/15 border-border/40 text-muted-foreground/40'
                    }`}
                  >
                    <span className="text-[11px] opacity-75">B[{r},{c}]</span>
                    <span className="font-bold text-xs">#{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1D Physical Memory Layout & Cache Lines */}
          <div>
            <div className="text-xs sm:text-sm font-sans text-muted-foreground mb-2 flex items-center justify-between">
              <span>How 4-element Cache Lines Look</span>
              <span className="text-destructive font-mono text-xs font-semibold">Active: Line {lineB}</span>
            </div>

            {/* 4 Cache Lines grouped horizontally */}
            <div className="space-y-1.5">
              {[0, 1, 2, 3].map((lineIdx) => {
                const isLineActive = lineIdx === lineB;
                const hasBeenEvicted = lineIdx < lineB;

                return (
                  <div
                    key={lineIdx}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isLineActive
                        ? 'bg-destructive/5 border-destructive/50 ring-1 ring-destructive/30'
                        : hasBeenEvicted
                        ? 'bg-background/40 border-border/40 opacity-50'
                        : 'bg-background/60 border-border/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between px-1 mb-1 text-xs font-mono">
                      <span className={isLineActive ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                        CL{lineIdx}
                      </span>
                      {isLineActive ? (
                        <span className="text-destructive font-semibold text-xs">
                          75% bandwidth wasted!
                        </span>
                      ) : hasBeenEvicted ? (
                        <span className="text-muted-foreground italic text-xs">
                          Evicted with 3 unused floats
                        </span>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-4 gap-1">
                      {[0, 1, 2, 3].map((offset) => {
                        const elementAddr = lineIdx * 4 + offset;
                        const isCurrent = elementAddr === addrB;
                        const wasUsedInPast = hasBeenEvicted && offset === colB;

                        return (
                          <div
                            key={offset}
                            className={`py-1 text-center rounded text-xs font-mono transition-all border ${
                              isCurrent
                                ? 'bg-destructive text-white font-bold border-destructive shadow-xs'
                                : wasUsedInPast
                                ? 'bg-destructive/20 text-destructive/80 border-destructive/30 line-through'
                                : isLineActive
                                ? 'bg-amber-500/10 text-amber-500/70 border-amber-500/20'
                                : 'bg-muted/30 text-muted-foreground border-border/40'
                            }`}
                          >
                            addr {elementAddr}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Metric Pill */}
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-xs sm:text-sm font-mono flex items-center justify-between">
            <span className="text-muted-foreground font-sans">Stride-N Penalty:</span>
            <span className="text-destructive font-bold">
              {missesB} Misses, {hitsB} Hits = Hit Rate: 0%
            </span>
          </div>
        </div>

      </div>

      {/* Editorial Takeaway Bar below Animation */}
      <div className="mt-6 pt-4 border-t border-border/60 text-[17px] sm:text-[19px] font-serif text-muted-foreground leading-[1.75] tracking-[-0.01em]">
        <p>
          In later discussions we will realize that algorithmic advancements can only go as much. It's not like we can suddenly find a algorithm with way better Time Complexity immediately. But what we do have at our side is the chip itself. Our end goal would be to use these tiny exploits (or more like using what each chip already provides us in these chips with even faster memory throughput but were just unaware of) to realize why it's respective BLAS library implementation is the current SOTA (even surpassing it in some cases).
        </p>
      </div>
    </div>
  );
};
