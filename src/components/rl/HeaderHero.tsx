import { useJournal } from '@/context/JournalContextRL';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import {
  BookOpen,
  Map,
  Cpu
} from 'lucide-react';

export default function HeaderHero() {
  const {
    stats,
    projects,
    resources,
    activeNavPage,
    setActiveNavPage
  } = useJournal();

  const progressPercent = Math.min(100, Math.round((stats.completedDays / 100) * 100));

  return (
    <header className="relative border-b border-border/80 pt-6 pb-6">
      {/* Subtle crosshairs at container corners */}
      <span className="ch ch-tl hidden md:block" />
      <span className="ch ch-tr hidden md:block" />
      <span className="ch ch-bl hidden md:block" />
      <span className="ch ch-br hidden md:block" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Control Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border/60">
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>Started on 1-10-2026</span>
            <span aria-hidden="true" className="opacity-40">·</span>
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

        {/* Title */}
        <div className="max-w-4xl mx-auto">
          <h1 className="editorial-title text-center font-editorial text-4xl sm:text-5xl lg:text-[4rem] font-bold tracking-tight leading-[1.08]">
            100 Days of RL
          </h1>
        </div>

        {/* Trajectory */}
        <div className="trajectory mt-8">
          <div className="trajectory-head">
            <span className="trajectory-title">
              Trajectory: {stats.completedDays} / 100 days documented
              <span className="pct">({progressPercent}%)</span>
            </span>
            <div className="stats">
              <span className="stat"><b>{stats.completedDays}</b>completed</span>
              <span className="stat"><b>{stats.inProgressDays}</b>in progress</span>
              <span className="stat"><b>{stats.algorithmsCount}</b>algorithms coded</span>
              <span className="stat"><b>{stats.papersCount}</b>papers read</span>
            </div>
          </div>

          <div
            className="trajectory-bar"
            role="progressbar"
            aria-valuenow={stats.completedDays}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ "--progress": `${14}%` } as React.CSSProperties}
          />
          <div className="trajectory-scale" aria-hidden="true">
            <span>DAY 01</span><span>25</span><span>50</span><span>75</span><span>DAY 100</span>
          </div>
        </div>



      </div>

      {/* Badge Navigation (Paged Quick Nav) */}
      <div className="mt-6 pt-2 flex justify-center">
        <nav
          aria-label="Section navigation"
          className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl border border-border bg-muted/30 font-mono text-xs shadow-sm"
        >
          {/* 1. Daily Logbook Badge Tab */}
          <button
            type="button"
            onClick={() => setActiveNavPage('logbook')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${activeNavPage === 'logbook'
              ? 'bg-foreground text-background font-semibold shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Daily Logbook</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeNavPage === 'logbook'
              ? 'bg-background/20 text-background'
              : 'bg-muted text-muted-foreground'
              }`}>
              {stats.completedDays}
            </span>
          </button>

          {/* 2. Roadmap Badge Tab (Contains Roadmap Matrix, Aspirational Projects, and Resource Dump) */}
          <button
            type="button"
            onClick={() => setActiveNavPage('roadmap')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${activeNavPage === 'roadmap'
              ? 'bg-foreground text-background font-semibold shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Roadmap & Projects</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeNavPage === 'roadmap'
              ? 'bg-background/20 text-background'
              : 'bg-muted text-muted-foreground'
              }`}>
              {projects.length} proj · {resources.length} dump
            </span>
          </button>

          {/* 3. Simulations Badge Tab */}
          <button
            type="button"
            onClick={() => setActiveNavPage('simulations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${activeNavPage === 'simulations'
              ? 'bg-foreground text-background font-semibold shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulations</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeNavPage === 'simulations'
              ? 'bg-background/20 text-background'
              : 'bg-muted text-muted-foreground'
              }`}>
              2 Labs
            </span>
          </button>
        </nav>
      </div>
    </header >
  );
};
