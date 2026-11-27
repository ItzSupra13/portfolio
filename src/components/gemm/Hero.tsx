import React from 'react';
import { ProcessingUnit, UNIT_CONFIGS } from '@/types/unit';
import { Calendar, Clock } from 'lucide-react';

interface HeroProps {
  unit: ProcessingUnit;
  onSelectKernel?: (id: number) => void;
  onExploreArchitecture: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  unit,
}) => {
  const config = UNIT_CONFIGS[unit];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamic headings tailored to the selected unit
  const dynamicHeadings: Record<ProcessingUnit, { title: React.ReactNode; subtitle: string }> = {
    gpu: {
      title: (
        <>
          Making MatMul go BRRR on{' '}
          <span className="text-primary underline decoration-primary/40 underline-offset-8">
            GPU
          </span>
        </>
      ),
      subtitle:
        'Step-by-step kernel engineering from naive global memory reads to matching 98.4% of closed-source cuBLAS SOTA on modern NVIDIA hardware.',
    },
    cpu: {
      title: (
        <>
          Making MatMul go BRRR on{' '}
          <span className="text-primary underline decoration-primary/40 underline-offset-8">
            CPU
          </span>
        </>
      ),
      subtitle:
        'From a single-threaded CPU loop to matching OpenBLAS. We discuss P-core thread pinning, L2 cache blocking, AVX2 dual FMA pipelines, and Goto-BLAS panel packing on (my) Raptor Lake silicon.',
    },
    tpu: {
      title: (
        <>
          Making MatMul go BRRR on{' '}
          <span className="text-primary underline decoration-primary/40 underline-offset-8">
            TPU
          </span>
        </>
      ),
      subtitle:
        'Explore hardware-native matrix computation with Google TPU systolic arrays: zero-overhead weight-stationary dataflows, 128×128 MAC tiles, and bfloat16 vector throughput.',
    },
    future: {
      title: (
        <>
          Making MatMul go BRRR on{' '}
          <span className="text-primary underline decoration-primary/40 underline-offset-8">
            Future?
          </span>
        </>
      ),
      subtitle:
        'Escape the von Neumann digital memory wall. We attempt to explore Analog In-Memory Computing (AIMC) where memristors and resistive crossbar arrays compute matrix multiplication in O(1) (crazy timings) using Ohm’s and Kirchhoff’s laws.',
    },
  };

  const currentContent = dynamicHeadings[unit];

  return (
    <article id="overview" className="relative pt-8 pb-12 border-b border-border bg-background transition-colors duration-300">
      {/* Subtle blog ambient glow */}
      <div 
        className="absolute top-0 left-1/4 -translate-x-1/2 w-[640px] h-[280px] opacity-10 pointer-events-none blur-3xl rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.accentColor} 0%, transparent 70%)`
        }}
      />

      <div className="w-full px-6 sm:px-8 md:pl-[4.5rem] md:pr-8 lg:pl-24 lg:pr-8 xl:pl-[7.5rem] xl:pr-10 box-border">
        <div className="flex flex-col min-[880px]:flex-row items-start gap-3 sm:gap-4 min-[880px]:gap-8 xl:gap-12 max-w-[1240px]">
          {/* Main Hero Article Column */}
          <div className="w-full min-[880px]:max-w-[620px] lg:max-w-[680px] xl:max-w-[740px] shrink-0">
            {/* Top of Hero: Author, Publish Date, and Reading Time */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-border/70 text-xs sm:text-sm font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Author:</span>
                <span className="text-foreground font-semibold font-mono text-xs sm:text-sm">Supratim Chakraborty</span>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-sm font-mono">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>November 23, 2026</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>42 min read</span>
                </div>
              </div>
            </div>

            {/* Dynamic Blog Article Title that changes with activeUnit */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground leading-[1.2] font-sans">
                {currentContent.title}
              </h1>
              <p className="text-[17px] sm:text-[19px] text-muted-foreground mt-3 leading-[1.7] font-serif tracking-[-0.01em] text-balance">
                {currentContent.subtitle}
              </p>
            </div>

            {/* Editorial Lead Paragraphs with clean spacing */}
            <div className="space-y-5">
              <p className="text-[17px] sm:text-[19px] text-foreground/90 leading-[1.75] font-serif font-normal tracking-[-0.01em]">
                General Matrix Multiplication (<strong className="font-semibold text-foreground">GEMM</strong>) is the computational backbone of modern scientific computing, ranging from deep neural networks to attention mechanisms. Understanding how to optimize it reveals more about the architecture and performance of your CPU/GPU than we can fathom. While mathematically straightforward with <span className="font-mono text-primary font-semibold">O(N³)</span> arithmetic operations, translating this into near-peak hardware performance demands designing execution algorithms more than meets the eye, with mostly physical silicon constraints.
              </p>
              
              <p className="text-[17px] sm:text-[19px] text-foreground/90 leading-[1.75] font-serif font-normal tracking-[-0.01em]">
                In this interactive blog, we try to dissect the progression from first describing what's the actual issue with our naive triple-nested loops we all know of from our Algorithms-101 course, to near-peak performance to (sometimes) surpassing the <strong className="text-foreground">vendor SOTA</strong> across modern <strong className="text-foreground">CPUs</strong>, <strong className="text-foreground">GPUs</strong>, <strong className="text-foreground">TPUs</strong>. There's only 2 requirements for faster implementations, utilizing the chip to the fullest across it's memory heirarchy and registers, and the humane hunger to make everything as optimized as possible.
              </p>
            </div>
          </div>

          {/* Sidenotes column (Positioned comfortably lower on large screens, minimal top spacing on small screens) */}
          <aside
            aria-label="Side Notes"
            className="w-full min-[880px]:w-64 lg:w-72 xl:w-80 shrink-0 pt-0 min-[880px]:pt-40 lg:pt-44 xl:pt-48"
          >
            {/* Sidenotes header with bottom bar */}
            <div className="pb-2 mb-3.5 border-b border-border/70">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Side Notes
              </span>
            </div>

            <ol className="space-y-3.5 font-serif text-[14px] leading-relaxed text-foreground/85">
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-primary shrink-0 select-none pt-0.5">
                  1.
                </span>
                <div className="leading-snug">
                  The benchmark code its respective colab (just for T4) can be found in this{' '}
                  <a
                    href="https://github.com/ItzSupra13/sgemm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors break-all"
                  >
                    repository
                  </a>
                </div>
              </li>
            </ol>
          </aside>
        </div>
      </div>
    </article>
  );
};
