"use client"
import { JournalProvider, useJournal } from '@/context/JournalContextRL';
import HeaderHero from '@/components/rl/HeaderHero';
import DayMatrix from '@/components/rl/DayMatrix';
import ProjectsSection from '@/components/rl/ProjectsSection';
import ResourceDumpSection from '@/components/rl/ResourceDumpSection';
import SimulationsSection from '@/components/rl/SimulationsSection';
import FilterBar from '@/components/rl/FilterBar';
import DayCard from '@/components/rl/DayCard';
import DayReaderModal from '@/components/rl/DayReader';
import InteractiveGridworld from '@/components/rl/InteractiveGridWorld';
import InteractiveBandit from '@/components/rl/InteractiveBandit';

function MainContent() {
  const { 
    filteredDays, 
    activeNavPage, 
    addNewDay,  
  } = useJournal();

  return (
    <div className="min-h-screen relative grid-rail bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-400 overflow-x-hidden">
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
                {
                  filteredDays.map((day) => (
                    <DayCard key={day.id} day={day} />
                  ))
                }
              </section>
            </div>
          )}

          {/* ── PAGE 2: ROADMAP (Contains Roadmap Matrix, Aspirational Projects, and Resource Dump) ── */}
          {activeNavPage === 'roadmap' && (
            <div className="space-y-12 animate-in fade-in duration-300">
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

      {/* Modals & Overlays */}
      <DayReaderModal/>
      <InteractiveGridworld />
      <InteractiveBandit />
    </div>
  );
};

export default function RL() {
  return (
    <JournalProvider>
      <MainContent />
    </JournalProvider>
  );
}
