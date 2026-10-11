"use client"
import React, { useState } from 'react';
import { useJournal } from '@/context/JournalContextKPI';
import { Phase } from '@/types/journal';
import { Check, Clock, ChevronDown, ChevronUp, Grid, ListOrdered, Sparkles, Target } from 'lucide-react';

const PHASE_GROUPS: { name: Phase; range: [number, number]; weeks: string; hours: number; description: string; exitSignal: string }[] = [
  { 
    name: 'C++ & CUDA Foundations', 
    range: [1, 35], 
    weeks: 'Weeks 1–5',
    hours: 100,
    description: 'Modern C++, CUDA programming model, memory coalescing, shared memory tiling, bank conflict elimination, warp shuffles.',
    exitSignal: 'Write/debug a CUDA kernel from scratch with zero copy-paste.'
  },
  { 
    name: 'Performance Engineering', 
    range: [36, 70], 
    weeks: 'Weeks 6–10',
    hours: 100,
    description: 'Nsight Systems timeline, Nsight Compute SOL, Roofline profiling, PyTorch C++ bindings, OpenAI Triton block programming.',
    exitSignal: 'Profile a kernel, explain its exact roofline position, and fix it.'
  },
  { 
    name: 'Frontier Kernel Engineering', 
    range: [71, 120], 
    weeks: 'Weeks 11–17',
    hours: 140,
    description: 'cuBLAS parity ladder, FlashAttention 1→4, Hopper TMA/WGMMA, CUTLASS CuTe layout algebra, Blackwell NVFP4, DeepGEMM & FlashMLA.',
    exitSignal: 'Push GEMM near cuBLAS parity; build FlashAttention from scratch; modify a CUTLASS example.'
  },
  { 
    name: 'Distributed Training', 
    range: [121, 160], 
    weeks: 'Weeks 18–23',
    hours: 120,
    description: 'NVLink & NVSwitch, NCCL collective comms (AllReduce/ReduceScatter), PyTorch FSDP & ZeRO-3, Megatron-LM TP & PP.',
    exitSignal: 'Run, scale, and debug a multi-GPU training job.'
  },
  { 
    name: 'Inference & Serving', 
    range: [161, 210], 
    weeks: 'Weeks 24–30',
    hours: 140,
    description: 'Prefill vs Decode dynamics, PagedAttention in vLLM, continuous batching, chunked prefill, SGLang, shipping custom quantization kernels.',
    exitSignal: 'Deploy + benchmark a server; ship a custom kernel into it.'
  },
  { 
    name: 'Portfolio & Job Search', 
    range: [211, 250], 
    weeks: 'Weeks 31–36',
    hours: 120,
    description: 'Portfolio consolidation, LeetGPU whiteboard challenges, deep ML systems architecture mock interviews, Sarvam AI readiness dossier.',
    exitSignal: 'Defend 3–4 projects live; apply with a readiness dossier.'
  }
];

