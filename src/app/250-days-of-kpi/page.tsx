"use client"
import { JournalProvider, useJournal } from '@/context/JournalContextKPI';
import { HeaderHero } from '@/components/kpi/HeaderHero';
import { DayMatrix } from '@/components/kpi/DayMatrix';
import { ProjectsSection } from '@/components/kpi/ProjectsSection';
import { ResourceDumpSection } from '@/components/kpi/ResourceDumpSection';
import { SimulationsSection } from '@/components/kpi/SimulationsSection';
import { FilterBar } from '@/components/kpi/FilterBar';
import { DayCard } from '@/components/kpi/DayCard';
import { InteractiveRoofline } from '@/components/kpi/InteractiveRoofline';
import { InteractiveBankConflict } from '@/components/kpi/InteractiveBankConflict';

function MainContent() {
  const { 
    filteredDays, 
    activeNavPage, 
  } = useJournal();


  return (
    <div className="min-h-screen relative grid-rail bg-background text-foreground selection:bg-lime-400 selection:text-slate-950 overflow-x-hidden wafer-die-pattern">
      {/* Ambient atmosphere with deep forest foundation
      <div className="absolute inset-x-0 top-0 h-[640px] emerald-ambient-glow pointer-events-none" /> */}

      {/* Outer gutter textures from grid system */}
      <div className="hash-zone-l hidden lg:block" />
      <div className="hash-zone-r hidden lg:block" />

      <main className="relative z-10">
        <HeaderHero />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* ── PAGE 1: DAILY LOGBOOK (Default View) ── */}
          {activeNavPage === 'logbook' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section id="journal" aria-label="Journal Filters">
                <FilterBar />
              </section>

              {/* Feed of Days */}
              <section aria-label="Daily Journal Entries" className="space-y-10">
                {filteredDays.length > 0 ? (
                  filteredDays.map((day) => (
                    <DayCard key={day.id} day={day} />
                  ))
                ) : (
                  <div className="py-20 text-center border border-dashed border-border rounded-lg p-8">
                    <p className="text-base text-foreground font-medium font-editorial">
                      No logbook entries match your filters
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ── PAGE 2: ROADMAP (Contains Roadmap Matrix, Aspirational Projects, and Resource Dump) ── */}
          {activeNavPage === 'roadmap' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* 1. Roadmap Matrix Section */}
              <section id="roadmap" aria-labelledby="roadmap-heading" className="relative">
                <DayMatrix />
              </section>

              {/* 2. Target Aspirational Projects (Compact, small only) */}
              <section id="projects" aria-labelledby="projects-heading" className="relative">
                <ProjectsSection />
              </section>

              {/* 3. Resource & Media Study Dump */}
              <section id="resources" aria-labelledby="resources-heading" className="relative">
                <ResourceDumpSection />
              </section>
            </div>
          )}

          {/* ── PAGE 3: SIMULATIONS ── */}
          {activeNavPage === 'simulations' && (
            <div className="animate-in fade-in duration-300">
              <SimulationsSection />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border bg-[#03140e] text-muted-foreground py-12 mt-16 z-10">
        <span className="ch ch-tl hidden md:block" />
        <span className="ch ch-tr hidden md:block" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-foreground font-semibold font-editorial text-sm">
              250 Days of KPI — Kernel Performance & Inference Engineering
            </div>
            <p className="text-muted-foreground text-[11px] font-sans">
              Inspired by{' '}
              <a 
                href="https://pavelsimo.github.io/100-days-of-cuda/index.html" 
                target="_blank" 
                rel="noreferrer"
                className="text-foreground hover:text-emerald-500 underline transition-colors"
              >
                Pavel Simo's 100 Days of CUDA
              </a>
              {' '}and Frontier Kernel Engineering. Covering C++ & CUDA, Nsight profiling, Triton, FlashAttention 1→4, CuTe, Distributed Training, and vLLM Serving.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <InteractiveRoofline />
      <InteractiveBankConflict />
    </div>
  );
};

export default function App() {
  return (
    <JournalProvider>
      <MainContent />
    </JournalProvider>
  );
}
