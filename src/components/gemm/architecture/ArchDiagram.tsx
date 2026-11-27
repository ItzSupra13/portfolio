import React from 'react';
import { ProcessingUnit, UNIT_CONFIGS } from '@/types/unit';
import { CpuArchDiagram } from './CpuArchDiagram';
import { GpuArchDiagram } from './GpuArchDiagram';
import { TpuArchDiagram } from './TpuArchDiagram';
import { FutureArchDiagram } from './FutureArchDiagram';

interface ArchDiagramProps {
  unit: ProcessingUnit;
}

export const ArchDiagram: React.FC<ArchDiagramProps> = ({ unit }) => {
  const config = UNIT_CONFIGS[unit];

  return (
    <section id="architecture" className="py-14 scroll-mt-16 border-b border-border bg-background transition-colors duration-300">
      <div className="blog-content-bar">
        <div className="mb-8">
          <div className="text-lg font-mono font-bold text-primary tracking-widest uppercase mb-2 flex items-center gap-2">
            <span>2. Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground font-sans">
            Architecture, Memory Heirarchy &amp; it's Limits
          </h2>
          <p className="text-muted-foreground text-[17px] sm:text-[19px] max-w-3xl mt-2 leading-[1.75] font-serif tracking-[-0.01em]">
            {config.description} Explore the interactive silicon hierarchy below to inspect execution pipelines, cache topologies, and data staging paths.
          </p>
        </div>

        {/* Dynamic Architecture Display */}
        {unit === 'cpu' && <CpuArchDiagram />}
        {unit === 'gpu' && <GpuArchDiagram />}
        {unit === 'tpu' && <TpuArchDiagram />}
        {unit === 'future' && <FutureArchDiagram />}
      </div>
    </section>
  );
};
