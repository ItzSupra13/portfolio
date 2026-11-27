import React from 'react';
import { ProcessingUnit, UNIT_CONFIGS } from '@/types/unit';
import { BookOpen, ChevronRight } from 'lucide-react';

export interface TocEntry {
  id: string;
  number: string;
  title: string;
}

// Unit-dependent Table of Contents configurations
// Clean, minimal, blog-authentic outline without AI-style tags or subheadings
export const UNIT_TOC_CONFIGS: Record<ProcessingUnit, TocEntry[]> = {
  gpu: [
    {
      id: 'gemm-intro',
      number: '1',
      title: 'The Mathematical Foundation',
    },
    {
      id: 'architecture',
      number: '2',
      title: 'GPU Microarchitecture and how CUDA works alongside it',
    },
    {
      id: 'kernels',
      number: '3',
      title: 'Progressive Dissection of CUDA Kernels',
    },
    {
      id: 'unit-benchmarks',
      number: '4',
      title: 'Empirical GPU Benchmarks & cuBLAS SOTA Parity',
    },
  ],
  cpu: [
    {
      id: 'gemm-intro',
      number: '1',
      title: 'The Mathematical Foundation & Compute Regimes',
    },
    {
      id: 'architecture',
      number: '2',
      title: 'Host CPU Microarchitecture & Cache Hierarchies',
    },
    {
      id: 'kernels',
      number: '3',
      title: 'Progressive CPU Function Optimization (C0 → C4)',
    },
    {
      id: 'unit-benchmarks',
      number: '4',
      title: 'Empirical CPU Benchmarks & Intel MKL Parity',
    },
  ],
  tpu: [
    {
      id: 'gemm-intro',
      number: '1',
      title: 'The Mathematical Foundation & Compute Regimes',
    },
    {
      id: 'architecture',
      number: '2',
      title: 'Google TPU Systolic Array (MXU) Architecture',
    },
    {
      id: 'kernels',
      number: '3',
      title: 'Progressive TPU Systolic Optimization (T0 → T4)',
    },
    {
      id: 'unit-benchmarks',
      number: '4',
      title: 'TPU Systolic Throughput & XLA Scaling',
    },
  ],
  future: [
    {
      id: 'gemm-intro',
      number: '1',
      title: 'The Mathematical Foundation & Compute Regimes',
    },
    {
      id: 'architecture',
      number: '2',
      title: 'Post-von Neumann Resistive Crossbars',
    },
    {
      id: 'future-monograph',
      number: '3',
      title: 'In-Memory Analog Physics: Ohm & Kirchhoff Laws',
    },
    {
      id: 'unit-benchmarks',
      number: '4',
      title: 'Physical Energy & Efficiency Limits',
    },
  ],
};

interface TableOfContentsProps {
  unit: ProcessingUnit;
  onNavigate?: (sectionId: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  unit,
  onNavigate,
}) => {
  const config = UNIT_CONFIGS[unit];
  const entries = UNIT_TOC_CONFIGS[unit] || UNIT_TOC_CONFIGS.gpu;

  const handleScroll = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 border-b border-border bg-background transition-colors duration-300">
      <div className="blog-content-bar-centered">
        <nav aria-label="Table of contents" className="py-1">
          {/* Header Bar - merged to background without card container */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-sm sm:text-base font-mono font-medium text-foreground tracking-tight">
                Table of Contents on a {config.shortLabel}
              </h2>
            </div>
          </div>

          {/* Clean Editorial List merged to background: text white only on hover, > colored on hover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            {entries.map((item) => (
              <button
                key={item.id + item.number}
                onClick={() => handleScroll(item.id)}
                className="w-full text-left py-2 px-2.5 rounded-md hover:bg-muted/40 transition-colors cursor-pointer group flex items-baseline justify-between gap-2"
              >
                <div className="flex items-baseline gap-2.5 min-w-0">
                  <span className="text-sm font-mono text-foreground/60 group-hover:text-muted-foreground shrink-0 select-none transition-colors">
                    {item.number}.
                  </span>
                  <span className="text-sm sm:text-base font-normal text-foreground group-hover:text-white transition-colors font-serif truncate">
                    {item.title}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
              </button>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
};
