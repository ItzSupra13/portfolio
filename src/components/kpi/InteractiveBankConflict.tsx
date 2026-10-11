"use client"
import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContextKPI';
import { X, Layers, AlertTriangle, CheckCircle2, Zap, Code2 } from 'lucide-react';

type PresetPattern = 'stride1' | 'stride2' | 'stride4' | 'stride8' | 'stride16' | 'stride32' | 'transpose_unpadded' | 'transpose_padded';

export const InteractiveBankConflict: React.FC = () => {
  const { activeLab, setActiveLab } = useJournal();
  const [selectedPattern, setSelectedPattern] = useState<PresetPattern>('stride1');
  const [usePadding, setUsePadding] = useState<boolean>(false);

  if (activeLab !== 'bankconflict') return null;

  // Compute 32-thread addresses and mapped banks
  // In CUDA, shared memory has 32 banks (0..31), each 4 bytes wide.
  // bank_id = (word_index) % 32 = (byte_offset / 4) % 32
  const threads = Array.from({ length: 32 }, (_, i) => i);

  const getBankIndex = (tid: number, pattern: PresetPattern, padded: boolean): number => {
    switch (pattern) {
      case 'stride1':
        return (tid * 1) % 32;
      case 'stride2':
        return (tid * 2) % 32;
      case 'stride4':
        return (tid * 4) % 32;
      case 'stride8':
        return (tid * 8) % 32;
      case 'stride16':
        return (tid * 16) % 32;
      case 'stride32':
        return (tid * 32) % 32; // All 0!
      case 'transpose_unpadded':
        // Column access on tile[32][32]: thread tid reads tile[tid][col] (row=tid, col=0)
        // word index = tid * 32 + 0
        return (tid * 32) % 32; // Catastrophic 32-way conflict on Bank 0
      case 'transpose_padded':
        // Column access on tile[32][33]: thread tid reads tile[tid][col] (row=tid, col=0)
        // word index = tid * 33 + 0
        return (tid * 33) % 32; // Tid % 32 -> Perfect 1-to-1 bijection!
      default:
        return (tid * 1) % 32;
    }
  };

  // Calculate bank bucket occupancy
  const bankBuckets: number[][] = Array.from({ length: 32 }, () => []);
  threads.forEach((tid) => {
    const b = getBankIndex(tid, selectedPattern, usePadding);
    bankBuckets[b].push(tid);
  });

  // Calculate conflict metrics
  // Degree of conflict = max threads accessing the same bank
  const maxThreadsPerBank = Math.max(...bankBuckets.map(b => b.length));
  const hasConflict = maxThreadsPerBank > 1;
  const serializedCycles = maxThreadsPerBank; // Number of memory cycles needed to serve warp
  const bandwidthEfficiencyPercent = (1 / serializedCycles) * 100;

  const handleSelectPattern = (pattern: PresetPattern) => {
    setSelectedPattern(pattern);
    if (pattern === 'transpose_padded') {
      setUsePadding(true);
    } else if (pattern === 'transpose_unpadded') {
      setUsePadding(false);
    }
  };

  const isTransposeMode = selectedPattern === 'transpose_unpadded' || selectedPattern === 'transpose_padded';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card/95 border border-emerald-500/30 rounded-2xl shadow-[0_8px_32px_rgba(4,24,18,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-lime-400/15 text-lime-400 border border-lime-400/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg font-bold text-foreground">
                  CUDA Shared Memory 32-Bank Conflict Simulator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-400/15 text-lime-300 border border-lime-400/30 font-semibold">
                  Hardware SRAM Replay
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Visualize warp thread mapping to 32 independent SRAM banks and test +1 padding solutions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveLab(null)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="text-[11px] text-muted-foreground">Conflict Status</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {hasConflict ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-base font-bold text-rose-400">
                      {serializedCycles}-Way Conflict
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-base font-bold text-white">
                      Zero Conflict (1-Way)
                    </span>
                  </>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {hasConflict ? 'Serialized memory replays' : 'Full concurrent parallel access'}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="text-[11px] text-muted-foreground">Hardware Replay Cycles</div>
              <div className={`text-base font-bold mt-0.5 ${hasConflict ? 'text-rose-400' : 'text-white'}`}>
                {serializedCycles} <span className="text-xs font-normal text-muted-foreground">cycle{serializedCycles > 1 ? 's' : ''}</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                {serializedCycles === 1 ? 'Optimal single-cycle issue' : `${serializedCycles} sequential passes required`}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="text-[11px] text-muted-foreground">Effective Bandwidth</div>
              <div className={`text-base font-bold mt-0.5 ${bandwidthEfficiencyPercent < 50 ? 'text-rose-400' : 'text-white'}`}>
                {bandwidthEfficiencyPercent.toFixed(1)}%
              </div>
              <div className="text-[10px] text-muted-foreground">
                Of theoretical SRAM peak
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-card/60">
              <div className="text-[11px] text-muted-foreground">Active Warp Configuration</div>
              <div className="text-base font-bold text-foreground mt-0.5">
                32 Threads <span className="text-xs font-normal text-muted-foreground">&middot; 32 Banks</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                4 bytes per bank word
              </div>
            </div>
          </div>

          {/* Quick Presets Strip */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Select Memory Access Pattern:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleSelectPattern('stride1')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPattern === 'stride1'
                    ? 'border-lime-400 bg-lime-400/15 text-foreground font-semibold shadow-[0_0_12px_rgba(190,242,100,0.25)]'
                    : 'border-border/70 bg-card/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="font-bold">Stride 1 (Linear)</div>
                <div className="text-[10px] text-lime-400">100% BW &middot; 0 Conflicts</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPattern('stride2')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPattern === 'stride2'
                    ? 'border-amber-500 bg-amber-500/15 text-foreground font-semibold shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'border-border/70 bg-card/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="font-bold">Stride 2 (Even Banks)</div>
                <div className="text-[10px] text-amber-400">50% BW &middot; 2-way conflict</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPattern('stride32')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPattern === 'stride32'
                    ? 'border-rose-500 bg-rose-500/15 text-foreground font-semibold shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                    : 'border-border/70 bg-card/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="font-bold">Stride 32 (Catastrophic)</div>
                <div className="text-[10px] text-rose-400">3.1% BW &middot; 32-way conflict</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPattern('transpose_unpadded')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPattern === 'transpose_unpadded'
                    ? 'border-rose-500 bg-rose-500/15 text-foreground font-semibold shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                    : 'border-border/70 bg-card/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="font-bold">Transpose [32][32]</div>
                <div className="text-[10px] text-rose-400">Col read 32-way conflict</div>
              </button>
            </div>

            {/* Padded Solution Toggle for Transpose */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-lime-400" />
                <span className="text-foreground font-medium">
                  Fix with +1 Shared Memory Padding: <code className="text-white bg-lime-400/20 px-1.5 py-0.5 rounded border border-lime-400/30 font-bold">tile[32][33]</code>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isTransposeMode) {
                    setUsePadding(!usePadding);
                    setSelectedPattern(!usePadding ? 'transpose_padded' : 'transpose_unpadded');
                  } else {
                    handleSelectPattern('transpose_padded');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  isTransposeMode && usePadding
                    ? 'bg-lime-400 text-slate-950 border border-lime-400'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {isTransposeMode && usePadding ? '✓ +1 Padding Active' : 'Enable +1 Padding'}
              </button>
            </div>
          </div>

          {/* 32-Bank Silicon Grid Visualizer */}
          <div className="p-4 rounded-xl border border-emerald-500/25 bg-[#06120e] text-neutral-100 space-y-3 font-mono shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                On-Chip Shared Memory 32-Bank Collision Matrix
              </span>
              <span className="text-[11px] text-slate-400">
                Colors indicate thread density per bank
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {bankBuckets.map((threads, bankIdx) => {
                const count = threads.length;
                let bgStyle = 'bg-black/40 border-neutral-800 text-neutral-400';
                if (count === 1) bgStyle = 'bg-emerald-950/70 border-lime-400/60 text-white shadow-[0_0_8px_rgba(190,242,100,0.2)]';
                else if (count === 2) bgStyle = 'bg-amber-950/70 border-amber-500/60 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]';
                else if (count > 2) bgStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.3)]';

                return (
                  <div
                    key={`bank-${bankIdx}`}
                    className={`p-2 rounded-xl border flex flex-col justify-between min-h-[64px] transition-all ${bgStyle}`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold">B{bankIdx}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                        count > 1 ? 'bg-rose-500 text-white' : count === 1 ? 'bg-lime-400/25 text-white' : 'text-neutral-500'
                      }`}>
                        {count}T
                      </span>
                    </div>

                    <div className="text-[9px] mt-1 line-clamp-1 truncate opacity-90">
                      {count === 0 ? (
                        <span className="text-neutral-600">idle</span>
                      ) : (
                        threads.map(t => `T${t}`).join(',')
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Solution Comparison */}
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Code2 className="w-4 h-4 text-lime-400" />
              <span>Architectural Fix in C++ / CUDA:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-1.5">
                <div className="font-bold text-rose-400 flex items-center justify-between">
                  <span>❌ Unpadded: tile[32][32]</span>
                  <span className="text-[10px]">32-Way Conflict</span>
                </div>
                <pre className="text-muted-foreground overflow-x-auto p-2 bg-black/50 rounded-lg">
{`__shared__ float tile[32][32];
// Column read:
float val = tile[threadIdx.x][col];
// tid=0..31 read bank (0*32+col)%32
// All 32 threads serialized on Bank col!`}
                </pre>
              </div>

              <div className="p-3 rounded-xl border border-lime-400/40 bg-lime-400/5 space-y-1.5">
                <div className="font-bold text-lime-300 flex items-center justify-between">
                  <span>✓ Padded: tile[32][33]</span>
                  <span className="text-[10px]">0 Conflicts (1-Way)</span>
                </div>
                <pre className="text-muted-foreground overflow-x-auto p-2 bg-black/50 rounded-lg">
{`__shared__ float tile[32][33]; // +1 padding
// Column read:
float val = tile[threadIdx.x][col];
// tid=0..31 read bank (tid*33+col)%32
// Shifts by 1 per row: 32 distinct banks!`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-border/80 bg-muted/20 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveLab(null)}
            className="px-4 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold hover:bg-lime-300 border border-lime-400 transition-colors cursor-pointer"
          >
            Close Bank Conflict Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
