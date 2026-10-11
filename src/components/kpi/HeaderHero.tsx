import React from 'react';
import { useJournal } from '@/context/JournalContextKPI';
import { 
  Github, 
  Edit3, 
  Plus, 
  Download, 
  Sun, 
  Moon,
  BookOpen,
  Map,
  Cpu,
  Terminal,
  Activity,
} from 'lucide-react';

export const HeaderHero: React.FC = () => {
  const { 
    userProfile, 
    stats, 
    projects,
    resources,
    setIsProfileModalOpen, 
    addNewDay, 
    setIsExportModalOpen, 
    theme, 
    toggleTheme,
    activeNavPage,
    setActiveNavPage
  } = useJournal();

  const progressPercent = Math.min(100, Math.round((stats.completedDays / 250) * 100));

  return (
    <header className="relative border-b border-border/80 pt-6 pb-6">
      {/* Subtle emerald & lemongrass crosshairs at container corners */}
      <span className="ch ch-tl hidden md:block" />
      <span className="ch ch-tr hidden md:block" />
      <span className="ch ch-bl hidden md:block" />
      <span className="ch ch-br hidden md:block" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Control Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border/60">
          {/* Unboxed Metadata (Zero-Pill Discipline with Lemongrass & Emerald Accents) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="inline-flex items-center gap-1.5 font-bold tracking-tight text-lime-400">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              250 DAYS OF KPI
            </span>
            <span aria-hidden="true" className="opacity-30">/</span>
            <span className="text-foreground/80 font-medium">KERNEL PERFORMANCE & INFERENCE</span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span>Est. {userProfile.startDate}</span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span className="text-foreground font-medium">{userProfile.authorName}</span>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="text-muted-foreground hover:text-lime-400 transition-colors p-0.5 inline-flex items-center cursor-pointer"
              title="Edit author name and mission statement"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            {userProfile.githubUrl && (
              <>
                <span aria-hidden="true" className="opacity-30">·</span>
                <a
                  href={userProfile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-300 transition-colors inline-flex items-center gap-1 underline underline-offset-2"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
                </a>
              </>
            )}
          </div>

          {/* Controls: Theme, Export, Log Today */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border/80 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-lime-300" /> : <Moon className="w-3.5 h-3.5 text-emerald-700" />}
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted border border-border/80 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={addNewDay}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 border border-lime-400 rounded-lg transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Entry</span>
            </button>
          </div>
        </div>

        {/* Editorial Title & Overview Statement */}
        <div className="space-y-4 max-w-4xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase font-medium text-lime-400 bg-lime-400/10 border border-lime-400/25 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(190,242,100,0.15)]">
              <Terminal className="w-3 h-3 text-lime-400" />
              <span>A First-Principles Systems & Hardware Journey</span>
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground leading-[1.08]">
              250 Days of KPI <span className="font-light italic text-muted-foreground text-3xl sm:text-4xl lg:text-[2.6rem] block sm:inline sm:ml-2">— Kernel Performance & Inference Engineering</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
            {userProfile.goal}
          </p>
        </div>

        {/* Academic Curriculum Timeline & Milestone Strip */}
        <div className="mt-8 pt-6 border-t border-border/70 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-foreground font-semibold flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-lime-400" />
                <span>Trajectory: {stats.completedDays} / 250 days documented</span>
              </span>
              <span className="text-lime-400 font-bold bg-lime-400/10 border border-lime-400/25 px-1.5 py-0.5 rounded text-[11px]">
                {progressPercent}%
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
              <span className="text-slate-200 font-semibold">{stats.completedDays} completed</span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span className="text-slate-300 font-semibold">{stats.inProgressDays} in progress</span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span>{stats.algorithmsCount} kernels coded</span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span>{stats.papersCount} references cited</span>
            </div>
          </div>

          {/* Calibrated Milestone Progress Bar with Concrete Emerald & Lemongrass */}
          <div className="relative w-full h-2.5 bg-muted/60 rounded-full overflow-hidden flex border border-border/40 p-[1px]">
            <div
              className="h-full bg-lime-400 transition-all duration-500 rounded-full"
              style={{ width: `${(stats.completedDays / 250) * 100}%` }}
            />
            <div
              className="h-full bg-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${(stats.inProgressDays / 250) * 100}%` }}
            />
          </div>

          {/* Milestone markers along ruler for 250 days (6 phases) with clean neutral hover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[10px] font-mono text-muted-foreground pt-1 border-b border-border/40 pb-4">
            <div className="hover:text-slate-100 transition-colors">01 C++ & CUDA (W1–5)</div>
            <div className="hover:text-slate-100 transition-colors">36 Perf Eng (W6–10)</div>
            <div className="hover:text-slate-100 transition-colors">71 Frontier Kernels (W11–17)</div>
            <div className="hover:text-slate-100 transition-colors">121 Dist Train (W18–23)</div>
            <div className="hover:text-slate-100 transition-colors">161 vLLM Serve (W24–30)</div>
            <div className="text-left sm:text-right hover:text-slate-100 transition-colors">211 Portfolio & Loop (W31–36)</div>
          </div>
        </div>

        {/* Badge Navigation (Paged Quick Nav - Centered with Concrete Lemongrass & Emerald Accents) */}
        <div className="mt-7 pt-1 flex justify-center">
          <nav 
            aria-label="Section navigation"
            className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl border border-emerald-500/25 bg-card/85 backdrop-blur-md font-mono text-xs shadow-[0_4px_28px_rgba(4,24,18,0.3)]"
          >
            {/* 1. Daily Logbook Badge Tab */}
            <button
              type="button"
              onClick={() => setActiveNavPage('logbook')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeNavPage === 'logbook'
                  ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-lime-400/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Daily Logbook</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeNavPage === 'logbook' 
                  ? 'bg-slate-950/25 text-slate-950' 
                  : 'bg-lime-400/10 text-lime-400 border border-lime-400/25'
              }`}>
                {stats.completedDays}
              </span>
            </button>

            {/* 2. Roadmap Badge Tab (Contains Roadmap Matrix, Aspirational Projects, and Resource Dump) */}
            <button
              type="button"
              onClick={() => setActiveNavPage('roadmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeNavPage === 'roadmap'
                  ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-lime-400/20'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Roadmap & Projects</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeNavPage === 'roadmap' 
                  ? 'bg-slate-950/25 text-slate-950' 
                  : 'bg-lime-400/10 text-lime-400 border border-lime-400/25'
              }`}>
                {projects.length} proj · {resources.length} dump
              </span>
            </button>

            {/* 3. Simulations Badge Tab */}
            <button
              type="button"
              onClick={() => setActiveNavPage('simulations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeNavPage === 'simulations'
                  ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-lime-400/20'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Silicon Labs</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeNavPage === 'simulations' 
                  ? 'bg-slate-950/25 text-slate-950' 
                  : 'bg-lime-400/10 text-lime-400 border border-lime-400/25'
              }`}>
                2 Labs
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
