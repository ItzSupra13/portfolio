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
import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export const HeaderHero: React.FC = () => {
  const {
    stats,
    projects,
    resources,
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
            <span>Started on 12/10/2026</span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <a href={"https://github.com/ItzSupra13/portfolio"} target="_blank" className="hover:text-foreground transition-colors inline-flex items-center gap-1 underline underline-offset-2">
              <FaGithub className="w-3 h-3" />
              <span>GitHub</span>
            </a>
            <span aria-hidden="true" className="opacity-40">·</span>
            <a href={"https://github.com/ItzSupra13/portfolio"} target="_blank" className="hover:text-foreground transition-colors inline-flex items-center gap-1 underline underline-offset-2">
              <FaXTwitter className="w-3 h-3" />
              <span>AsterDev</span>
            </a>
          </div>
        </div>

        {/* Editorial Title & Overview Statement */}
        <div className="space-y-4 max-w-4xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3 text-[11px] font-mono tracking-widest uppercase font-medium text-lime-400 bg-lime-400/10 border border-lime-400/25 mb-3 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(190,242,100,0.15)]">
              <Terminal className="w-3 h-3 text-lime-400" />
              <span>A First-Principles Systems & Hardware Journey</span>
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground leading-[1.08]">
              250 Days of KPI <span className="font-light italic text-muted-foreground text-3xl sm:text-4xl lg:text-[2.6rem] block sm:inline sm:ml-2">— Kernel, & Inference Engineering</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
            Transitioning from mid-level Python & ML to entry/associate ML Systems & GPU Kernel Engineer
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${activeNavPage === 'logbook'
                ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-lime-400/20'
                }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Daily Logbook</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeNavPage === 'logbook'
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${activeNavPage === 'roadmap'
                ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-lime-400/20'
                }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Roadmap & Projects</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeNavPage === 'roadmap'
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${activeNavPage === 'simulations'
                ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-lime-400/20'
                }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Silicon Labs</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeNavPage === 'simulations'
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
