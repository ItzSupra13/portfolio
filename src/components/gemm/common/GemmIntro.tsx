import React, { useState } from 'react';
import { Copy, Check, Terminal, Layers, ArrowRight, Lightbulb, Clock, Database, Cpu, Zap, Server } from 'lucide-react';
import { ProcessingUnit } from '@/types/unit';
import { MemoryStrideVisualizer } from './MemoryStrideVisualizer';

interface GemmIntroProps {
  unit?: ProcessingUnit;
}

export const GemmIntro: React.FC<GemmIntroProps> = ({ unit = 'gpu' }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const naiveCode = `void gemm_naive(
  int M, int N, int K, 
  float alpha, const float *A, const float *B,
  float beta, float *C)
{
  for (int row = 0; row < M; row++) {
    for (int col = 0; col < N; col++) {
      float acc = 0.0f;
      for (int k = 0; k < K; ++k) {
        acc += A[row*K+k] * B[k*N+col];
      }
      C[row*N+col] = alpha*acc + beta*C[row*N+col];
    }
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(naiveCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="gemm-intro" className="py-16 scroll-mt-16 border-b border-border bg-card/30 transition-colors duration-300">
      <div className="w-full px-6 sm:px-8 md:pl-[4.5rem] md:pr-8 lg:pl-24 lg:pr-8 xl:pl-[7.5rem] xl:pr-10 box-border max-w-[1240px]">
        
        {/* Editorial Section Number & Header */}
        <div className="mb-4 max-w-[620px] lg:max-w-[680px] xl:max-w-[740px]">
          <div className="text-sm font-mono font-bold text-primary tracking-widest uppercase mb-2 flex items-center gap-2">
            <span>1. The Mathematical Foundation</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground font-sans">
            So what is BLAS exactly?
          </h2>
        </div>

        {/* Narrative Flow: Mathematical Definition (Substack/Blogger Serif Reading Experience) */}
        <div className="space-y-6 sm:space-y-7 text-[17px] sm:text-[19px] text-foreground/90 font-serif leading-[1.75] tracking-[-0.01em]">
          <div className="w-full min-[880px]:max-w-[620px] lg:max-w-[680px] xl:max-w-[740px] space-y-6 sm:space-y-7">
            <p>
              In numerical linear algebra, the BLAS (Basic Linear Algebra Subprograms) specification defines GEMM as performing on <span className="font-mono text-primary font-semibold">O(N³)</span> arithmetic operations (which we later introduce as FLOPS) on <span className="font-mono text-primary font-semibold">O(N²)</span> data elements. The usual formulation computes the scaled matrix product and accumulates it into an existing matrix:
            </p>

          {/* Refined Academic Mathematical Formulation Block */}
          <div className="py-3 px-4 sm:px-8 relative">
            {/* Primary Matrix Formulation */}
            <div className="text-center py-1">
              <div className="inline-flex items-center justify-center font-serif text-2xl sm:text-3xl md:text-[32px] font-semibold text-foreground tracking-wide select-all">
                <span className="font-bold italic mr-1">C</span>
                <span className="text-muted-foreground/80 mx-2">=</span>
                <span className="italic text-primary font-normal">α</span>
                <span className="text-muted-foreground/60 mx-1.5">·</span>
                <span className="text-muted-foreground/70 font-normal">(</span>
                <span className="font-bold italic">A</span>
                <span className="text-muted-foreground/70 mx-1.5">×</span>
                <span className="font-bold italic">B</span>
                <span className="text-muted-foreground/70 font-normal">)</span>
                <span className="text-muted-foreground/80 mx-2">+</span>
                <span className="italic text-primary font-normal">β</span>
                <span className="text-muted-foreground/60 mx-1.5">·</span>
                <span className="font-bold italic">C</span>
              </div>
            </div>

            {/* Matrix Dimensions with bridging text */}
            <div className="pt-3.5 text-center">
              <p className="text-sm sm:text-lg font-serif italic mb-4">
                where the dimensions can be any general:
              </p>
              <div className="text-sm sm:text-lg font-mono flex items-center justify-center flex-wrap gap-x-3 gap-y-1.5">
                <span className="text-foreground/90 font-medium">A ∈ ℝ<sup>M×K</sup></span>
                <span className="text-muted-foreground/40 font-serif">·</span>
                <span className="text-foreground/90 font-medium">B ∈ ℝ<sup>K×N</sup></span>
                <span className="text-muted-foreground/40 font-serif">·</span>
                <span className="text-foreground/90 font-medium">C ∈ ℝ<sup>M×N</sup></span>
                <span className="font-serif">·</span>
                <span className="">scalars α, β ∈ ℝ</span>
              </div>
            </div>
          </div>

          <p>
            In single-precision float execution (<strong className="text-foreground font-semibold">SGEMM</strong>), every floating-point number occupies 32 bits (thus fp32). For a standard square matrix of dimension say {" "}<span className="font-mono text-foreground font-semibold">N = 4096</span>:
          </p>

          <ul className="list-disc pl-5 space-y-2.5 text-base sm:text-lg text-muted-foreground">
            <li>
              The Total floating-point operations: {' '}<span className="font-mono text-foreground text-sm">2 · M · N · K = 2 · (4096)³ ≈ 137.4 GFLOPs</span> (1 multiply + 1 add per inner iteration).
            </li>
            <li>
              So we are working with a raw size of: <span className="font-mono text-foreground text-sm">3 matrices × 4096² × 4 bytes = 201.3 MB</span>.
            </li>
          </ul>

          <h3 className="text-lg sm:text-xl font-bold text-foreground font-sans pt-4 tracking-tight">
            The Naive Triply-Nested Loop &amp; The Stride Bottleneck
          </h3>

          <p>
            The simplest and easiest way of coding the dot-product formulation into code is the classic textbook triple-nested <span className="font-mono text-sm sm:text-base bg-muted px-1.5 py-0.5 rounded">for</span> loop. The only catch? We deal entirely with 1-d array's and using your typical row-major access pattern to optimize the entire thing for memory reads. Below is the standard C implementation (which tbh anyone can write with a bit of tinkering):
          </p>

          {/* Monograph Code Block with Syntax Style - Centered with narrow width */}
          <div className="max-w-lg mx-auto w-full rounded-xl border border-border bg-background/90 overflow-hidden shadow-xs my-6">
            <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border text-xs sm:text-sm font-mono">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground font-semibold">naive.c</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-primary" />
                    <span className="text-primary font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 sm:p-4 text-sm font-mono overflow-x-auto text-foreground/90 leading-relaxed">
              <code>{naiveCode}</code>
            </pre>
          </div>

          <p>
            The sad part is when compiled naively, this loop actually achieves <strong className="text-destructive font-semibold">less than 1% of the hardware peak</strong> on modern processors. The cause? Memory access geometry and how compilers handle it.
          </p>

          <p>
            A quick systems recap! Compilers and hardware prefetchers actually heavily rely on something known as <em>spatial locality</em>, the assumption that if your program accesses memory address <span className="font-mono text-foreground font-semibold">x</span>, it will almost immediately request {" "}<span className="font-mono text-foreground font-semibold">x + 1</span>, <span className="font-mono text-foreground font-semibold">x + 2</span>, and so on. This makes hardware memory hierarchies never load single 4-byte floats in isolation. Instead, cache controllers fetch contiguous 64-byte chunks called <strong>cache lines</strong> (holding 16 consecutive FP32 floats) from DRAM into fast on-chip L1 cache. When code walks memory sequentially, even a single cache miss pays a huge penalty for 16 arithmetic operations. When it doesn't, hardware stalls as follows:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="p-5 rounded-xl bg-card/70 border border-border">
              <div className="text-xs sm:text-base font-bold text-primary mb-1.5">
                Matrix A: Contiguous Access (Stride 1)
              </div>
              <p className="text-sm sm:text-lg text-foreground leading-relaxed">
                As the innermost index <span className="font-mono text-foreground font-semibold">k</span> increments, <span className="font-mono text-foreground">A[row*K+k]</span> steps linearly through adjacent memory addresses. A single 64-byte cache line brings in 16 sequential FP32 floats, yielding near 100% spatial cache hit rates. But such is not the case with Matrix B.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card/70 border border-destructive/30">
              <div className="text-xs sm:text-base font-bold text-destructive mb-1.5">
                Matrix B: Strided Access (Stride N)
              </div>
              <p className="text-sm sm:text-lg text-foreground leading-relaxed">
                As <span className="text-lg font-mono text-foreground">k</span> increments, <span className="font-mono text-foreground">B[k*N+col]</span> jumps by <span className="text-lg font-mono text-foreground">N elements (4N bytes)</span> on every single iteration! For example, say for <span className="text-lg font-mono text-foreground">N = 4096</span>, each step leaps 16 KB ahead, completely thrashing cache lines and incurring compulsory DRAM stalls on every single multiply. This yeilds 0% spatial cache hit rate.
              </p>
            </div>
          </div>

          {/* Interactive Memory Access Geometry Visualizer: Stride-1 vs Stride-N */}
          <MemoryStrideVisualizer />

          {/* ============================================================== */}
          {/* CPU-SPECIFIC HARDWARE DETERMINANTS: Clock Speed, Cache, Cores  */}
          {/* ============================================================== */}
          {unit === 'cpu' && (
            <div className="pt-2 pb-2 space-y-6">
              <div className="border-t border-border/80 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-mono font-bold text-amber-500 tracking-widest uppercase flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-500" />
                    <span>CPU Microarchitecture &amp; Platform Ground Truth</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded border border-border">
                    Primary: i7-1355U (Raptor Lake) · Secondary: Colab Xeon
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground font-sans tracking-tight">
                  The Silicon Triad: What Governs CPU Processing Speed?
                </h3>
                <p className="text-[17px] sm:text-[19px] text-foreground/90 mt-2 leading-[1.75] font-serif tracking-[-0.01em]">
                  Before analyzing the memory wall, we must establish our empirical platform. For a monograph on parallel programming, a single virtualized cloud core cannot carry the CPU half of our investigation. We designate the laptop’s bare-metal <strong className="text-foreground">Intel Core i7-1355U (Raptor Lake)</strong> as the primary testbed—giving us uninhibited access to Linux <span className="font-mono text-xs sm:text-sm">perf stat</span> counters, hardware thread pinning, and frequency governor control—while using the <strong className="text-foreground">Google Colab Xeon (Broadwell-EP)</strong> as an architectural cross-check.
                </p>
              </div>

              {/* Architectural Strategy Callout: Why Laptop Primary vs Colab Cross-Check */}
              <div className="p-5 sm:p-6 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[14.5px] sm:text-[16px] font-serif leading-[1.7] space-y-3">
                <div className="flex items-center gap-2 font-mono font-bold text-amber-500 uppercase text-xs sm:text-sm">
                  <Server className="w-4 h-4" />
                  <span>Empirical Platform Protocol: Bare-Metal Laptop vs. Virtualized Colab</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground leading-relaxed pt-1">
                  <div>
                    <strong className="text-foreground block mb-1">Why Colab Xeon is a Secondary Cross-Check:</strong>
                    Colab allocates a shared KVM guest with only 1 physical core (2 hyperthreads sharing identical FMA units). In an OpenMP parallel ladder, 1 physical core produces flat scaling, concealing loop-parallelization lessons. Furthermore, variable noisy-neighbor hypervisor throttling and non-lockable nominal 2.20 GHz clocks make percentage-of-peak comparisons erratic.
                  </div>
                  <div>
                    <strong className="text-foreground block mb-1">Why Laptop i7-1355U Works (With Care):</strong>
                    It features 2 high-performance P-cores (Golden Cove, 4 threads, AVX2, dual FMA ports, 32 FLOP/cycle) alongside 8 background E-cores. Because the chip has no AVX-512, our custom kernels and vendor BLAS (OpenBLAS &amp; MKL) compete on equal footing with 256-bit AVX2. P-cores have root access for hardware counters, but require locking the CPU performance governor and pinning threads to avoid E-core hybrid skew.
                  </div>
                </div>
              </div>

              {/* 3 Detailed Breakdown Cards */}
              <div className="space-y-4">
                {/* 1. Clock Speed & Recalculated Peak Theoretical FLOPS */}
                <div className="p-5 sm:p-6 rounded-xl bg-card/60 border border-border shadow-xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-muted-foreground uppercase">PILLAR 1</span>
                        <h4 className="text-base sm:text-lg font-bold text-foreground font-sans">
                          Clock Speed &amp; Recalculated Peak Theoretical FLOPS
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-semibold self-start sm:self-auto">
                      AVX2 · 32 FP32 Ops/Cycle/P-Core
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Clock frequency dictates how fast registers toggle states, while Instruction-Level Parallelism (<strong className="text-foreground">ILP</strong>) and SIMD width dictate how much math is completed per cycle. On the Raptor Lake P-core architecture:
                  </p>

                  {/* Mathematical Derivation Box */}
                  <div className="p-4 sm:p-5 rounded-lg bg-background border border-border font-mono text-xs sm:text-sm text-foreground/90 space-y-2.5">
                    <div className="text-amber-500 font-semibold sm:text-sm">
                      Peak FLOP/Cycle (P-Core) = 2 FMA Execution Ports × 8 floats (AVX2 256-bit) × 2 Ops (Multiply + Add) = 32 FLOPs / Cycle
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-2 border-t border-border/50 text-muted-foreground">
                      <div>
                        <span className="text-foreground font-semibold block mb-0.5">Sustained Operating Peak (~3.70 GHz under load):</span>
                        <span>Single P-Core: 3.70 GHz × 32 = <strong className="text-foreground font-bold">118.4 GFLOPs</strong></span><br />
                        <span>Two P-Cores: 2 × 118.4 GFLOPs = <strong className="text-primary font-bold">236.8 GFLOPs (~0.24 TFLOPS)</strong></span>
                      </div>
                      <div>
                        <span className="text-foreground font-semibold block mb-0.5">Max Burst Turbo (5.00 GHz short-window peak):</span>
                        <span>Single P-Core: 5.00 GHz × 32 = <strong className="text-foreground">160.0 GFLOPs</strong></span><br />
                        <span>Two P-Cores: 2 × 160.0 GFLOPs = <strong className="text-foreground font-bold">320.0 GFLOPs (~0.32 TFLOPS)</strong></span>
                      </div>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    <strong className="text-foreground font-medium">Power, Thermals &amp; Governor Tuning:</strong> The i7-1355U operates within a 15-watt base TDP envelope. Without pinning governor profiles, idle cores drop down to 400–1300 MHz, creating cold-start latency dips. Under sustained compute, thermal boundaries settle all-P-core clocks to ~3.7 GHz. We plug into AC power, activate the Linux <span className="font-mono text-xs sm:text-sm bg-muted px-1.5 py-0.5 rounded">performance</span> governor, and record actual final clocks (<span className="font-mono text-xs sm:text-sm">mhz_end</span>) to ensure our %-of-peak numbers are grounded in observed silicon reality.
                  </p>
                </div>

                {/* 2. Cache Memory Hierarchy & Hardware-Specific Blocking */}
                <div className="p-5 sm:p-6 rounded-xl bg-card/60 border border-border shadow-xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-muted-foreground uppercase">PILLAR 2</span>
                        <h4 className="text-base sm:text-lg font-bold text-foreground font-sans">
                          Cache Hierarchy &amp; Hardware-Specific Blocking (i7-1355U vs. Xeon)
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-semibold self-start sm:self-auto">
                      i7 L2: 1.25 MiB vs. Xeon L2: 256 KiB
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    FMA vector instructions process operands in 1 clock cycle (&lt;0.3 ns), whereas un-cached DRAM accesses require &gt;150 cycles (~70–90 ns). Cache hierarchy capacity directly dictates algorithmic blocking parameters:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm font-mono">
                    <div className="p-3.5 rounded-lg bg-background border border-border">
                      <span className="text-amber-500 font-bold block text-sm">L1 Data (P-Core)</span>
                      <div className="text-foreground mt-1 font-semibold text-xs sm:text-sm">48 KiB Private / Core</div>
                      <div className="text-muted-foreground text-[11px] sm:text-xs mt-0.5">Latency: 4–5 cycles (~1.2 ns)</div>
                      <div className="text-foreground/80 text-[11px] sm:text-xs mt-2 pt-2 border-t border-border/50">Holds micro-kernel stream &amp; A panel slice</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-background border border-border">
                      <span className="text-amber-500 font-bold block text-sm">L2 Private (P-Core)</span>
                      <div className="text-foreground mt-1 font-semibold text-xs sm:text-sm">1.25 MiB Private / Core</div>
                      <div className="text-muted-foreground text-[11px] sm:text-xs mt-0.5">Latency: ~14 cycles (~4.0 ns)</div>
                      <div className="text-foreground/80 text-[11px] sm:text-xs mt-2 pt-2 border-t border-border/50">Fits large Goto-BLAS Mc×Kc panels (5× Xeon L2!)</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-background border border-border">
                      <span className="text-amber-500 font-bold block text-sm">L3 Shared LLC</span>
                      <div className="text-foreground mt-1 font-semibold text-xs sm:text-sm">12 MiB Shared LLC</div>
                      <div className="text-muted-foreground text-[11px] sm:text-xs mt-0.5">Latency: ~40–50 cycles (~12 ns)</div>
                      <div className="text-foreground/80 text-[11px] sm:text-xs mt-2 pt-2 border-t border-border/50">Shared across 2 P-cores &amp; 8 E-cores</div>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    <strong className="text-foreground font-medium">Why Tuning is Hardware-Specific:</strong> On our laptop’s i7-1355U, the private L2 cache is a massive <strong className="text-foreground">1.25 MiB</strong> per P-core. By contrast, the Colab Xeon has only <strong className="text-foreground">256 KiB</strong> of private L2 per core. In the Goto-BLAS algorithm, panel dimensions <span className="font-mono text-foreground font-semibold">M_c</span> and <span className="font-mono text-foreground font-semibold">K_c</span> are tuned so that the packed sub-matrix of A fits precisely into L2. A configuration optimal on the i7-1355U (<span className="font-mono text-sm">M_c=256, K_c=512 → 512 KiB</span>) fits comfortably inside the laptop's 1.25 MiB L2, but would cause severe cache evictions on the Xeon’s 256 KiB L2. Comparing both platforms highlights that high-performance GEMM tuning is fundamentally tied to physical silicon cache budgets.
                  </p>
                </div>

                {/* 3. Number of Cores, Thread Pinning & OpenBLAS vs MKL */}
                <div className="p-5 sm:p-6 rounded-xl bg-card/60 border border-border shadow-xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-muted-foreground uppercase">PILLAR 3</span>
                        <h4 className="text-base sm:text-lg font-bold text-foreground font-sans">
                          Core Topology, Thread Pinning &amp; SOTA References
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-semibold self-start sm:self-auto">
                      taskset -c 0,2 · OpenBLAS &amp; MKL
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Analyzing the system via <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">lscpu -e</span> reveals our core allocation strategy:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm font-mono">
                    <div className="p-4 rounded-lg bg-background border border-border space-y-1.5">
                      <span className="text-amber-500 font-bold block text-xs uppercase tracking-wide">Core Topology from lscpu -e</span>
                      <div className="text-foreground font-semibold">CPUs 0–3: P-Cores (Max 5,000 MHz)</div>
                      <div className="text-muted-foreground text-xs leading-relaxed">Core 0 = CPUs 0,1 · Core 1 = CPUs 2,3 (Hyperthreaded pairs sharing FMA ports)</div>
                      <div className="text-foreground font-semibold pt-1">CPUs 4–11: E-Cores (Max 3,700 MHz)</div>
                      <div className="text-muted-foreground text-xs leading-relaxed">8 single-threaded efficiency cores with different microarchitecture</div>
                    </div>
                    <div className="p-4 rounded-lg bg-background border border-border space-y-1.5">
                      <span className="text-amber-500 font-bold block text-xs uppercase tracking-wide">Thread Pinning Protocol</span>
                      <div className="text-foreground font-semibold">Single-Thread: taskset -c 2</div>
                      <div className="text-muted-foreground text-xs leading-relaxed">Pins to Core 1, leaving sibling CPU 3 idle; avoids Core 0 which handles OS interrupts</div>
                      <div className="text-foreground font-semibold pt-1">2-Thread Physical OpenMP: taskset -c 0,2</div>
                      <div className="text-muted-foreground text-xs leading-relaxed">Exactly 1 thread per physical P-core; scales to 0–3 for 4 SMT threads</div>
                    </div>
                  </div>

                  <div className="pt-2 text-base sm:text-lg text-muted-foreground leading-relaxed space-y-2.5">
                    <p>
                      <strong className="text-foreground font-medium">Dual SOTA Benchmarks (OpenBLAS as Primary, MKL as Ceiling):</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-base sm:text-lg text-muted-foreground">
                      <li>
                        <strong className="text-foreground">OpenBLAS (Main Reference):</strong> Open-source, transparent, and reproducible. We can directly inspect its Haswell/Raptor Lake AVX2 assembly micro-kernel—the exact algorithmic pattern we implement in Stage C5. Readers on Arch, Ubuntu, or NumPy can identically reproduce our numbers.
                      </li>
                      <li>
                        <strong className="text-foreground">Intel oneAPI MKL (Proprietary Ceiling):</strong> The gold-standard proprietary BLAS implementation optimized directly by Intel engineers for modern microarchitectures. Plotting MKL as a secondary reference proves how closely our hand-written AVX2 micro-kernel approaches the true silicon ceiling.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Section: Memory-Bound vs. Compute-Bound + Side Note 2 */}
          <div className="flex flex-col min-[880px]:flex-row items-start gap-4 min-[880px]:gap-8 xl:gap-12">
            <div className="w-full min-[880px]:max-w-[620px] lg:max-w-[680px] xl:max-w-[740px] shrink-0 space-y-6 sm:space-y-7">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground font-sans pt-4 tracking-tight">
                The idea of Memory-Bound vs. Compute-Bound 
              </h3>

              <p>
                On modern computing architectures, every numerical kernel operates within one of two distinct execution regimes: it is either <strong className="text-foreground">memory-bound</strong> or <strong className="text-foreground">compute-bound</strong>. Understanding which side of this boundary our algorithm lands greatly benefits us on deciding whether optimizations should focus on memory hierarchy exploitation or raw execution pipeline throughput.
              </p>

              <p>
                In a <strong className="text-foreground">memory-bound regime</strong>, overall execution time is governed entirely by memory and DRAM bus bandwidth. The silicon's arithmetic pipelines (doesn't matter if its CPU ALUs, GPU SM cores, or TPU MMUs) are capable of executing billions or trillions of operations per second, but they spend the majority of cycles just sitting there, starved for operands while the data they need to operate on crawls over off-chip memory buses. In this regime, upgrading processor clocks, or throwing more compute cores at the problem yields absolutely zero performance gain. Contemporary large language model inference workloads are often memory-bound during the decode/output generation stage, when the weights must be loaded once in each forward pass.
              </p>

              <p>
                Conversely, in a <strong className="text-foreground">compute-bound regime</strong>, execution pipelines are limited with arithmetic bandwidth on every core clock cycle. Operands have been staged into fast on-chip storage (such as CPU L1/L2 caches, or GPU SRAM) where each element is reused dozens or hundreds of times before eviction. Memory access latency is next to null, whereas the kernel begins approaching the physical silicon's theoretical peak TFLOPS ceiling. Contemporary large language model inference workloads are often compute-bound during batch prefill/prompt processing, when each weight can be loaded into shared memory once and then used across many tokens.
              </p>

              <p>
                The central challenge of matrix multiplication we will encounter is that un-optimized code begins its life deeply trapped in the memory-bound regime. Yet mathematically, GEMM is one of the few algorithms capable of achieving peak compute-bound throughput. It computes <span className="font-mono text-primary font-semibold">O(N³)</span> operations over only <span className="font-mono text-primary font-semibold">O(N²)</span> data elements, meaning every floating-point number can theoretically be reused <span className="font-mono text-foreground font-semibold text-lg">N</span> times.
              </p>
            </div>

            {/* Side Note 2 */}
            <aside
              aria-label="Side Note 2"
              className="w-full min-[880px]:w-64 lg:w-72 xl:w-80 shrink-0 pt-0 min-[880px]:pt-12"
            >
              <div className="flex items-start gap-2.5 font-serif text-[14px] leading-relaxed text-foreground/85">
                <span className="font-mono text-xs font-bold text-primary shrink-0 select-none pt-0.5">
                  2.
                </span>
                <div className="leading-snug">
                  These regimes have been abstracted from the original roofline model, you can read this{' '}
                  <a
                    href="https://siliconandsoul.substack.com/p/what-does-compute-bound-and-memory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors break-all"
                  >
                    blog
                  </a>
                  {' '}that beautifully paints the full picture independent of processing units.
                </div>
              </div>
            </aside>
          </div>

          {/* Subsection: Scalar Scaling */}
          <div className="w-full min-[880px]:max-w-[620px] lg:max-w-[680px] xl:max-w-[740px] space-y-6 sm:space-y-7">
            <h4 className="text-lg sm:text-xl font-bold text-foreground font-sans tracking-tight pt-2">
              Where MatMul and Scalar Scaling actually differ in this context
            </h4>

            <p>
              Recall the full BLAS specification: <span className="font-mono text-primary font-semibold text-sm">C = α · (A × B) + β · C</span>. Although written as a single algebraic expression, these two terms exhibit radically different operational profiles on our hardware:
            </p>

            <div className="overflow-x-auto rounded-lg border border-border/60 bg-card/40 my-4">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="font-mono border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="py-2.5 px-3">Operation Component</th>
                    <th className="py-2.5 px-3">Algebraic Form</th>
                    <th className="py-2.5 px-3">Computational Complexity</th>
                    <th className="py-2.5 px-3">Memory AccessComplexity</th>
                    <th className="py-2.5 px-3">Hardware Regime</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/60">
                    <td className="py-2.5 px-3 text-foreground font-semibold">Matrix Multiplication</td>
                    <td className="font-mono py-2.5 px-3 text-primary font-semibold">A × B</td>
                    <td className="py-2.5 px-3 text-foreground">O(N³) FLOPs</td>
                    <td className="py-2.5 px-3 text-foreground">O(N²) FLOPs</td>
                    <td className="py-2.5 px-3 text-primary font-semibold">Compute-Bound (when tiled)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-foreground font-semibold">Scalar Scale &amp; Add</td>
                    <td className="font-mono py-2.5 px-3 text-amber-500 font-semibold">α(···) + β·C</td>
                    <td className="py-2.5 px-3 text-foreground">O(N³) FLOPs</td>
                    <td className="py-2.5 px-3 text-foreground">O(N³) FLOPs</td>
                    <td className="py-2.5 px-3 text-amber-500 font-semibold">Strictly Memory-Bound</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              <strong className="text-foreground">Why scalar scaling is strictly memory-bound:</strong> Evaluating <span className="font-mono text-foreground text-sm">β · C</span> requires streaming every element of matrix <span className="font-mono text-foreground">C</span> from global DRAM (4 bytes read), multiplying by <span className="font-mono text-foreground">β</span> (1 op), adding the accumulated dot product (1 op), and writing the result back to DRAM (4 bytes write). That moves 8 bytes of data over the memory bus for every 2 operations. So even if scaling is memory-bound, it adds a very tiny latency after the matrix multiplication is done, especially when considering this is not done in a separate memory pass, but just a small end operation in a thread, specifically on a GPU that is. 
            </p>

            <p>
              For a standard 4096×4096 matrix, the matrix multiplication performs <span className="font-mono text-foreground text-sm">137.4 GFLOPs</span> of computation, while the <span className="font-mono text-foreground">β · C</span> scaling contributes roughly less than <span className="text-lg text-sm font-semibold">0.024% of the total math</span>! Although, letting <span className="font-mono text-primary">β ≠ 0.0</span> adds DRAM traffic, it does not convert the entire kernel into a memory-bound algorithm. 
            </p>
          </div>

          {/* Section: Our Main Focus + Side Note 3 */}
          <div className="flex flex-col min-[880px]:flex-row items-start gap-4 min-[880px]:gap-8 xl:gap-12">
            <div className="w-full min-[880px]:max-w-[620px] lg:max-w-[680px] xl:max-w-[740px] shrink-0 space-y-6 sm:space-y-7">
              <p>
                <strong className="text-foreground">Our Main Focus (α = 1, β = 0):</strong> In production libraries like NVIDIA cuBLAS and Intel oneAPI MKL, non-trivial <span className="font-mono text-foreground">α</span> and <span className="font-mono text-foreground">β</span> scaling are applied directly to the intermediate thread registers where the dot products are accumulated, immediately before threads write their outputs to memory.
              </p>

              <p>
                Therefore, throughout this entire blog and all kernel benchmarks, we set <span className="font-mono text-primary">α = 1.0</span> and <span className="font-mono text-primary">β = 0.0</span> thereby only evaluating the pure <span className="font-mono text-primary font-semibold">C = A × B</span> multiplication. Setting these values strips away alot of memory-bound overheads and uninitialized memory write headache, enabling us to cleanly study and measure the true hardware throughput of the compute-bound processing units.
              </p>
            </div>

            {/* Side Note 3 */}
            <aside
              aria-label="Side Note 3"
              className="w-full min-[880px]:w-64 lg:w-72 xl:w-80 shrink-0 pt-0 min-[880px]:pt-1"
            >
              <div className="flex items-start gap-2.5 font-serif text-[14px] leading-relaxed text-foreground/85">
                <span className="font-mono text-xs font-bold text-primary shrink-0 select-none pt-0.5">
                  3.
                </span>
                <div className="leading-snug">
                  Overheads are a latency category of their own and require special utilities to analyze them, this{' '}
                  <a
                    href="https://horace.io/brrr_intro.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors break-all"
                  >
                    blog
                  </a>
                  {' '}really gets you going with the core.
                </div>
              </div>
            </aside>
          </div>
        </div>

      </div>
    </section>
  );
};
