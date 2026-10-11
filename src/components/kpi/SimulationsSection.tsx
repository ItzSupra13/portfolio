import React from 'react';
import { useJournal } from '@/context/JournalContextKPI';
import { 
  Activity, 
  Layers, 
  Maximize2, 
  Zap,
  Cpu,
  Sparkles
} from 'lucide-react';

export const SimulationsSection: React.FC = () => {
  const { setActiveLab } = useJournal();

  return (
    <div className="space-y-8 relative">
      <span className="ch ch-tl hidden md:block" />
      <span className="ch ch-tr hidden md:block" />

      {/* Header */}
      <div className="pb-4 border-b border-border/70">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-lime-400 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-lime-400" />
            Interactive GPU Silicon Laboratories
          </span>
          <span aria-hidden="true" className="text-muted-foreground opacity-30">/</span>
          <span className="text-xs font-mono text-foreground font-medium">Roofline Models & Memory Hierarchy</span>
        </div>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground mt-1">
          Interactive Algorithmic Laboratories
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl font-light">
          Verify theoretical hardware limits with live simulators. Evaluate arithmetic intensity across A100, H100, and Blackwell, and visualize shared memory bank conflict replays at the warp level.
        </p>
      </div>

      {/* Two Interactive Lab Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab 01: GPU Roofline Model & Operational Intensity Analyzer */}
        <div className="p-6 rounded-2xl border border-emerald-500/25 bg-card/80 backdrop-blur-md flex flex-col justify-between space-y-5 hover:border-lime-400/50 hover:shadow-[0_0_24px_rgba(190,242,100,0.15)] transition-all shadow-sm group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-lime-400/15 text-lime-400 border border-lime-400/30">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-mono text-[11px] text-lime-400 uppercase tracking-wider font-semibold bg-lime-400/10 px-2 py-0.5 rounded-md border border-lime-400/20">
                Lab 01 · Profiling & Intensity
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-xl font-bold text-foreground group-hover:text-white transition-colors">
                GPU Roofline Model Analyzer
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1.5 font-mono">
                Deconstruct the memory wall across NVIDIA H100, A100, RTX 4090, and Blackwell B200. Inspect whether kernels are memory-bandwidth bound or compute bound.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Live Log-Log Roofline plot with dynamic Ridge Point</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Canonical presets: FlashAttention-2, Naive GEMM, Triton LayerNorm</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Calculate attainable TFLOP/s and speedup from SRAM reuse</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveLab('roofline')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-slate-950 font-mono text-xs font-bold hover:bg-lime-300 border border-lime-400 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Launch Roofline Analyzer &rarr;</span>
          </button>
        </div>

        {/* Lab 02: CUDA Shared Memory 32-Bank Conflict Simulator */}
        <div className="p-6 rounded-2xl border border-amber-500/25 bg-card/80 backdrop-blur-md flex flex-col justify-between space-y-5 hover:border-amber-500/50 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)] transition-all shadow-sm group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-mono text-[11px] text-amber-400 uppercase tracking-wider font-semibold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                Lab 02 · Warp & SRAM Banks
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-xl font-bold text-foreground group-hover:text-amber-300 transition-colors">
                CUDA Shared Memory 32-Bank Simulator
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1.5 font-mono">
                Simulate 32-way shared memory bank access collisions during warp execution. Compare 32-way serialized replay stalls against +1 padding solutions.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Interactive 32-bank collision matrix with thread mapping</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Stride 1 to Stride 32 access pattern tests</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Interactive matrix transpose padding toggle (<code className="text-slate-100 font-bold">tile[32][33]</code>)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveLab('bankconflict')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-mono text-xs font-bold hover:bg-amber-300 border border-amber-400 transition-all cursor-pointer active:scale-[0.99]"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Launch Bank Conflict Lab &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};