export const DayMatrix: React.FC = () => {
  const { days, setActiveReaderDay, addNewDay, setActiveNavPage } = useJournal();
  const [matrixStyle, setMatrixStyle] = useState<'syllabus' | 'grid'>('syllabus');
  const [isExpanded, setIsExpanded] = useState(true);

  // Map of dayNumber -> day object
  const dayMap = new Map(days.map(d => [d.dayNumber, d]));
  const numbers = Array.from({ length: 250 }, (_, i) => i + 1);

  const handleCellClick = (dayNumber: number) => {
    const existingDay = dayMap.get(dayNumber);
    if (existingDay) {
      setActiveNavPage('logbook');
      setTimeout(() => {
        const el = document.getElementById(`day-${dayNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          setActiveReaderDay(existingDay);
        }
      }, 50);
    } else {
      addNewDay();
    }
  };

  return (
    <section 
      aria-label="Curriculum Roadmap" 
      className="border border-emerald-500/25 rounded-2xl p-5 sm:p-6 bg-card/80 backdrop-blur-md relative shadow-[0_4px_24px_rgba(4,24,18,0.25)]"
    >
      {/* Header with View Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-lime-400 font-semibold flex items-center gap-1.5">
              Curriculum Roadmap
            </span>
            <span aria-hidden="true" className="text-muted-foreground opacity-30">/</span>
            <span className="text-xs font-mono text-foreground font-medium">My Progression</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            36 Weeks &middot; ~720 Hours &middot; From Python to Frontier GPU Kernel & Inference Architect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-1 rounded-xl border border-border/80 bg-muted/40 text-xs font-mono shadow-sm">
            <button
              type="button"
              onClick={() => setMatrixStyle('syllabus')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                matrixStyle === 'syllabus'
                  ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Syllabus</span>
            </button>
            <button
              type="button"
              onClick={() => setMatrixStyle('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                matrixStyle === 'grid'
                  ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>250-Grid</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-muted-foreground hover:text-lime-400 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse roadmap' : 'Expand roadmap'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-5">
          {matrixStyle === 'syllabus' ? (
            /* Syllabus / Phase Index View (Authentic Academic Feel) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PHASE_GROUPS.map((phase) => {
                const phaseDays = numbers
                  .filter(num => num >= phase.range[0] && num <= phase.range[1])
                  .map(num => ({ num, day: dayMap.get(num) }));

                const completedCount = phaseDays.filter(p => p.day?.status === 'completed').length;
                const totalInPhase = phase.range[1] - phase.range[0] + 1;

                return (
                  <div 
                    key={phase.name} 
                    className="p-4 rounded-xl border border-emerald-500/20 bg-card/60 hover:border-lime-400/40 hover:shadow-[0_0_16px_rgba(190,242,100,0.1)] space-y-3 transition-all"
                  >
                    <div className="flex items-baseline justify-between gap-2 border-b border-border/50 pb-2">
                      <div>
                        <div className="font-editorial font-bold text-sm text-foreground">
                          {phase.name}
                        </div>
                        <div className="font-mono text-[10px] text-lime-400 font-semibold">
                          {phase.weeks} &middot; {phase.hours}h
                        </div>
                      </div>
                      <div className="font-mono text-[10px] text-slate-300 whitespace-nowrap font-medium">
                        {completedCount}/{totalInPhase} days
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 italic font-sans leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-muted-foreground">
                      <span className="font-semibold text-lime-400 flex items-center gap-1 mb-0.5">
                        <Target className="w-3 h-3 text-lime-400" />
                        Exit Signal:
                      </span>
                      <span className="text-foreground/90">{phase.exitSignal}</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {phaseDays.filter(p => !!p.day).slice(0, 5).map(({ num, day }) => {
                        const isDone = day?.status === 'completed';
                        const isActive = day?.status === 'in-progress';

                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleCellClick(num)}
                            className="w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg hover:bg-lime-400/10 transition-colors text-xs font-mono group cursor-pointer"
                          >
                            <span className="truncate flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                              <span className="font-bold text-lime-400 shrink-0">
                                D{String(num).padStart(2, '0')}
                              </span>
                              <span className="truncate">{day?.title}</span>
                            </span>
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : isActive ? (
                              <Clock className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                            ) : (
                              <span className="text-[10px] text-muted-foreground/60 shrink-0">·</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Dense 250-Grid Heat Matrix View */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  <span>250-Day Engineering Heatmap</span>
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] inline-block" />
                    <span className="text-emerald-400">Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-lime-400 shadow-[0_0_6px_#bef264] inline-block" />
                    <span className="text-lime-400">In-Progress</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm border border-border/80 bg-muted/20 inline-block" />
                    <span>Planned</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-10 sm:grid-cols-25 gap-1.5 select-none">
                {numbers.map((num) => {
                  const day = dayMap.get(num);
                  const isDone = day?.status === 'completed';
                  const isActive = day?.status === 'in-progress';

                  let cellStyle = 'bg-card/40 border-border/60 text-muted-foreground/70 hover:border-lime-400/50 hover:text-white';
                  if (isDone) {
                    cellStyle = 'bg-emerald-500/30 border-emerald-500/60 text-white font-bold shadow-[0_0_8px_rgba(16,185,129,0.25)] hover:bg-emerald-500/40 hover:scale-105';
                  } else if (isActive) {
                    cellStyle = 'bg-lime-400/25 border-lime-400/60 text-white font-bold shadow-[0_0_8px_rgba(190,242,100,0.25)] hover:bg-lime-400/35 hover:scale-105';
                  }

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleCellClick(num)}
                      title={`Day ${num}: ${day ? day.title : 'Planned Entry'}`}
                      className={`h-7 rounded-md border font-mono text-[10px] font-medium flex items-center justify-center transition-all cursor-pointer ${cellStyle}`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
