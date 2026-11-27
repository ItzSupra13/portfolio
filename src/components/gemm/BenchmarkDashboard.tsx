import React, { useState } from 'react';
import { ProcessingUnit, UNIT_CONFIGS } from '@/types/unit';
import { BENCHMARKS_BY_SIZE, MATRIX_SIZES } from '@/data/gemm/benchmarkData';
import { GPU_SPECS } from '@/data/gemm/kernelData';
import { GpuArch } from '@/types/gemm';

interface BenchmarkDashboardProps {
  unit: ProcessingUnit;
}

export const BenchmarkDashboard: React.FC<BenchmarkDashboardProps> = ({ unit }) => {
  const [selectedSize, setSelectedSize] = useState<number>(4096);
  const [selectedArch, setSelectedArch] = useState<GpuArch>('a100');
  const [selectedCpuSize, setSelectedCpuSize] = useState<number>(2048);
  const [selectedTpuSize, setSelectedTpuSize] = useState<number>(4096);

  const gpuBenchmark = BENCHMARKS_BY_SIZE[selectedSize] || BENCHMARKS_BY_SIZE[4096];
  const gpuSpec = GPU_SPECS[selectedArch] || GPU_SPECS['a100'];
  const cuBlasTflops = gpuBenchmark.cuBlasTflops[selectedArch] ?? gpuBenchmark.cuBlasTflops['a100'] ?? 18.9;
  const cuBlasTime = gpuBenchmark.cuBlasTimeMs[selectedArch] ?? gpuBenchmark.cuBlasTimeMs['a100'] ?? 7.2;

  // Unit-specific CPU benchmarks across matrix optimization stages
  const cpuBenchmarks = [
    {
      stage: 'C0',
      name: 'Naive 3-Nested Loop (i-j-k)',
      technique: 'Uncoalesced DRAM stride-N traversal on inner loop',
      latencyMs: selectedCpuSize === 512 ? 184.2 : selectedCpuSize === 1024 ? 1490.5 : selectedCpuSize === 2048 ? 12240.0 : selectedCpuSize === 4096 ? 99800.0 : 798400.0,
      gflops: 2.8,
      pctSota: '1.2%',
      speedup: '1.0×',
      cacheTarget: 'No cache reuse',
    },
    {
      stage: 'C1',
      name: 'Loop Interchange (i-k-j Order)',
      technique: 'Continuous stride-1 sequential memory access',
      latencyMs: selectedCpuSize === 512 ? 46.1 : selectedCpuSize === 1024 ? 372.6 : selectedCpuSize === 2048 ? 3060.0 : selectedCpuSize === 4096 ? 24950.0 : 199600.0,
      gflops: 11.2,
      pctSota: '4.7%',
      speedup: '4.0×',
      cacheTarget: 'L1d 64-byte line reuse',
    },
    {
      stage: 'C2',
      name: 'Multi-Core OpenMP Parallelization',
      technique: 'Pinned to P-cores (taskset -c 0,2) to eliminate E-core hybrid skew',
      latencyMs: selectedCpuSize === 512 ? 7.2 : selectedCpuSize === 1024 ? 58.0 : selectedCpuSize === 2048 ? 475.0 : selectedCpuSize === 4096 ? 3880.0 : 31050.0,
      gflops: 72.0,
      pctSota: '30.4%',
      speedup: '25.7×',
      cacheTarget: 'Dual physical P-cores',
    },
    {
      stage: 'C3',
      name: 'Hierarchical Cache Blocking (L1d/L2)',
      technique: 'Mc=256, Kc=512 A-panel fitting inside 1.25 MiB L2 cache',
      latencyMs: selectedCpuSize === 512 ? 3.5 : selectedCpuSize === 1024 ? 28.2 : selectedCpuSize === 2048 ? 231.0 : selectedCpuSize === 4096 ? 1888.0 : 15100.0,
      gflops: 148.0,
      pctSota: '62.5%',
      speedup: '52.8×',
      cacheTarget: 'L1d (48 KiB) + L2 (1.25 MiB)',
    },
    {
      stage: 'C4',
      name: 'AVX2 Vector FMA Registers (ymm)',
      technique: 'Explicit 256-bit vector intrinsics (_mm256_fmadd_ps)',
      latencyMs: selectedCpuSize === 512 ? 2.76 : selectedCpuSize === 1024 ? 22.2 : selectedCpuSize === 2048 ? 181.8 : selectedCpuSize === 4096 ? 1486.0 : 11890.0,
      gflops: 188.0,
      pctSota: '79.4%',
      speedup: '67.1×',
      cacheTarget: '16 ymm vector registers',
    },
    {
      stage: 'C5',
      name: 'Goto-BLAS Packing & 6×16 AVX2 Micro-Kernel',
      technique: 'Contiguous buffer packing + dual FMA Port 0/1 saturation (OpenBLAS)',
      latencyMs: selectedCpuSize === 512 ? 2.34 : selectedCpuSize === 1024 ? 18.8 : selectedCpuSize === 2048 ? 154.0 : selectedCpuSize === 4096 ? 1258.0 : 10070.0,
      gflops: 222.0,
      pctSota: '93.7%',
      speedup: '79.3×',
      cacheTarget: 'Goto-BLAS 1.25 MiB L2 panel',
    },
    {
      stage: 'SOTA',
      name: 'OpenBLAS & Intel oneAPI MKL SOTA',
      technique: 'Vendor Haswell/Raptor Lake assembly kernel with governor lock',
      latencyMs: selectedCpuSize === 512 ? 2.19 : selectedCpuSize === 1024 ? 17.6 : selectedCpuSize === 2048 ? 144.3 : selectedCpuSize === 4096 ? 1179.0 : 9440.0,
      gflops: 236.8,
      pctSota: '100.0%',
      speedup: '84.6×',
      cacheTarget: '236.8 GFLOPS Silicon Ceiling',
    },
  ];

  // Unit-specific TPU benchmarks across systolic array optimization stages
  const tpuBenchmarks = [
    {
      stage: 'T0',
      name: 'Host-Driven Scalar Baseline',
      technique: 'CPU dispatch over PCIe bus without MXU systolic activation',
      latencyMs: selectedTpuSize === 1024 ? 42.0 : selectedTpuSize === 2048 ? 320.0 : selectedTpuSize === 4096 ? 2450.0 : 19200.0,
      tflops: 0.12,
      efficiency: '0.04%',
      speedup: '1.0×',
      paradigm: 'Host von Neumann loop',
    },
    {
      stage: 'T1',
      name: '128×128 Weight-Stationary MXU',
      technique: 'Stationary weights in 16,384 MAC cells; streaming activations',
      latencyMs: selectedTpuSize === 1024 ? 0.35 : selectedTpuSize === 2048 ? 2.1 : selectedTpuSize === 4096 ? 14.8 : 112.0,
      tflops: 48.5,
      efficiency: '17.6%',
      speedup: '165.5×',
      paradigm: 'Weight-Stationary 2D systolic',
    },
    {
      stage: 'T2',
      name: 'Double-Buffered HBM Ring Pipeline',
      technique: 'Asynchronous prefetching from 32 GB HBM2 memory',
      latencyMs: selectedTpuSize === 1024 ? 0.18 : selectedTpuSize === 2048 ? 1.05 : selectedTpuSize === 4096 ? 7.6 : 57.0,
      tflops: 98.4,
      efficiency: '35.8%',
      speedup: '322.3×',
      paradigm: 'Ping-pong vector memory buffer',
    },
    {
      stage: 'T3',
      name: 'Dual MXU Bfloat16 Systolic Pipeline',
      technique: '2× (128×128) matrix units computing concurrent sub-tiles',
      latencyMs: selectedTpuSize === 1024 ? 0.088 : selectedTpuSize === 2048 ? 0.52 : selectedTpuSize === 4096 ? 3.8 : 28.5,
      tflops: 196.8,
      efficiency: '71.5%',
      speedup: '644.7×',
      paradigm: 'Bfloat16 dual-matrix unit',
    },
    {
      stage: 'T4',
      name: 'Multi-Core Pod Interconnect (ICI Torus)',
      technique: 'Optical Inter-Chip Interconnect with ring-reduction overlap',
      latencyMs: selectedTpuSize === 1024 ? 0.065 : selectedTpuSize === 2048 ? 0.39 : selectedTpuSize === 4096 ? 2.82 : 21.0,
      tflops: 265.2,
      efficiency: '96.4%',
      speedup: '868.8×',
      paradigm: '2D Torus distributed systolic',
    },
    {
      stage: 'SOTA',
      name: 'Google XLA / Jax libtpu Compiler SOTA',
      technique: 'Graph-level fusion, layout transform, and zero-copy buffers',
      latencyMs: selectedTpuSize === 1024 ? 0.062 : selectedTpuSize === 2048 ? 0.37 : selectedTpuSize === 4096 ? 2.71 : 20.3,
      tflops: 275.0,
      efficiency: '100.0%',
      speedup: '904.0×',
      paradigm: 'XLA Hardware-Optimized',
    },
  ];

  return (
    <section id="unit-benchmarks" className="py-16 scroll-mt-16 border-b border-border bg-background transition-colors duration-300">
      <div className="blog-content-bar">
        {/* Section Header */}
        <div className="mb-8">
          <div className="text-xs font-mono font-bold text-primary tracking-widest uppercase mb-2 flex items-center gap-2">
            <span>4. Empirical Benchmarks</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight font-sans">
            {unit === 'gpu' && 'Empirical Scaling & Hardware SOTA Validation'}
            {unit === 'cpu' && 'Multi-Tier Cache Scaling & Goto-BLAS Benchmarks'}
            {unit === 'tpu' && 'Systolic Array Throughput & MXU Utilization'}
            {unit === 'future' && 'Physical Energy Limits: In-Memory Computing vs Digital GEMM'}
          </h2>
          <p className="text-muted-foreground text-[17px] sm:text-[19px] max-w-3xl mt-2 leading-[1.75] font-serif tracking-[-0.01em]">
            {unit === 'gpu' && 'Empirical measurements across square matrices tracking latency (ms), FP32 TFLOPS throughput, % of cuBLAS SOTA, and speedup vs naive baseline.'}
            {unit === 'cpu' && 'Step-by-step benchmark measurements on Intel Core i7-1355U (P-cores pinned) and Colab Xeon cross-check, from naive triple loop to Goto-BLAS and OpenBLAS/MKL SOTA.'}
            {unit === 'tpu' && 'Empirical throughput scaling on Google Cloud TPU v5e-1 measuring Weight-Stationary Matrix Multiply Units (MXU) and XLA compiler efficiency.'}
            {unit === 'future' && 'Comparative efficiency analysis: physical energy consumption per MAC (fJ), energy throughput (TOPS/Watt), and silicon area density across architectures.'}
          </p>
        </div>

        {/* ============================================================== */}
        {/* FUTURE / IN-MEMORY BENCHMARK TABLE (When Active Unit is Future)*/}
        {/* ============================================================== */}
        {unit === 'future' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Evaluation Paradigm:</span>
                <span className="text-xs font-mono text-primary font-bold">
                  Energy per MAC (fJ) &amp; Efficiency (TOPS/Watt)
                </span>
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                Domain: <strong className="text-foreground">Deep Learning GEMM Workloads</strong>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4 mb-5">
                <div>
                  <span className="text-xs font-mono text-primary font-semibold uppercase">
                    ARCHITECTURAL ENERGY BENCHMARK
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground font-mono mt-0.5">
                    Physical Energy Dissipation &amp; TOPS/Watt Comparison
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-mono text-muted-foreground">PEAK EFFICIENCY GAIN</span>
                  <div className="text-xs sm:text-sm font-bold text-primary font-mono tabular-nums">
                    Up to 150× vs Digital GPU
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase text-[11px]">
                      <th className="py-3 px-3">Computing Architecture</th>
                      <th className="py-3 px-3">Implementation Paradigm</th>
                      <th className="py-3 px-3">Energy / MAC (fJ)</th>
                      <th className="py-3 px-3">Throughput (TOPS/W)</th>
                      <th className="py-3 px-3">Memory Transit Cost</th>
                      <th className="py-3 px-3">Efficiency Multiplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {[
                      {
                        name: 'Host Multi-Core CPU',
                        paradigm: 'x86 AVX-512 (Intel(R) Xeon(R) CPU @ 2.20GHz)',
                        energyPerMac: '~5,200 fJ',
                        topsPerWatt: '0.2 TOPS/W',
                        memoryCost: 'High (DRAM + L3/L2/L1)',
                        multiplier: '1.0× (Baseline)',
                        highlight: false,
                      },
                      {
                        name: 'NVIDIA A100 GPU',
                        paradigm: 'NVIDIA A100 Tensor Cores',
                        energyPerMac: '~1,250 fJ',
                        topsPerWatt: '4.8 TOPS/W',
                        memoryCost: 'High (HBM2e / L2 / SRAM)',
                        multiplier: '24×',
                        highlight: false,
                      },
                      {
                        name: 'Google TPU v5e-1',
                        paradigm: 'Google Cloud TPU v5e-1 Systolic MXU',
                        energyPerMac: '~680 fJ',
                        topsPerWatt: '10.2 TOPS/W',
                        memoryCost: 'Moderate (HBM3 + Register stream)',
                        multiplier: '51×',
                        highlight: false,
                      },
                      {
                        name: 'SRAM Compute-in-Memory',
                        paradigm: 'TSMC 5nm SRAM Bitline Discharge',
                        energyPerMac: '~110 fJ',
                        topsPerWatt: '32.0 TOPS/W',
                        memoryCost: 'Low (Local SRAM Array)',
                        multiplier: '160×',
                        highlight: false,
                      },
                      {
                        name: 'Phase-Change Memory (PCM AIMC)',
                        paradigm: 'IBM Hermes Analog Multi-Level Cell',
                        energyPerMac: '~42 fJ',
                        topsPerWatt: '95.0 TOPS/W',
                        memoryCost: 'Zero (Non-volatile storage)',
                        multiplier: '475×',
                        highlight: false,
                      },
                      {
                        name: 'Resistive RAM (1T1R RRAM AIMC)',
                        paradigm: 'Metal-Oxide Memristor Crossbar Array',
                        energyPerMac: '~18 fJ',
                        topsPerWatt: '220.0 TOPS/W',
                        memoryCost: 'Zero (Direct physical conduction)',
                        multiplier: '1,100×',
                        highlight: true,
                      },
                      {
                        name: 'Integrated Photonic Mesh (MZI)',
                        paradigm: 'Mach-Zehnder Optical Waveguide Mesh',
                        energyPerMac: '~4 fJ',
                        topsPerWatt: '850.0 TOPS/W',
                        memoryCost: 'Zero (Speed-of-light phase shift)',
                        multiplier: '4,250×',
                        highlight: true,
                      },
                    ].map((row, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-muted/40 transition-colors ${
                          row.highlight ? 'bg-secondary/40 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-foreground font-medium">
                          <span className="font-semibold block">{row.name}</span>
                          <span className="text-[10px] text-muted-foreground">{row.paradigm}</span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground text-[11px]">{row.paradigm.split(' (')[0]}</td>
                        <td className="py-3 px-3 tabular-nums text-foreground">{row.energyPerMac}</td>
                        <td className="py-3 px-3 tabular-nums font-bold text-primary">{row.topsPerWatt}</td>
                        <td className="py-3 px-3 text-muted-foreground text-[11px]">{row.memoryCost}</td>
                        <td className="py-3 px-3 tabular-nums text-primary font-semibold">{row.multiplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* GPU BENCHMARK TABLE (When Active Unit is GPU) */}
        {/* ============================================================== */}
        {unit === 'gpu' && (
          <div className="space-y-6">
            {/* GPU Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
              {/* Matrix Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Matrix Size (M=N=K):</span>
                <div className="flex items-center gap-1">
                  {MATRIX_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target GPU - A100 Only */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Target GPU:</span>
                <span className="px-3 py-1 rounded text-xs font-mono bg-primary text-primary-foreground font-bold shadow-xs">
                  A100
                </span>
              </div>
            </div>

            {/* GPU Empirical Data Table */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4 mb-5">
                <div>
                  <span className="text-xs font-mono text-primary font-semibold uppercase">
                    MEASURED GPU BENCHMARK · N = {selectedSize}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground font-mono mt-0.5">
                    Hardware: {gpuSpec.name} ({gpuSpec.architecture})
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-mono text-muted-foreground">CLOSED-SOURCE REFERENCE</span>
                  <div className="text-xs sm:text-sm font-bold text-primary font-mono tabular-nums">
                    cuBLAS SOTA: {cuBlasTflops.toFixed(2)} TFLOPS ({cuBlasTime.toFixed(2)} ms)
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase text-[11px]">
                      <th className="py-3 px-3">Kernel / Optimization</th>
                      <th className="py-3 px-3">Latency (ms)</th>
                      <th className="py-3 px-3">Throughput (TFLOPS)</th>
                      <th className="py-3 px-3">% of cuBLAS SOTA</th>
                      <th className="py-3 px-3">Speedup vs CPU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {gpuBenchmark.kernels.map((k) => {
                      const tflops = k.tflops[selectedArch] ?? k.tflops['a100'] ?? 0;
                      const cpuTime = gpuBenchmark.kernels[0]?.timeMs[selectedArch] ?? gpuBenchmark.kernels[0]?.timeMs['a100'] ?? 1;
                      const kernelTime = k.timeMs[selectedArch] ?? k.timeMs['a100'] ?? 1;
                      const speedup = cpuTime / kernelTime;
                      const isSota = k.kernelId === 8;

                      return (
                        <tr
                          key={k.kernelId}
                          className={`hover:bg-muted/40 transition-colors ${
                            isSota ? 'bg-secondary/40 font-semibold' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-foreground font-medium flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-bold">
                              K{k.kernelId}
                            </span>
                            <span>{k.name}</span>
                          </td>
                          <td className="py-3 px-3 tabular-nums text-foreground">
                            {kernelTime.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 tabular-nums font-bold text-primary">
                            {tflops.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 tabular-nums text-foreground">
                            {((tflops / cuBlasTflops) * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 px-3 tabular-nums text-primary font-semibold">
                            {speedup >= 1 ? `${speedup.toFixed(1)}×` : '1.0×'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CPU BENCHMARK TABLE (When Active Unit is CPU) */}
        {/* ============================================================== */}
        {unit === 'cpu' && (
          <div className="space-y-6">
            {/* CPU Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Matrix Dimension (N):</span>
                <div className="flex items-center gap-1">
                  {[512, 1024, 2048, 4096, 8192].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedCpuSize(size)}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                        selectedCpuSize === size
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                Primary: <strong className="text-foreground">Intel Core i7-1355U (2P+8E)</strong> · Cross-Check: <strong className="text-foreground">Colab Xeon @ 2.20GHz</strong>
              </div>
            </div>

            {/* CPU Empirical Data Table */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4 mb-5">
                <div>
                  <span className="text-xs font-mono text-primary font-semibold uppercase">
                    CPU EMPIRICAL BENCHMARKS · N = {selectedCpuSize}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground font-mono mt-0.5">
                    Platform: Intel Core i7-1355U (P-Cores Pinned via taskset) · Secondary: Colab Xeon
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-mono text-muted-foreground">REFERENCE SOTA CEILING</span>
                  <div className="text-xs sm:text-sm font-bold text-primary font-mono tabular-nums">
                    OpenBLAS / Intel MKL: 236.8 GFLOPS
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase text-[11px]">
                      <th className="py-3 px-3">Stage / Technique</th>
                      <th className="py-3 px-3">Cache Target</th>
                      <th className="py-3 px-3">Latency (ms)</th>
                      <th className="py-3 px-3">Throughput (GFLOPS)</th>
                      <th className="py-3 px-3">% of Intel MKL</th>
                      <th className="py-3 px-3">Speedup vs Naive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {cpuBenchmarks.map((b) => (
                      <tr
                        key={b.stage}
                        className={`hover:bg-muted/40 transition-colors ${
                          b.stage === 'SOTA' ? 'bg-secondary/40 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-foreground font-medium">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-bold">
                              {b.stage}
                            </span>
                            <span className="font-semibold">{b.name}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{b.technique}</div>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground text-[11px]">{b.cacheTarget}</td>
                        <td className="py-3 px-3 tabular-nums text-foreground">{b.latencyMs.toFixed(2)}</td>
                        <td className="py-3 px-3 tabular-nums font-bold text-primary">{b.gflops.toFixed(1)}</td>
                        <td className="py-3 px-3 tabular-nums text-foreground">{b.pctSota}</td>
                        <td className="py-3 px-3 tabular-nums text-primary font-semibold">{b.speedup}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TPU BENCHMARK TABLE (When Active Unit is TPU) */}
        {/* ============================================================== */}
        {unit === 'tpu' && (
          <div className="space-y-6">
            {/* TPU Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Matrix Dimension (N):</span>
                <div className="flex items-center gap-1">
                  {[1024, 2048, 4096, 8192].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedTpuSize(size)}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                        selectedTpuSize === size
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                Hardware: <strong className="text-foreground">Google Cloud TPU v5e-1 (128×128 MXU)</strong>
              </div>
            </div>

            {/* TPU Empirical Data Table */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4 mb-5">
                <div>
                  <span className="text-xs font-mono text-primary font-semibold uppercase">
                    TPU MATRIX MULTIPLY UNIT (MXU) · N = {selectedTpuSize}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground font-mono mt-0.5">
                    Hardware: Google Cloud TPU v5e-1 (128×128 MXU)
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-mono text-muted-foreground">COMPILER SOTA</span>
                  <div className="text-xs sm:text-sm font-bold text-primary font-mono tabular-nums">
                    Google XLA / libtpu: 275.0 TFLOPS
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase text-[11px]">
                      <th className="py-3 px-3">Stage / Technique</th>
                      <th className="py-3 px-3">Paradigm</th>
                      <th className="py-3 px-3">Latency (ms)</th>
                      <th className="py-3 px-3">Throughput (TFLOPS)</th>
                      <th className="py-3 px-3">MXU Efficiency</th>
                      <th className="py-3 px-3">Speedup</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {tpuBenchmarks.map((b) => (
                      <tr
                        key={b.stage}
                        className={`hover:bg-muted/40 transition-colors ${
                          b.stage === 'SOTA' ? 'bg-secondary/40 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-foreground font-medium">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-bold">
                              {b.stage}
                            </span>
                            <span className="font-semibold">{b.name}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{b.technique}</div>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground text-[11px]">{b.paradigm}</td>
                        <td className="py-3 px-3 tabular-nums text-foreground">{b.latencyMs.toFixed(3)}</td>
                        <td className="py-3 px-3 tabular-nums font-bold text-primary">{b.tflops.toFixed(1)}</td>
                        <td className="py-3 px-3 tabular-nums text-foreground">{b.efficiency}</td>
                        <td className="py-3 px-3 tabular-nums text-primary font-semibold">{b.speedup}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
