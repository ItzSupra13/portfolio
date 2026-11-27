import React, { useState } from 'react';
import { Cpu, Database, Layers, Zap, ArrowDown, CheckCircle2, Target, Shield, Activity, Sparkles, Clock, ChevronRight, Info, Terminal, ArrowRight } from 'lucide-react';

type MemoryTierId = 'dram' | 'vram' | 'l2' | 'smem' | 'regs' | 'alu';

interface MemoryTierInfo {
  number: number;
  shortLabel: string;
  name: string;
  medium: string;
  capacity: string;
  latency: string;
  bandwidth: string;
  summary: string;
  gemmRole: string;
}

export const GpuArchDiagram: React.FC = () => {
  const [activeTier, setActiveTier] = useState<MemoryTierId>('vram');

  const memoryTiers: Record<MemoryTierId, MemoryTierInfo> = {
    dram: {
      number: 1,
      shortLabel: 'Host DRAM & PCIe',
      name: 'Tier 1: Host System DRAM & PCIe Bus',
      medium: 'CPU System Memory (DDR4/DDR5) over PCIe 3.0/4.0 x16',
      capacity: '16 GB – 64 GB System RAM',
      latency: 'Thousands of cycles (Host-to-Device transfer bottleneck)',
      bandwidth: '~15.75 GB/s (PCIe 3.0 x16) to ~31.5 GB/s (PCIe 4.0)',
      summary: 'Data origin on the CPU host. Before GPU execution can begin, input matrices A and B must travel over the physical PCIe bus into GPU memory.',
      gemmRole: 'In high-performance pipelines, matrices are kept resident in GPU VRAM to avoid crossing the slow PCIe bus repeatedly.',
    },
    vram: {
      number: 2,
      shortLabel: 'Global VRAM (16 GB)',
      name: 'Tier 2: Device Global Memory (VRAM)',
      medium: '16 GB GDDR6 on Tesla T4 (256-bit memory bus)',
      capacity: '16 GB Dedicated GPU Memory',
      latency: '400–800 clock cycles (The GPU Memory Wall)',
      bandwidth: '300–320 GB/s peak bandwidth',
      summary: 'The main off-chip memory pool on the Tesla T4 card. All matrix arrays A, B, and C initially reside here for the lifetime of the CUDA kernel.',
      gemmRole: 'Without shared memory tiling, every float is repeatedly fetched from VRAM, bottlenecking performance at less than 3% of peak.',
    },
    l2: {
      number: 3,
      shortLabel: 'Unified L2 (4 MB)',
      name: 'Tier 3: Unified Crossbar L2 Cache',
      medium: 'On-chip SRAM cache shared across all 40 SMs',
      capacity: '4,096 KB (4 MB) on Tesla T4',
      latency: '180–220 clock cycles',
      bandwidth: '~1.5 TB/s aggregate crossbar bandwidth',
      summary: 'A fast on-chip crossbar cache shared across all 40 SMs. Absorbs 128-byte DRAM cache-line bursts and captures spatial reuse across adjacent thread blocks.',
      gemmRole: 'Buffers overlapping matrix slices when neighboring thread blocks are scheduled onto adjacent SMs.',
    },
    smem: {
      number: 4,
      shortLabel: 'Shared Memory (64 KB)',
      name: 'Tier 4: Configurable Shared Memory & L1 Cache (SRAM)',
      medium: 'Dedicated on-chip SRAM with 32 physical memory banks',
      capacity: '64 KB configurable per SM (96 KB total L1/SMEM pool)',
      latency: '20–30 clock cycles (Single-cycle broadcast when conflict-free)',
      bandwidth: '~4.5 TB/s aggregate across all 40 SMs',
      summary: 'High-speed programmer-managed scratchpad memory shared by all threads inside a thread block. Physically divided into 32 banks (4 bytes per bank).',
      gemmRole: 'Stages sub-tiles As[BM][BK] and Bs[BK][BN] on-chip, reducing global VRAM bandwidth demand by 16× or more.',
    },
    regs: {
      number: 5,
      shortLabel: 'Thread Registers (256 KB)',
      name: 'Tier 5: 64K Register File (RF) per SM',
      medium: 'Ultra-fast flip-flop SRAM storage local to each SM core',
      capacity: '65,536 × 32-bit registers (256 KB SRAM per SM; 10 MB total across 40 SMs)',
      latency: '1 clock cycle (Zero stall latency when unrolled)',
      bandwidth: '> 15 TB/s aggregate register bandwidth',
      summary: 'The fastest storage on the silicon. In our optimized 2D tiled GEMM, each thread keeps an 8×8 accumulator grid (64 registers) directly in registers.',
      gemmRole: 'Enables high arithmetic intensity: each float loaded from Shared Memory is reused 8 times in registers, freeing memory pipelines.',
    },
    alu: {
      number: 6,
      shortLabel: 'Arithmetic ALUs & Cores',
      name: 'Tier 6: Arithmetic Execution Units (FP32 CUDA Cores & Tensor Cores)',
      medium: '64 FP32 CUDA Cores + 8 Turing Tensor Cores per SM (40 SMs on T4)',
      capacity: '2,560 FP32 Cores + 320 Tensor Cores total on Tesla T4',
      latency: 'Pipelined execution (1 FMA instruction per cycle per core)',
      bandwidth: '8.141 TFLOPS theoretical peak FP32 throughput (at ~1.59 GHz boost)',
      summary: 'The physical arithmetic pipelines that compute math. In FP32 mode, each CUDA core completes a Fused Multiply-Add (FMA = 2 FLOPs) every single cycle.',
      gemmRole: 'The ultimate target: keeping these pipelines 100% supplied with operands so arithmetic throughput approaches the 8.14 TFLOPS silicon ceiling.',
    },
  };

  const curr = memoryTiers[activeTier];

  return (
    <div className="space-y-12">
      {/* ─── 1. SIMPLIFIED INTERACTIVE ARCHITECTURE DIAGRAM (NUMBERED MEMORY JOURNEY) ─── */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-7 shadow-xs">
        {/* Top Header */}
        <div className="border-b border-border pb-4 mb-5">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground font-sans">
            Physical Memory Hierarchy Visualization
          </h3>
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold mt-1">
            <span>NVIDIA TESLA T4</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
            Click on any numbered tier below to inspect how data travels from off-chip DRAM down to thread registers and CUDA arithmetic pipelines.
          </p>
        </div>

        {/* Full-Width Visual Architecture Schematic of T4 Memory Hierarchy */}
        <div className="w-full bg-background/80 rounded-xl border border-border p-4 sm:p-5 space-y-3.5">
          {/* Tier 1: Host System DRAM */}
          <div
            onClick={() => setActiveTier('dram')}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              activeTier === 'dram'
                ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-muted px-1.5 py-0.5 rounded text-foreground">
                  1
                </span>
                <Database className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Host System DRAM (CPU Host Memory)
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">PCIe 3.0/4.0 x16</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 font-serif">
              Input matrices A and B originate in host memory; transferred over PCIe bus (~16 GB/s) to GPU.
            </p>
          </div>

          {/* PCIe Down Connector */}
          <div className="flex justify-center items-center py-0 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <ArrowDown className="w-3.5 h-3.5 text-primary" />
              <span>PCIe Bus Direct Memory Access</span>
            </div>
          </div>

          {/* Tier 2: Device Global VRAM (16 GB GDDR6) */}
          <div
            onClick={() => setActiveTier('vram')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeTier === 'vram'
                ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                  2
                </span>
                <Database className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Device Global VRAM (16 GB GDDR6 · 256-bit Bus)
                </span>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">400–800 cycles</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 flex flex-wrap items-center justify-between gap-1">
              <span>320 GB/s Peak Bandwidth · Holds Matrices A, B, and C</span>
              <span className="font-mono text-[10px] text-amber-500 font-semibold">The Memory Wall</span>
            </div>
          </div>

          {/* Bus Down Connector */}
          <div className="flex justify-center items-center py-0 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <ArrowDown className="w-3.5 h-3.5 text-primary" />
              <span>128-Byte Cache-Line Transactions</span>
            </div>
          </div>

          {/* Tier 3: Unified L2 Cache (4 MB) */}
          <div
            onClick={() => setActiveTier('l2')}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              activeTier === 'l2'
                ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-muted px-1.5 py-0.5 rounded text-foreground">
                  3
                </span>
                <Layers className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Unified Crossbar L2 Cache (4 MB on Tesla T4)
                </span>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">180–220 cycles</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 font-serif">
              Shared crossbar cache connecting all 40 SMs; absorbs DRAM latency bursts and caches shared matrix tiles.
            </p>
          </div>

          {/* SM Ingress Connector */}
          <div className="flex justify-center items-center py-0 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <ArrowDown className="w-3.5 h-3.5 text-primary" />
              <span>Dispatched to Streaming Multiprocessor</span>
            </div>
          </div>

          {/* Tier 4, 5, 6: Streaming Multiprocessor 0 (1 of 40 on T4) */}
          <div className="p-4 rounded-xl border border-primary/30 bg-card/60 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Streaming Multiprocessor (SM 0 · 1 of 40 on Tesla T4)
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Peak: <strong className="text-primary font-bold">8.14 TFLOPS FP32</strong>
              </span>
            </div>

            {/* Tier 4: Configurable Shared Memory (SRAM) with 32 Banks */}
            <div
              onClick={() => setActiveTier('smem')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeTier === 'smem'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    4
                  </span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    Configurable Shared Memory (SRAM) / L1 Cache · 64 KB
                  </span>
                </div>
                <span className="text-[10px] font-mono text-primary font-bold">20–30 cycles</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                <strong>32 Physical Memory Banks (4 bytes/bank):</strong> Fast scratchpad shared by all 256 threads in a block. Stages tiles <code className="text-primary font-mono">As[BM][BK]</code> &amp; <code className="text-primary font-mono">Bs[BK][BN]</code>.
              </p>
            </div>

            {/* 4 SM Sub-Partitions: Housing Tier 5 (Registers) and Tier 6 (ALUs) */}
            <div>
              <div className="text-[11px] font-mono text-muted-foreground mb-2 flex items-center justify-between">
                <span>4 SM SUB-PARTITIONS (SMSP 0–3) · 32 ACTIVE WARPS / SM</span>
                <span className="text-primary text-[10px]">64K Regs &amp; 64 CUDA Cores / SM</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((sp) => (
                  <div
                    key={sp}
                    className="p-2.5 rounded-lg border border-border bg-background space-y-1.5 flex flex-col justify-between"
                  >
                    <div className="text-[10px] font-mono font-bold text-muted-foreground flex items-center justify-between">
                      <span>SMSP {sp}</span>
                      {sp === 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </div>
                    <div className="p-1 rounded bg-card border border-border text-[9.5px] font-mono text-center text-muted-foreground">
                      Warp Scheduler
                    </div>
                    {/* Tier 5 Clickable */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTier('regs');
                      }}
                      className={`p-1 rounded border text-[9.5px] font-mono text-center cursor-pointer transition-colors ${
                        activeTier === 'regs'
                          ? 'bg-primary/20 border-primary text-primary font-bold'
                          : 'bg-card border-border text-foreground hover:border-primary/50'
                      }`}
                    >
                      <span className="font-bold text-primary mr-1">5.</span>
                      16K Regs (64 KB)
                    </div>
                    {/* Tier 6 Clickable */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTier('alu');
                      }}
                      className={`p-1 rounded border text-[9.5px] font-mono text-center cursor-pointer transition-colors ${
                        activeTier === 'alu'
                          ? 'bg-primary/20 border-primary text-primary font-bold'
                          : 'bg-card border-border text-foreground hover:border-primary/50'
                      }`}
                    >
                      <span className="font-bold text-primary mr-1">6.</span>
                      16 FP32 Cores
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Stage Description Inspector (Moved to the bottom of architecture) */}
        <div className="mt-5 p-5 rounded-xl bg-background border border-border shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                Tier {curr.number}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-foreground font-sans">
                {curr.shortLabel}
              </h4>
            </div>
            <span className="text-xs font-mono text-primary font-semibold">
              Latency: {curr.latency.split(' (')[0]}
            </span>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-card border border-border">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Capacity:</span>
              <span className="text-foreground font-bold">{curr.capacity}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-card border border-border">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Throughput:</span>
              <span className="text-primary font-bold">{curr.bandwidth.split(' (')[0]}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-card border border-border">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Physical Medium:</span>
              <span className="text-foreground">{curr.medium}</span>
            </div>
          </div>

          {/* Descriptive Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs text-muted-foreground font-serif leading-relaxed">
            <div>
              <strong className="text-foreground font-sans font-semibold block text-[13px] mb-0.5">
                How Hardware Handles It:
              </strong>
              <p className="text-sm">{curr.summary}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 border border-primary/20">
              <strong className="text-primary font-sans font-semibold block text-[13px] mb-0.5">
                GEMM Optimization Impact:
              </strong>
              <p className="text-sm text-foreground/90">{curr.gemmRole}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. HOW CUDA HANDLES MEMORY: 3 BLOG-LIKE PARAGRAPHS ─── */}
      <div className="space-y-5 text-[17px] sm:text-[19px] text-foreground/90 font-serif leading-[1.75] tracking-[-0.01em]">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground font-sans tracking-tight pt-2">
          How CUDA Dispatches Work and Orchestrates Memory
        </h3>

        <p>
          When you launch a matrix multiplication kernel on a modern GPU, CUDA does not throw all computations into a single massive pool of threads. Instead, it organizes work into a strict physical hierarchy designed to match the silicon. The entire problem is declared as a <strong className="text-foreground">Grid</strong>, which is partitioned into independent rectangular tiles called <strong className="text-foreground">Thread Blocks</strong> (or CTAs). On our Tesla T4, the hardware dispatcher distributes these thread blocks across the chip’s 40 physical Streaming Multiprocessors (SMs). But within an SM, threads do not execute individually; they are bundled into lockstep squads of 32 called <strong className="text-foreground">Warps</strong>. The warp is the fundamental atomic unit of execution in CUDA—all 32 threads in a warp execute the exact same instruction at the exact same physical clock cycle on the SM’s arithmetic pipelines.
        </p>

        <p>
          The primary obstacle in GPU programming is the notorious <strong className="text-foreground">memory wall</strong>. On the Tesla T4, pulling a single floating-point number from off-chip global GDDR6 memory (VRAM) requires between 400 and 800 clock cycles. If an SM had to sit idle waiting every time a thread requested an operand, the computing cores would spend over 95% of their life doing absolutely nothing. GPUs conquer this latency through an architectural mechanism called <strong className="text-foreground">latency hiding</strong>. Each SM on the T4 maintains up to 32 active warps concurrently in hardware. When Warp 0 issues a global memory read and stalls waiting for data to travel across the memory bus, the hardware warp scheduler instantly switches execution to Warp 1 at <span className="font-semibold text-primary">zero clock cycle penalty</span>. As long as our kernel maintains enough active, math-ready warps, the arithmetic execution pipelines remain saturated while slow memory transfers crawl quietly in the background.
        </p>

        <p>
          To ensure latency hiding works sustainably, high-performance kernels never let individual threads repeatedly read from global VRAM. Instead, we stage data up a strict physical hierarchy. First, all threads in a block cooperate to load a contiguous tile of matrices <span className="font-mono text-primary font-semibold">A</span> and <span className="font-mono text-primary font-semibold">B</span> from VRAM through the 4 MB L2 cache into the SM’s on-chip <strong className="text-foreground">Shared Memory (SRAM)</strong>—an ultra-fast scratchpad responding in just 20 to 30 clock cycles. Next, each thread pulls tiny sub-fragments from Shared Memory into its own private <strong className="text-foreground">Registers</strong>—the fastest memory on silicon, operating with instantaneous 1-cycle latency. In registers, a thread performs dozens of multiply-accumulate operations on those exact same numbers before ever writing the final result back out to VRAM. By choreographing data movement along this exact path—from VRAM to L2, to Shared Memory, to Registers—we turn an algorithm that would otherwise drown in memory bus congestion into one that races at silicon speed.
        </p>
      </div>

      {/* ─── 3. ACKNOWLEDGING THE LIMITS: THEORETICAL PEAK VS SOTA CUBLAS ─── */}
      <div className="pt-8 border-t border-border space-y-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
            Acknowledging the Limits: The Theoretical Ceiling vs. Vendor cuBLAS
          </h3>
        </div>

        <div className="space-y-5 text-[17px] sm:text-[19px] text-foreground/90 font-serif leading-[1.75] tracking-[-0.01em]">
          <p>
            It is naive to assume that everytime any kernel runs theoretically perfectly on a GPU. Even though we have a number to represent it, it's more or less useless to us. When analyzing the speeds, tons of variables comes into account, from architecture, to scratchpad sizes, to whatever NVIDIA locked in the specific graphics card. The net conclusion is looking at the times in itself is useless. What we strive to improve is the difference in between improvements. But how do we practically mark the practical limit on the chip? Before writing a single line of CUDA optimization, we must be aware of the system's boundaries that define the playing field, specifically the <strong className="text-foreground">theoretical silicon limit</strong>, and the <strong className="text-foreground">practical vendor limit</strong> established by NVIDIA’s closed-source cuBLAS library. Understanding where these boundaries lie prevents us from chasing ghosts and provides an honest, empirical target for our hand-written kernels.
          </p>

          <p>
            Another dilemma arrives that I fell we don't question enough is what makes a good algorithm in general to be considered a good baseline for the task? I ask this because Matrix Multiplication can be made as complicated and a hell for compilers to have as terrible times as we want. It also hints that the amount of improvement we must strive for should be seen from the context of SOTA (CUBLAS) instead of whatever baseline we have. The answer that I could infer, from the blogs I've been using as a source, using possibly the worst most optimized algorithm is a good baseline, and that is exactly why we use the naive implementation as a baseline. Moreover that's a standard most articles start with so can't question this anyways.
          </p>


          {/* Merged 2 Limits Comparison Card with Vertical Divider */}
          <div className="rounded-xl bg-card border border-border not-prose font-sans overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Limit 1: Theoretical Silicon Limit */}
              <div className="p-5 sm:p-6 space-y-3">
                <div className="border-b border-border pb-2.5">
                  <h4 className="text-base font-bold text-foreground">
                    Theoretical Peak: ~8.141 TFLOPS
                  </h4>
                  <div className="text-sm font-mono text-primary mt-1">
                    Practically unreachable
                  </div>
                </div>

                <p className="text-sm text-foreground font-serif leading-relaxed">
                  This ceiling is constant. It assumes EVERY single arithmetic pipeline across all 40 SMs executes a Fused Multiply-Add (FMA) instruction on EVERY single nanosecond clock cycle with ZERO cache misses, ZERO pipeline stalls, and 100% memory staging efficiency. In real-world software, it's just physically impossible because index math, address calculations, and thread synchronizations inevitably consume cycles. ALOT of cycles.
                </p>
              </div>

              {/* Limit 2: Practical SOTA cuBLAS Limit */}
              <div className="p-5 sm:p-6 space-y-3">
                <div className="border-b border-border pb-2.5">
                  <h4 className="text-base font-bold text-foreground">
                    cuBLAS Benchmark: ~4.2 TFLOPS
                  </h4>
                  <div className="text-sm font-mono text-primary mt-1">
                    ~52% of Peak
                  </div>
                </div>

                <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                  This ceiling is practical but absolutely useless. Let me explain. NVIDIA’s closed-source <code className="text-primary font-mono">cuBLAS</code> library represents over 15 years of proprietary micro-architectural engineering. I do appreciate the hardwork they have done. But it's useless when you consider the time at face value. Again, we must focus on the improvements in our kernels with respect to this benchmark.
                </p>
              </div>
            </div>
          </div>

          {/* The Engineer's Advantage: Simple Subtitle & Editorial Text (No Box) */}
          <div className="pt-4 space-y-4">
            <h4 className="text-lg sm:text-xl font-bold text-foreground font-sans tracking-tight flex items-center gap-2">
              <span>Why we have the hope to Match cuBLAS</span>
            </h4>

            <p>
              To a programmer looking at naive CUDA loop which begins its life at a humble &lt;0.01% of the hardware capability and barely 1.5% of the SOTA, the 4.2 TFLOPS mark achieved by cuBLAS looks like TSMC doing black chip design magic. But cuBLAS carries a massive architectural burden that our custom kernel does not: <strong className="text-foreground">the burden of absolute generality</strong>.
            </p>

            <p>
              Because cuBLAS is a general-purpose library, it must safely execute on arbitrary, runtime-unknown matrix dimensions (<span className="text-lg font-semibold">M, N, K</span>), unaligned memory pointers, non-power-of-two shapes, arbitrary memory strides, and dynamic CPU dispatch flags. To handle all of these safely, cuBLAS must include runtime bounds checking, branch conditions, and generalized tile sizes that balance across every possible workload.
            </p>

            <p>
              When we write a dedicated kernel for our target problem size (such as <span className="font-mono text-primary font-semibold">4096 × 4096</span>), we have profound structural advantages:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-foreground/90 text-[16px] sm:text-[18px]">
              <li>
                <strong className="text-foreground">Zero Branching Overhead:</strong> Because matrix dimensions are multiples of our block tile size (<span className="font-mono text-xs text-primary">128 × 128</span>), we eliminate every boundary-checking <code className="font-mono text-xs text-primary">if</code> condition from the innermost loop.
              </li>
              <li>
                <strong className="text-foreground">Full Compile-Time Loop Unrolling:</strong> We can unroll our accumulation loops completely (<code className="font-mono text-xs text-primary">#pragma unroll</code>), removing branch prediction penalties and counter increments entirely.
              </li>
              <li>
                <strong className="text-foreground">Tailored Register Allocation:</strong> We budget registers specifically to hit optimal warp occupancy on the Tesla T4 without spilling a single byte to local memory.
              </li>
              <li>
                <strong className="text-foreground">Double-Buffered Software Pipelining:</strong> We ping-pong between dual sets of shared memory and register buffers, allowing the next tile’s memory loads to happen simultaneously with the current tile’s arithmetic.
              </li>
            </ul>

            <p className="pt-1">
              Through the progressive kernel ladder ahead (Kernel 1 through Kernel 6+), you will watch our hand-written kernel climb from single-digit efficiency past 50%, 65%, and right into parity with closed-source cuBLAS. The ceiling is real, but it is not unbreakable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
