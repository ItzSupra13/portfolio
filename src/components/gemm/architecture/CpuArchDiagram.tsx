import React, { useState, useEffect } from 'react';
import { Cpu, Play, Pause, RotateCcw, Zap, Layers, Server, ArrowDown, Shield } from 'lucide-react';

export const CpuArchDiagram: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cycle, setCycle] = useState<number>(0);
  const [activeSubsystem, setActiveSubsystem] = useState<'gotoblas' | 'avx' | 'ports' | 'l1d' | 'l2' | 'l3' | 'ddr5'>('gotoblas');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCycle((prev) => (prev + 1) % 6);
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const subsystems = {
    gotoblas: {
      name: 'Goto-BLAS Cache Staging Hierarchy (Mc, Kc, Nc Tiles)',
      capacity: 'Multi-level buffer packing tailored to L1d (48 KiB), L2 (1.25 MiB), and LLC (12 MiB)',
      latency: 'Continuous streaming with zero DRAM latency stalls',
      throughput: 'Near 95%+ of theoretical CPU hardware roofline',
      details: 'Kazushige Goto demonstrated that GEMM on CPUs achieves near-peak efficiency by packing Matrix A into a contiguous buffer fitting inside L2 (Mc × Kc panel, e.g. 256 × 512 floats = 512 KiB on i7-1355U), while Matrix B is packed into L3. The inner kernel computes on a 6×16 micro-tile held in 16 AVX2 ymm vector registers.',
      gemmImpact: 'Eliminates non-contiguous stride-N cache misses and ensures dual 256-bit FMA execution ports are never starved.',
    },
    avx: {
      name: 'AVX2 Vector Register File (ymm0–ymm15)',
      capacity: '16 architectural 256-bit registers (512 bytes of vector state)',
      latency: '1 CPU clock cycle (<0.3 ns at ~3.7–5.0 GHz)',
      throughput: '2 × 256-bit FMA/cycle = 32 FP32 operations/cycle per P-core',
      details: 'Holds micro-kernel accumulators (12 ymm registers for 6×16 tile) plus 2 registers for B vectors and 2 for broadcasted A scalars across unrolled K-iterations with zero register spilling.',
      gemmImpact: 'Executing outer products in ymm registers keeps the dual FMA pipelines 100% saturated.',
    },
    ports: {
      name: 'P-Core Execution Ports & Dual FMA Pipelines (Port 0 & Port 1)',
      capacity: 'Raptor Lake P-core superscalar out-of-order execution engine',
      latency: '4-cycle FMA pipeline latency (fully pipelined, 1/cycle throughput)',
      throughput: 'Dual 256-bit FMA (Port 0 + Port 1) + Dual 256-bit Loads (Port 2 + Port 3)',
      details: 'The superscalar P-core issues two 256-bit vector FMAs AND two 256-bit vector loads simultaneously every cycle, achieving 32 FP32 ops/cycle.',
      gemmImpact: 'Loads from L1d are completely hidden behind ongoing FMA math on ymm registers.',
    },
    l1d: {
      name: 'L1 Data Cache (Private 8-Way Associative)',
      capacity: '48 KiB per P-core (8-way associative, 64-byte cache lines)',
      latency: '4–5 CPU clock cycles (~1.2 ns)',
      throughput: '2 × 64-byte loads/cycle (~300+ GB/s per P-core)',
      details: 'Holds the innermost micro-tile of Matrix A and streams vector columns of Matrix B into ymm registers.',
      gemmImpact: 'Provides the massive local bandwidth needed to feed dual 256-bit vector FMA units continuously.',
    },
    l2: {
      name: 'Private L2 Cache (i7-1355U: 1.25 MiB vs. Xeon: 256 KiB)',
      capacity: '1.25 MiB private per P-core on i7-1355U (vs 256 KiB on Colab Xeon)',
      latency: '14 CPU clock cycles (~4 ns)',
      throughput: '~150 GB/s per P-core',
      details: 'Dedicated private cache per core. Caches the primary sub-panel of Matrix A (Mc × Kc tile) for Goto-BLAS algorithm. The 1.25 MiB capacity allows fitting a large 512 KiB panel without eviction.',
      gemmImpact: 'Blocks Matrix A into L2 so it is reused across all columns of Matrix B with zero DRAM thrashing.',
    },
    l3: {
      name: 'Shared L3 Last-Level Cache (LLC)',
      capacity: '12 MiB shared LLC on laptop i7-1355U',
      latency: '40–50 CPU clock cycles (~12 ns)',
      throughput: '~120 GB/s aggregate ring bandwidth',
      details: 'Shared across 2 Performance cores and 8 Efficiency cores. Holds the wide panel of Matrix B (Kc × Nc tile) shared by all multi-threaded workers.',
      gemmImpact: 'Amortizes external DRAM traffic across all active CPU threads.',
    },
    ddr5: {
      name: 'Dual-Channel LPDDR5 / DDR5 Memory Subsystem',
      capacity: '16 GB – 64 GB system memory',
      latency: '60–90 ns (~200+ CPU cycles)',
      throughput: '76.8 GB/s peak across dual memory channels',
      details: 'Connected via Integrated Memory Controller (IMC). High latency penalty if data is accessed with uncoalesced strides.',
      gemmImpact: 'Packing matrices into contiguous memory buffers is mandatory to eliminate stride-N cache line misses.',
    },
  };

  const curr = subsystems[activeSubsystem];

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
            <Cpu className="w-4 h-4" />
            <span>INTEL CORE i7-1355U (RAPTOR LAKE P-CORES) · AVX2 &amp; COLAB XEON CROSS-CHECK</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-0.5">
            Core Execution Ports, Cache Hierarchy &amp; Dual-Channel Memory
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Primary testbed: 2 Performance cores (AVX2 dual FMA ports, 16 ymm registers, 48 KiB L1d, 1.25 MiB private L2, 12 MiB L3) + secondary Colab Xeon cross-check.
          </p>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-border self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded bg-primary text-primary-foreground font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Flow'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCycle(0);
            }}
            className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-muted-foreground px-1 tabular-nums">
            Step: <strong className="text-foreground">{cycle + 1}</strong>/6
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Complete Spacious Diagram (Clean HTML + Flexbox/Grid for Zero Text Clipping) */}
        <div className="lg:col-span-7 bg-background/90 rounded-xl border border-border p-5 space-y-4">
          {/* Phase Header */}
          <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between border-b border-border pb-2">
            <span>PIPELINE: DUAL-CH DDR5 (76.8 GB/s) → 12MB L3 → 1.25MB L2 → 48KB L1D → DUAL AVX2 FMA</span>
            <span className="text-primary font-bold">
              {cycle === 0 && '1. Dual-Channel DDR5 Burst'}
              {cycle === 1 && '2. 12 MB Shared LLC Panel'}
              {cycle === 2 && '3. 1.25 MiB L2 Private Panel'}
              {cycle === 3 && '4. 48 KiB L1d Dual 64B Stream'}
              {cycle === 4 && '5. ymm Vector Register Load'}
              {cycle === 5 && '6. Dual Port FMA (32 FLOPs/cyc)'}
            </span>
          </div>

          {/* 1. System DDR5 Memory Subsystem Block */}
          <div
            onClick={() => setActiveSubsystem('ddr5')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeSubsystem === 'ddr5'
                ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-foreground">
                  System Memory: Dual-Channel LPDDR5/DDR5 (76.8 GB/s)
                </span>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">~200 cycles latency</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Integrated Memory Controller (IMC) · 2× 32-bit subchannels · Holds raw A, B, and C matrices
            </div>
          </div>

          {/* Data Path Connector */}
          <div className="flex justify-center items-center py-0.5">
            <div className="h-4 w-0.5 bg-primary/40" />
          </div>

          {/* 2. Shared L3 Cache on 2D Mesh Interconnect */}
          <div
            onClick={() => setActiveSubsystem('l3')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeSubsystem === 'l3'
                ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Shared L3 Last-Level Cache (12 MiB Shared LLC)
                </span>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">~45 cycles · ~120 GB/s</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Shared across 2 P-cores (CPUs 0-3) and 8 E-cores (CPUs 4-11) · Stores Panel of Matrix B (Kc × Nc)
            </div>
          </div>

          {/* Data Path Connector */}
          <div className="flex justify-center items-center py-0.5">
            <div className="h-4 w-0.5 bg-primary/40" />
          </div>

          {/* 3. CPU Core 0 Container (Tall, Roomy, Complete) */}
          <div className="p-4 rounded-xl border border-primary/40 bg-card/80 space-y-3.5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-foreground">
                  P-Core 1 (CPU 2) · Pinned via taskset -c 0,2
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Peak: <strong className="text-primary font-bold">32 FP32 ops/cycle</strong>
              </span>
            </div>

            {/* Dedicated L2 Cache */}
            <div
              onClick={() => setActiveSubsystem('l2')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeSubsystem === 'l2'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  Dedicated L2 Cache · 1.25 MiB Private (vs 256 KiB on Xeon)
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">14 cycles · 16-way</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Holds Matrix A sub-panel (Mc × Kc tile, 512 KiB) for Goto-BLAS caching algorithm with zero eviction.
              </p>
            </div>

            {/* Dedicated L1 Data Cache */}
            <div
              onClick={() => setActiveSubsystem('l1d')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeSubsystem === 'l1d'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  L1 Data Cache · 48 KiB Private
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">4–5 cycles · Dual 64B Ports</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Streams 128 bytes/cycle directly to Port 2 &amp; Port 3 Load AGUs to feed AVX2 registers without bubbles.
              </p>
            </div>

            {/* AVX2 Vector Register File */}
            <div
              onClick={() => setActiveSubsystem('avx')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeSubsystem === 'avx'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  AVX2 Vector Register File (ymm0–ymm15)
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">16 Regs · 1 cycle</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                16 architectural 256-bit registers (8 floats each). Holds 12 accumulator registers for 6×16 tile + 2 for B + 2 for A.
              </p>
            </div>

            {/* Execution Ports & SIMD Units (Spacious, tall cards, no text overflow) */}
            <div
              onClick={() => setActiveSubsystem('ports')}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                activeSubsystem === 'ports'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className="text-xs font-mono font-bold text-foreground mb-2.5 flex items-center justify-between">
                <span>P-CORE SUPERSCALAR EXECUTION PORTS (AVX2 DUAL-FMA)</span>
                <span className="text-[10px] text-primary font-mono">Click to inspect</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px] font-mono">
                <div className="p-2.5 min-h-[82px] rounded-md bg-card border border-primary/50 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-primary font-bold block text-[10px] tracking-wide">PORT 0</span>
                    <span className="font-bold text-foreground text-xs block mt-0.5">256-bit FMA</span>
                  </div>
                  <span className="text-[10px] text-primary/90 block mt-1">16 FP32 ops/cyc</span>
                </div>
                <div className="p-2.5 min-h-[82px] rounded-md bg-card border border-primary/50 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-primary font-bold block text-[10px] tracking-wide">PORT 1</span>
                    <span className="font-bold text-foreground text-xs block mt-0.5">256-bit FMA</span>
                  </div>
                  <span className="text-[10px] text-primary/90 block mt-1">16 FP32 ops/cyc</span>
                </div>
                <div className="p-2.5 min-h-[82px] rounded-md bg-card border border-border text-center flex flex-col justify-between">
                  <div>
                    <span className="text-muted-foreground font-bold block text-[10px] tracking-wide">PORTS 2 &amp; 3</span>
                    <span className="font-bold text-foreground text-xs block mt-0.5">Dual 256b Load</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-1">64 B/cycle (L1d)</span>
                </div>
                <div className="p-2.5 min-h-[82px] rounded-md bg-card border border-border text-center flex flex-col justify-between">
                  <div>
                    <span className="text-primary font-bold block text-[10px] tracking-wide">COLAB CROSS</span>
                    <span className="font-bold text-foreground text-xs block mt-0.5">Xeon 2.20GHz</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-1">256KB L2 · 1 Core</span>
                </div>
              </div>
            </div>

            {/* 4. Goto-BLAS Cache Packing Decomposition (Tall, spacious, clear) */}
            <div
              onClick={() => setActiveSubsystem('gotoblas')}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                activeSubsystem === 'gotoblas'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className="text-xs font-mono font-bold text-foreground mb-2.5 flex items-center justify-between">
                <span>GOTO-BLAS CACHE STAGING TILES (L3/L2/L1/REGS MAPPING)</span>
                <span className="text-[10px] text-primary font-mono">Click to inspect</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className="p-2.5 min-h-[82px] rounded-md bg-card border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">L3 PANEL (B)</span>
                    <span className="font-bold text-foreground text-xs mt-0.5 block">Kc × Nc Tile</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">Packed buffer in LLC</span>
                </div>
                <div className="p-2.5 min-h-[82px] rounded-md bg-card border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">L2 PANEL (A)</span>
                    <span className="font-bold text-primary text-xs mt-0.5 block">Mc × Kc Tile</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">1.25 MiB L2 resident</span>
                </div>
                <div className="p-2.5 min-h-[82px] rounded-md bg-card border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">L1 STREAM</span>
                    <span className="font-bold text-foreground text-xs mt-0.5 block">Mr × Kc Block</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">Continuous stream</span>
                </div>
                <div className="p-2.5 min-h-[82px] rounded-md bg-card border border-border flex flex-col justify-between">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">REGS MICRO-TILE</span>
                    <span className="font-bold text-primary text-xs mt-0.5 block">6 × 16 (ymm)</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">12 accumulators</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Technical Inspector for selected Subsystem */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-background border border-border">
            <div className="text-[11px] font-mono text-primary font-semibold uppercase mb-1">
              SUBSYSTEM SPECIFICATION
            </div>
            <h4 className="text-base font-bold text-foreground font-mono mb-3">
              {curr.name}
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">CAPACITY:</span>
                <span className="text-foreground font-bold">{curr.capacity}</span>
              </div>
              <div className="p-2.5 rounded bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">LATENCY:</span>
                <span className="text-primary font-bold">{curr.latency}</span>
              </div>
              <div className="p-2.5 rounded bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">THROUGHPUT:</span>
                <span className="text-foreground font-bold">{curr.throughput}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed space-y-2.5">
              <div>
                <strong className="text-foreground block mb-0.5">Architectural Details:</strong>
                {curr.details}
              </div>
              <div>
                <strong className="text-primary block mb-0.5">GEMM Optimization Impact:</strong>
                {curr.gemmImpact}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/30 border border-border text-xs text-muted-foreground space-y-2">
            <div className="font-mono text-primary font-semibold text-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              The Goto-BLAS CPU Cache Staging Principle:
            </div>
            <p className="leading-relaxed">
              Kazushige Goto demonstrated that near-peak CPU GEMM is achieved by packing sub-matrices into contiguous buffers tailored to fit exactly into L1, L2, and L3 caches. This guarantees that vector execution units on Port 0 and Port 1 never stall waiting for DDR5 DRAM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
