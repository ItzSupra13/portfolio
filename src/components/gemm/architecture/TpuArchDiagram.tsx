import React, { useState, useEffect } from 'react';
import { Cpu, Play, Pause, RotateCcw, ArrowRight, ArrowDown, Zap, Layers, RefreshCw, Database } from 'lucide-react';

export const TpuArchDiagram: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cycle, setCycle] = useState<number>(0);
  const [activeLevel, setActiveLevel] = useState<'systolic' | 'mxu' | 'vmem' | 'vpu' | 'weight_fifo' | 'hbm'>('systolic');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCycle((prev) => (prev + 1) % 8);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const levels = {
    systolic: {
      name: 'Weight-Stationary 2D Systolic Array Principle',
      capacity: 'Rhythmic systolic flow through 16,384 spatial MAC cells',
      latency: '1 clock cycle per spatial neighbor transfer',
      throughput: '275 TFLOPS peak per TPU v4 core',
      details: 'In a weight-stationary systolic array, weights are preloaded once into local registers inside each cell. Each clock cycle, input activations step horizontally to the right while partial sums accumulate vertically downwards. Data flows through the 2D grid like blood through the heart ("systole"), completely bypassing the register file.',
      gemmImpact: 'Reduces energy per multiply-accumulate operation by >5× compared to general-purpose GPUs, eliminating register read port congestion.',
    },
    mxu: {
      name: '2D Systolic Matrix Multiply Unit (128 × 128 MXU)',
      capacity: '16,384 Multiply-Accumulate (MAC) Processing Elements',
      latency: 'Pipelined single-cycle neighbor transfer',
      throughput: '275 TFLOPS peak (BF16/FP32 accumulation) per core',
      details: 'The primary computational engine of Google TPU v4/v5e. Features 128 inputs from the left and 128 outputs down below.',
      gemmImpact: 'Delivers immense matrix throughput with deterministic software-controlled execution via XLA / Pallas.',
    },
    vmem: {
      name: 'Vector Memory (VMEM / On-Chip SRAM Scratchpad)',
      capacity: '32 MB – 128 MB software-managed high-speed SRAM',
      latency: '~10–15 clock cycles',
      throughput: '> 10 TB/s aggregate on-chip scratchpad bandwidth',
      details: 'Holds tiles of activations, input vectors, and outputs without relying on dynamic hardware cache replacement policies or tag lookups.',
      gemmImpact: 'Direct compiler control via XLA / Pallas ensures zero cache-line thrashing or eviction penalties.',
    },
    vpu: {
      name: 'Vector Processing Unit (VPU / SIMD Engine)',
      capacity: 'Wide SIMD vector pipeline for activations & reductions',
      latency: 'Pipelined execution for activation functions',
      throughput: '~20 TFLOPS FP32 elemental operations',
      details: 'Handles non-linear element-wise operations (GELU, ReLU, Softmax, LayerNorm, bias additions) after the MXU computes the linear GEMM projection.',
      gemmImpact: 'Fuses bias-add and activations directly into the GEMM epilogue pipeline.',
    },
    weight_fifo: {
      name: 'Weight FIFO & DMA Controller',
      capacity: 'Multi-megabyte double-buffered queue',
      latency: 'Pipelined direct memory access',
      throughput: 'Matches MXU tile consumption rate',
      details: 'Streams upcoming weight matrices from HBM into the MXU stationary weight registers while the previous tile executes.',
      gemmImpact: 'Ensures the systolic array never starves for weights between tile steps.',
    },
    hbm: {
      name: 'High Bandwidth Memory (HBM3 Stacked DRAM)',
      capacity: '32 GB – 64 GB per TPU chip',
      latency: '~120–200 ns',
      throughput: 'Up to 1,600 GB/s over 3D stacked silicon',
      details: 'Hosts neural network model parameters, training activations, and optimizer states.',
      gemmImpact: 'High bandwidth enables rapid weight matrix streaming into the on-chip Weight FIFO.',
    },
  };

  const curr = levels[activeLevel];
  const gridRows = 4;
  const gridCols = 4;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
            <Cpu className="w-4 h-4" />
            <span>GOOGLE TPU MICROARCHITECTURE · TPU V4 / V5E ASIC</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mt-0.5">
            2D Systolic Array Matrix Multiply Unit (MXU) &amp; Dataflow
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Complete architectural representation: 128×128 Weight-Stationary MXU, Vector Memory (VMEM), VPU, Weight FIFO, and HBM3.
          </p>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-border self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded bg-primary text-primary-foreground font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Systole'}
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
            Clock: <strong className="text-foreground">T+{cycle}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Complete Spacious Diagram */}
        <div className="lg:col-span-7 bg-background/90 rounded-xl border border-border p-5 space-y-4">
          {/* Phase Header */}
          <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between border-b border-border pb-2">
            <span>DATA-FLOW: HBM3 (1,600 GB/s) → VMEM → WEIGHT FIFO → 128×128 SYSTOLIC MAC GRID</span>
            <span className="text-primary font-bold">
              {cycle % 2 === 0 ? 'Systolic Pulse: Activations →' : 'Systolic Pulse: Partial Sums ↓'}
            </span>
          </div>

          {/* 1. HBM3 Memory Block */}
          <div
            onClick={() => setActiveLevel('hbm')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeLevel === 'hbm'
                ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-foreground">
                  High Bandwidth Memory HBM3 (1,600 GB/s Stacked DRAM)
                </span>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">~120–200 ns</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              32–64 GB Capacity · 4-Channel Interposer · Feeds Weight FIFO &amp; Activation Buffers
            </div>
          </div>

          {/* Data Path Connector */}
          <div className="flex justify-center items-center py-0.5">
            <div className="h-4 w-0.5 bg-primary/40" />
          </div>

          {/* 2. Middle Row: VMEM + Weight FIFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setActiveLevel('vmem')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeLevel === 'vmem'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  Vector Memory (VMEM)
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">&gt;10 TB/s</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                32–128 MB On-Chip SRAM Scratchpad · Activation Tiles &amp; Vectors
              </p>
            </div>

            <div
              onClick={() => setActiveLevel('weight_fifo')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeLevel === 'weight_fifo'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  Weight FIFO &amp; DMA
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">Preload Engine</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Streams upcoming weight matrices directly into stationary PE registers
              </p>
            </div>
          </div>

          {/* Data Path Connector */}
          <div className="flex justify-center items-center py-0.5">
            <div className="h-4 w-0.5 bg-primary/40" />
          </div>

          {/* 3. 2D Systolic Array Matrix Multiply Unit (MXU) Container */}
          <div className="p-4 rounded-xl border border-primary/40 bg-card/80 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Matrix Multiply Unit (MXU) · 128×128 Systolic Array (16,384 MACs)
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Peak: <strong className="text-primary font-bold">275 TFLOPS</strong>
              </span>
            </div>

            {/* Systolic Pulse Indicator */}
            <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Current Systolic Wave:</span>
              <span className="text-primary font-bold">
                Diagonal Wavefront at Cycle T+{cycle} (Cell Distance = {cycle % 7})
              </span>
            </div>

            {/* Representative 4x4 Grid of PEs */}
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-3">
                <span>REPRESENTATIVE 4×4 MAC SLICE OF 128×128 ARRAY:</span>
                <span className="text-primary font-semibold">Activations → | Partial Sums ↓</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                {Array.from({ length: gridRows }).map((_, r) =>
                  Array.from({ length: gridCols }).map((_, c) => {
                    const isActive = (r + c) === (cycle % 7);
                    return (
                      <div
                        key={`pe-${r}-${c}`}
                        onClick={() => setActiveLevel('mxu')}
                        className={`p-2.5 rounded-md border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-secondary/60 border-primary shadow-xs ring-1 ring-primary/50'
                            : 'bg-card border-border hover:border-primary/40'
                        }`}
                      >
                        <div className={`text-[10px] font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                          PE [{r},{c}]
                        </div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">
                          W<sub>{r},{c}</sub> · MAC
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Systolic Dataflow Hierarchy Breakdown */}
            <div
              onClick={() => setActiveLevel('systolic')}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeLevel === 'systolic'
                  ? 'bg-secondary/40 border-primary ring-1 ring-primary/40'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <div className="text-xs font-mono font-bold text-foreground mb-1.5 flex items-center justify-between">
                <span>TPU SYSTOLIC EXECUTION &amp; TILING MAPPING</span>
                <span className="text-[10px] text-primary">Click to inspect</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">WEIGHTS</span>
                  <span className="font-bold text-primary">Stationary in PE</span>
                  <span className="text-[10px] text-muted-foreground block">Zero movement</span>
                </div>
                <div className="p-2 rounded bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">INPUTS (A)</span>
                  <span className="font-bold text-foreground">Stream Right →</span>
                  <span className="text-[10px] text-muted-foreground block">1 PE/cycle</span>
                </div>
                <div className="p-2 rounded bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">OUTPUTS (C)</span>
                  <span className="font-bold text-primary">Accumulate Down ↓</span>
                  <span className="text-[10px] text-muted-foreground block">1 PE/cycle</span>
                </div>
                <div className="p-2 rounded bg-card border border-border">
                  <span className="text-muted-foreground block text-[10px]">POST-OPS</span>
                  <span className="font-bold text-foreground">VPU Pipeline</span>
                  <span className="text-[10px] text-muted-foreground block">Fused GELU/bias</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Technical Inspector for selected Level */}
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
              The Weight-Stationary Systolic Rhythm:
            </div>
            <p className="leading-relaxed">
              In a weight-stationary 2D systolic array, matrix weights are pre-loaded once into PEs. Each cycle, activations move one step right while partial sums move one step down. By eliminating register writebacks and instruction decoders for every MAC, TPUs achieve unrivaled computational density.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
