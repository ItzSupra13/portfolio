import React, { useState } from 'react';
import { ProcessingUnit, UNIT_CONFIGS } from '@/types/unit';
import { UNIT_KERNEL_STAGES } from '@/data/gemm/kernelData';
import { Terminal, Copy, Check, ChevronRight, ChevronLeft, TrendingUp, CheckCircle, BookOpen } from 'lucide-react';
import { BankConflictVisualizer } from './BankConflictVisualizer';

interface KernelDeepDiveProps {
  unit: ProcessingUnit;
  selectedKernelId: number;
  onSelectKernel: (id: number) => void;
}

export const KernelDeepDive: React.FC<KernelDeepDiveProps> = ({
  unit,
  selectedKernelId,
  onSelectKernel,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const kernels = UNIT_KERNEL_STAGES[unit] || UNIT_KERNEL_STAGES.gpu;
  if (kernels.length === 0) {
    return null;
  }

  // Ensure selectedKernelId is mapped to the corresponding kernel index
  const currentIndex = kernels.findIndex((k) => k.id === selectedKernelId);
  const validIndex = currentIndex !== -1 ? currentIndex : 0;
  const kernel = kernels[validIndex] || kernels[0];
  const prevKernel = validIndex > 0 ? kernels[validIndex - 1] : null;
  const nextKernel = validIndex < kernels.length - 1 ? kernels[validIndex + 1] : null;

  const prefix = kernel.codePrefix || (unit === 'cpu' ? 'C' : unit === 'tpu' ? 'T' : 'K');
  const maxThroughput = Math.max(...kernels.map((k) => k.tflopsA100 || 0.01));
  const throughputGain = prevKernel ? (kernel.tflopsA100 - prevKernel.tflopsA100) : 0;

  const getKernelFileName = (k: typeof kernel, currentUnit: ProcessingUnit): string => {
    const ext = k.language === 'cpp' ? 'cpp' : k.language === 'python' ? 'py' : 'cu';
    const pfx = k.codePrefix || (currentUnit === 'cpu' ? 'c' : currentUnit === 'tpu' ? 't' : 'k');
    const cleanSlug = k.slug.replace(/[^a-zA-Z0-9_]/g, '_');
    return `sgemm_${pfx.toLowerCase()}${k.id}_${cleanSlug}.${ext}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(kernel.cudaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sectionTitles: Record<ProcessingUnit, { title: string; subtitle: string; sotaLabel: string }> = {
    gpu: {
      title: 'Progressive CUDA Kernel Optimization (K1 → K8)',
      subtitle: 'A step-by-step code walkthrough of the 8 GPU optimization stages. Take your time to understand the exact CUDA C++ kernels and architectural decisions that propel throughput from 0.06 to 31.2 TFLOPS.',
      sotaLabel: 'cuBLAS Target: 31.2 TFLOPS',
    },
    cpu: {
      title: 'Progressive CPU Function Optimization (C0 → C4)',
      subtitle: 'A step-by-step walkthrough of the five host CPU optimization stages. Master loop interchange for unit stride locality, OpenMP multi-core thread scaling, hierarchical L1/L2 cache-line blocking, and AVX-512 FMA vector register micro-kernels.',
      sotaLabel: 'Intel oneAPI MKL Target: 666 GFLOPS',
    },
    tpu: {
      title: 'Progressive TPU Systolic Kernel Optimization (T0 → T4)',
      subtitle: 'A step-by-step walkthrough of the five TPU systolic optimization stages. Explore 128×128 matrix tile alignment, weight-stationary MAC dataflows, double-buffered VMEM prefetch pipelines, and Pallas/XLA compiler fusion.',
      sotaLabel: 'Google XLA Target: 275 TFLOPS',
    },
    future: {
      title: 'Analog In-Memory Computing Foundations',
      subtitle: 'Physical memristive crossbar dynamics where matrix multiplication executes through Ohm’s and Kirchhoff’s laws.',
      sotaLabel: 'Physical Limit',
    },
  };

  const lineNumberColorByUnit: Record<ProcessingUnit, string> = {
    gpu: 'text-emerald-400/60',
    cpu: 'text-amber-400/65',
    tpu: 'text-purple-300/65',
    future: 'text-cyan-400/60',
  };

  const activeMeta = sectionTitles[unit] || sectionTitles.gpu;

  return (
    <section id="kernels" className="py-16 scroll-mt-16 border-b border-border bg-background transition-colors duration-300">
      <div className="blog-content-bar">
        
        {/* Section Header (Dynamic for selected unit) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-sm font-mono font-bold text-primary tracking-widest uppercase mb-2 flex items-center gap-2">
              <span>3. Progressive {unit.toUpperCase()} Optimization</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight font-sans">
              {activeMeta.title}
            </h2>
            <p className="text-muted-foreground text-[17px] sm:text-[19px] max-w-3xl mt-2 leading-[1.75] font-serif tracking-[-0.01em]">
              {activeMeta.subtitle}
            </p>
          </div>

          {/* Prev / Next Kernel Navigation */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => prevKernel && onSelectKernel(prevKernel.id)}
              disabled={!prevKernel}
              className="px-3.5 py-1.5 rounded-md bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <span className="text-xs sm:text-sm font-mono text-muted-foreground px-1">
              {prefix}{kernel.id} / {prefix}{kernels[kernels.length - 1].id}
            </span>
            <button
              onClick={() => nextKernel && onSelectKernel(nextKernel.id)}
              disabled={!nextKernel}
              className="px-3.5 py-1.5 rounded-md bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Kernel Selection Stage Strip (Minimal, background-integrated) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar border-b border-border/50">
          {kernels.map((k) => (
            <button
              key={k.id}
              onClick={() => onSelectKernel(k.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-mono whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                k.id === kernel.id
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {prefix}{k.id}: {k.slug}
            </button>
          ))}
        </div>

        {/* Selected Kernel Blog Article (Containerless, authentic editorial flow) */}
        <article className="space-y-8">
          {/* Header & Performance Metrics */}
          <div className="pb-5 border-b border-border/60">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3 text-xs sm:text-sm font-mono text-muted-foreground">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight font-sans">
                {kernel.title}
              </h3>

              {/* Key Metrics Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono">
                <div>
                  Speedup:{' '}
                  <strong className="text-primary font-bold">
                    {(kernel.speedupVsbase ?? kernel.speedupVsCpu ?? 1.0).toFixed(1)}×
                  </strong>
                </div>
                <div>
                  SOTA Parity:{' '}
                  <strong className="text-foreground font-bold">
                    {kernel.percentCuBlas.toFixed(1)}%
                  </strong>
                </div>
              </div>
            </div>

            <p className="text-[17px] sm:text-[19px] text-muted-foreground mt-2 max-w-4xl leading-[1.75] font-serif tracking-[-0.01em]">
              {kernel.subtitle}
            </p>
          </div>

          {/* THE APPROACH (Put ABOVE the Code with proper font color and size) */}
          <div className="space-y-4 pt-2">
            <h4 className="text-lg sm:text-xl font-bold text-foreground font-sans tracking-tight">
              The Approach
            </h4>
            <div className="space-y-4 text-[17px] sm:text-[19px] text-foreground/90 leading-[1.75] font-serif tracking-[-0.01em]">
              {kernel.explanationMarkdown.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Main Kernel Implementation Code Block */}
          <div>
            <div className="rounded-xl overflow-hidden border border-border bg-background shadow-xs">
              {/* File Name Header Bar with Copy Feature */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border text-xs sm:text-sm font-mono">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span>{getKernelFileName(kernel, unit)}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-muted-foreground hover:text-foreground px-3 py-1 rounded bg-background border border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code Contents with VS Code style slender dynamic line numbers */}
              <div className="overflow-x-auto max-h-[540px] text-xs sm:text-sm font-mono leading-relaxed py-2 bg-background">
                <table className="w-full border-collapse">
                  <tbody>
                    {kernel.cudaCode.trimEnd().split('\n').map((line, idx) => (
                      <tr key={idx} className="hover:bg-muted/15 transition-colors">
                        <td className={`w-9 sm:w-11 pl-2.5 sm:pl-3 pr-2.5 text-right font-normal select-none text-[11px] sm:text-xs tabular-nums border-r border-border/30 align-top ${lineNumberColorByUnit[unit] || 'text-muted-foreground/60'}`}>
                          {idx + 1}
                        </td>
                        <td className="pl-3 sm:pl-4 pr-4 whitespace-pre text-foreground/90 font-mono align-top">
                          {line || '\u00A0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Transposed Diagnostic Summary: Key Technique -> Divider -> Bottleneck Solved -> Divider -> Remaining Bottleneck */}
          <div className="rounded-xl bg-card/40 border border-border/80 p-5 sm:p-6 divide-y divide-border/60">
            <div className="pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1 font-semibold">
                Key Technique
              </span>
              <p className="text-foreground font-serif text-[15px] sm:text-[17.5px] leading-[1.75] tracking-[-0.01em]">
                {kernel.keyTechnique}
              </p>
            </div>
            <div className="py-4">
              <span className="text-xs font-mono uppercase tracking-wider text-primary block mb-1 font-semibold">
                Bottleneck Solved
              </span>
              <p className="text-foreground font-serif text-[15px] sm:text-[17.5px] leading-[1.75] tracking-[-0.01em]">
                {kernel.bottleneckSolves}
              </p>
            </div>
            <div className="pt-4">
              <span className="text-xs font-mono uppercase tracking-wider text-destructive/90 block mb-1 font-semibold">
                Remaining Bottleneck
              </span>
              <p className="text-foreground font-serif text-[15px] sm:text-[17.5px] leading-[1.75] tracking-[-0.01em]">
                {kernel.remainingBottleneck}
              </p>
            </div>
          </div>

          {/* Interactive Lab Component (Bank Conflict Simulator for GPU Kernel 6) - Moved Above Scaling */}
          {unit === 'gpu' && kernel.id === 6 && (
            <div className="pt-2">
              <BankConflictVisualizer />
            </div>
          )}

          {/* Performance Scaling Graph Placeholder for this Kernel (Matrix Size vs GFLOPs) */}
          {/* <div className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h4 className="text-sm sm:text-base font-mono font-bold text-foreground">
                    Performance Scaling: Matrix Size vs. GFLOPs
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-serif">
                  Empirical execution throughput trajectory across square matrix sizes (N = 512 to 8192)
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground self-start sm:self-auto bg-muted/50 px-2.5 py-0.5 rounded border border-border/60">
                {prefix}{kernel.id} Empirical Curve
              </span>
            </div>

            {kernel.performanceGraph?.imageUrl ? (
              <div className="rounded-xl border border-border overflow-hidden bg-background">
                <img
                  src={kernel.performanceGraph.imageUrl}
                  alt={kernel.performanceGraph.alt || `Performance graph for ${kernel.title}`}
                  className="w-full h-auto object-contain max-h-[360px]"
                />
                {kernel.performanceGraph.caption && (
                  <p className="p-2.5 text-xs sm:text-sm text-center text-muted-foreground font-mono bg-card/60 border-t border-border">
                    {kernel.performanceGraph.caption}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/80 bg-background/50 p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-muted/60 border border-border flex items-center justify-center text-muted-foreground mb-2.5">
                  <TrendingUp className="w-5 h-5 text-primary/70" />
                </div>
                <div className="text-sm font-mono font-semibold text-foreground">
                  Performance Benchmark Graph Placeholder
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mt-1 font-serif">
                  Empirical plot of matrix dimension <span className="font-mono text-foreground font-semibold">N ∈ [512, 1024, 2048, 4096, 8192]</span> versus sustained throughput (<span className="font-mono text-primary font-semibold">GFLOPs</span>) for {kernel.title}.
                </p>
                <span className="mt-2.5 text-xs font-mono text-muted-foreground/60 bg-card px-2.5 py-0.5 rounded border border-border/50">
                  Figure placeholder · Image graph will be rendered here
                </span>
              </div>
            )}
          </div> */}

          {/* Optimization Trajectory Bar across current unit's kernels */}
          <div className="p-5 rounded-xl border border-border bg-card/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs sm:text-sm font-mono font-semibold text-foreground">
                Optimization Trajectory for {unit.toUpperCase()}
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
                {prevKernel && throughputGain > 0 && (
                  <span className="px-2 py-0.5 rounded bg-secondary text-primary font-semibold">
                    +{throughputGain.toFixed(2)} vs {prefix}{prevKernel.id}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {activeMeta.sotaLabel}
                </span>
              </div>
            </div>

            {/* Performance Progress Bar for Current Stage */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-foreground">
                  {prefix}{kernel.id}: {kernel.title}
                </span>
                <span className="font-bold text-primary tabular-nums">
                  {unit === 'cpu' && kernel.throughputGflops
                    ? `${kernel.throughputGflops.toFixed(1)} GFLOPS (${kernel.percentCuBlas.toFixed(1)}% of MKL)`
                    : `${kernel.tflopsA100.toFixed(2)} / ${maxThroughput.toFixed(1)} TFLOPS (${kernel.percentCuBlas.toFixed(1)}% of SOTA)`}
                </span>
              </div>
              <div className="w-full h-3 bg-background rounded-full overflow-hidden p-0.5 border border-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.max(2, Math.min(100, (kernel.tflopsA100 / maxThroughput) * 100))}%` }}
                />
              </div>
            </div>

            {/* Trajectory Progression Chart: All Stages for Active Unit */}
            <div className="p-4 rounded-lg bg-background border border-border">
              <div className="text-xs font-mono text-muted-foreground uppercase mb-3 flex items-center justify-between">
                <span>{unit.toUpperCase()} Optimization Stages ({prefix}{kernels[0].id} → {prefix}{kernels[kernels.length - 1].id})</span>
                <span className="text-primary font-semibold hidden sm:inline">Click any stage to inspect</span>
              </div>
              <div className={`grid gap-2 ${kernels.length <= 5 ? 'grid-cols-5' : 'grid-cols-3 sm:grid-cols-9'}`}>
                {kernels.map((k, idx) => {
                  const isCurrent = idx === validIndex;
                  const isPast = idx < validIndex;
                  const barHeightPct = Math.max(8, (k.tflopsA100 / maxThroughput) * 100);

                  return (
                    <button
                      key={k.id}
                      onClick={() => onSelectKernel(k.id)}
                      className={`p-2 rounded-md border text-center transition-all cursor-pointer flex flex-col justify-end min-h-[85px] ${
                        isCurrent
                          ? 'bg-secondary/70 border-primary ring-1 ring-primary'
                          : isPast
                          ? 'bg-card/90 border-border hover:border-primary/50'
                          : 'bg-card/40 border-border/50 text-muted-foreground hover:border-border'
                      }`}
                    >
                      <div className="w-full bg-muted/60 rounded-xs h-10 flex items-end justify-center mb-1.5 p-0.5">
                        <div
                          className={`w-full rounded-xs transition-all ${
                            isCurrent ? 'bg-primary' : isPast ? 'bg-primary/50' : 'bg-muted-foreground/30'
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-mono font-bold block ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {prefix}{k.id}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground tabular-nums truncate">
                        {unit === 'cpu' && k.throughputGflops
                          ? `${k.throughputGflops.toFixed(0)} GF`
                          : k.tflopsA100 >= 1
                          ? `${k.tflopsA100.toFixed(1)} TF`
                          : `${(k.tflopsA100 * 1000).toFixed(0)} GF`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
