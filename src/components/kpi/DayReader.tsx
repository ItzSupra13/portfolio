"use client"
import React, { useEffect, useState } from 'react';
import { useJournal } from '@/context/JournalContextKPI';
import { DayStatus } from '@/types/journal';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Edit3, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  Code2,
  Lightbulb,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  Clock,
  Terminal,
  Layers
} from 'lucide-react';

export const DayReaderModal: React.FC = () => {
  const { 
    activeReaderDay, 
    setActiveReaderDay, 
    days, 
    toggleStar, 
    setEditingDay, 
    setActiveLab,
    updateDay 
  } = useJournal();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeReaderDay) return;
      if (e.key === 'Escape') {
        setActiveReaderDay(null);
      } else if (e.key === 'ArrowLeft') {
        // Prev day
        const idx = days.findIndex(d => d.id === activeReaderDay.id);
        if (idx > 0) setActiveReaderDay(days[idx - 1]);
      } else if (e.key === 'ArrowRight') {
        // Next day
        const idx = days.findIndex(d => d.id === activeReaderDay.id);
        if (idx < days.length - 1) setActiveReaderDay(days[idx + 1]);
      } else if (e.key === 'e' || e.key === 'E') {
        // If not typing in input
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const dayToEdit = activeReaderDay;
          setActiveReaderDay(null);
          setEditingDay(dayToEdit);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReaderDay, days, setActiveReaderDay, setEditingDay]);

  if (!activeReaderDay) return null;

  const currentIndex = days.findIndex(d => d.id === activeReaderDay.id);
  const prevDay = currentIndex > 0 ? days[currentIndex - 1] : null;
  const nextDay = currentIndex < days.length - 1 ? days[currentIndex + 1] : null;

  const handleCopyCode = async () => {
    if (!activeReaderDay.codeSnippet) return;
    try {
      await navigator.clipboard.writeText(activeReaderDay.codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSetStatus = (status: DayStatus) => {
    const updated = { ...activeReaderDay, status };
    updateDay(updated);
    setActiveReaderDay(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#02100b]/90 backdrop-blur-md overflow-y-auto">
      {/* Precision Engineered Terminal Window Chassis */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#07241a] text-[#ecfdf5] border-2 border-emerald-500/50 rounded-xl shadow-[0_24px_80px_rgba(2,16,11,0.95)] overflow-hidden my-auto">
        
        {/* Terminal Header & Navigation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-emerald-800/70 bg-[#041912] select-none">
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#34d399]" />
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block shadow-[0_0_6px_#bef264]" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            </div>
            <span className="text-emerald-500/40 font-mono ml-1">//</span>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              KPI-JOURNAL
            </span>
            <span className="text-emerald-500/40 font-mono">/</span>
            <span className="text-slate-200 font-semibold text-[11px] truncate max-w-[180px] sm:max-w-xs">
              {activeReaderDay.phase}
            </span>
            <span className="text-emerald-500/40 font-mono">/</span>
            <span className="text-white font-mono font-bold text-[11px]">
              DAY {String(activeReaderDay.dayNumber).padStart(2, '0')}
            </span>
          </div>

          {/* Quick Controls: Prev, Day Counter, Next, Star, Edit, Close */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Day Pager */}
            <div className="flex items-center bg-[#0d1a15] border border-emerald-900/60 rounded-lg p-0.5 font-mono text-xs text-muted-foreground">
              <button
                type="button"
                disabled={!prevDay}
                onClick={() => prevDay && setActiveReaderDay(prevDay)}
                className="px-2 py-1 rounded hover:bg-emerald-950 hover:text-lime-300 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
                title="Previous Day (←)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">PREV</span>
              </button>
              <span className="px-2 py-0.5 text-[11px] font-bold text-foreground border-x border-emerald-900/40">
                {String(activeReaderDay.dayNumber).padStart(2, '0')}/250
              </span>
              <button
                type="button"
                disabled={!nextDay}
                onClick={() => nextDay && setActiveReaderDay(nextDay)}
                className="px-2 py-1 rounded hover:bg-emerald-950 hover:text-lime-300 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
                title="Next Day (→)"
              >
                <span className="hidden sm:inline text-[10px]">NEXT</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark Star */}
            <button
              type="button"
              onClick={() => toggleStar(activeReaderDay.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                activeReaderDay.isStarred 
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-400' 
                  : 'bg-[#0d1a15] border-emerald-900/60 text-muted-foreground hover:text-amber-400 hover:border-amber-400/30'
              }`}
              title="Bookmark this Day"
            >
              <Star className={`w-3.5 h-3.5 ${activeReaderDay.isStarred ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => {
                const dayToEdit = activeReaderDay;
                setActiveReaderDay(null);
                setEditingDay(dayToEdit);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0d1a15] hover:bg-emerald-950 border border-emerald-900/60 hover:border-lime-400/40 text-xs font-mono font-medium text-lime-400 transition-colors cursor-pointer"
              title="Edit Day Entry [E]"
            >
              <Edit3 className="w-3 h-3" />
              <span className="hidden sm:inline text-[11px]">EDIT</span>
            </button>

            {/* Close Button with ESC badge */}
            <button
              type="button"
              onClick={() => setActiveReaderDay(null)}
              className="inline-flex items-center gap-1 p-1 sm:px-2 py-1 rounded-lg bg-[#0d1a15] hover:bg-red-950/40 border border-emerald-900/60 hover:border-red-500/40 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
              title="Close [ESC]"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px] font-mono opacity-70">ESC</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* Header Specification Strip */}
          <div className="space-y-3 pb-5 border-b border-emerald-900/40">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="bg-lime-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] tracking-wider">
                DAY {String(activeReaderDay.dayNumber).padStart(2, '0')}
              </span>
              <span className="bg-[#0e2019] text-slate-200 border border-emerald-500/30 px-2.5 py-0.5 rounded text-[11px] font-medium">
                {activeReaderDay.phase}
              </span>
              <span className="text-slate-400 text-[11px] px-2 py-0.5 rounded bg-[#0d1a15] border border-emerald-900/40">
                {activeReaderDay.date}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                activeReaderDay.status === 'completed'
                  ? 'bg-emerald-500 text-slate-950'
                  : activeReaderDay.status === 'in-progress'
                  ? 'bg-lime-400 text-slate-950'
                  : 'bg-muted text-slate-400 border border-border'
              }`}>
                {activeReaderDay.status}
              </span>

              {activeReaderDay.interactiveLabId && (
                <span className="bg-[#12281e] text-slate-200 border border-lime-400/40 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-lime-400" />
                  <span>SIMULATOR ATTACHED</span>
                </span>
              )}
            </div>

            {/* Title (High-contrast, clean typography, concrete color) */}
            <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              {activeReaderDay.title}
            </h1>
          </div>

          {/* Executive Core Takeaway / Synopsis Card */}
          <div className="border-l-4 border-l-lime-400 bg-[#0a3022] border border-emerald-700/60 p-4 sm:p-5 rounded-r-xl space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-lime-400 tracking-wider uppercase flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-lime-400" />
              <span>// 01. EXECUTIVE SYNOPSIS & CORE TAKEAWAY</span>
            </div>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans">
              {activeReaderDay.summary}
            </p>
          </div>

          {/* Silicon Hardware Simulation Banner (If lab is present) */}
          {activeReaderDay.interactiveLabId && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#0d3b2a] border-2 border-emerald-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-lime-400/20 text-lime-400 border border-lime-400/40 shrink-0 mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-lime-400 flex items-center gap-1.5">
                    <span>HARDWARE TESTBED ONLINE</span>
                    <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#bef264] animate-pulse" />
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 font-mono">
                    {activeReaderDay.interactiveLabId === 'roofline'
                      ? 'Interactive GPU Roofline Model: Arithmetic Intensity & HBM Ceiling Analyzer'
                      : 'CUDA Shared Memory 32-Bank Simulator: Warp Collisions & +1 Padding'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const lab = activeReaderDay.interactiveLabId!;
                  setActiveReaderDay(null);
                  setActiveLab(lab);
                }}
                className="px-4 py-2 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 font-mono text-xs font-bold border border-lime-400 transition-colors cursor-pointer shrink-0"
              >
                Launch Lab Simulator &rarr;
              </button>
            </div>
          )}

          {/* Theoretical Formulation / Mathematical Specification */}
          {activeReaderDay.formula && (
            <div className="rounded-xl bg-[#08281d] border border-emerald-600/50 overflow-hidden font-mono text-xs space-y-3 p-4 sm:p-5">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-800/60">
                <div className="text-[10px] text-lime-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-lime-400" />
                  <span>// 02. MATHEMATICAL SPECIFICATION & FORMULATION</span>
                </div>
                <span className="text-[11px] text-slate-200 font-bold">
                  {activeReaderDay.formula.name}
                </span>
              </div>

              {/* LaTeX display box */}
              <div className="p-3.5 bg-[#041a12] border border-emerald-800/80 rounded-lg text-slate-100 text-sm sm:text-base overflow-x-auto selection:bg-lime-400/30">
                <code>{activeReaderDay.formula.latex}</code>
              </div>

              {activeReaderDay.formula.description && (
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {activeReaderDay.formula.description}
                </p>
              )}
            </div>
          )}

          {/* In-Depth Technical Breakdown (Explanation) */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-lime-400 tracking-wider">
              <span>// 03. ENGINEERING LOG & IMPLEMENTATION DETAILS</span>
            </div>
            <div className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans whitespace-pre-line space-y-3 bg-[#0a3022] p-4 sm:p-5 rounded-xl border border-emerald-800/50">
              {activeReaderDay.explanation}
            </div>
          </div>

          {/* Production Code Snippet */}
          {activeReaderDay.codeSnippet && (
            <div className="rounded-xl border border-emerald-600/50 bg-[#062118] overflow-hidden font-mono text-xs">
              {/* Terminal Code Header Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#092d20] border-b border-emerald-800/70">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                  </div>
                  <Code2 className="w-3.5 h-3.5 text-lime-400 ml-1.5" />
                  <span className="text-slate-100 font-semibold text-[11px]">
                    {activeReaderDay.codeSnippet.title}
                  </span>
                  <span className="text-slate-300 text-[10px] px-1.5 py-0.5 rounded bg-[#0d3829] border border-emerald-700/60">
                    {activeReaderDay.codeSnippet.language}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-[#0d3829] hover:bg-emerald-900 border border-emerald-700/70 hover:border-lime-400/50 text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code Pre container with crisp neutral syntax text */}
              <pre className="p-4 sm:p-5 overflow-x-auto text-slate-200 leading-relaxed max-h-[420px] bg-[#041a12] font-mono text-xs sm:text-[13px] selection:bg-lime-400/25">
                <code>{activeReaderDay.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Key Takeaways & Gotchas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Insights */}
            {activeReaderDay.keyInsights && activeReaderDay.keyInsights.length > 0 && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#0a3022] border border-emerald-600/50 text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 font-mono tracking-wider uppercase text-[11px]">
                  <Lightbulb className="w-3.5 h-3.5 text-lime-400" />
                  <span>// ARCHITECTURAL TAKEAWAYS</span>
                </div>
                <ul className="space-y-2 text-slate-200 list-disc list-inside font-sans text-xs sm:text-[13px] leading-relaxed">
                  {activeReaderDay.keyInsights.map((insight, idx) => (
                    <li key={idx} className="pl-1">{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Debugging Realities & Gotchas */}
            {activeReaderDay.gotchas && activeReaderDay.gotchas.length > 0 && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#1c2c1c] border border-amber-500/40 text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 font-mono tracking-wider uppercase text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>// PROFILING PITFALLS & GOTCHAS</span>
                </div>
                <ul className="space-y-2 text-slate-200 list-disc list-inside font-sans text-xs sm:text-[13px] leading-relaxed">
                  {activeReaderDay.gotchas.map((gotcha, idx) => (
                    <li key={idx} className="pl-1">{gotcha}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Literature & Reference Citations */}
          {activeReaderDay.resources && activeReaderDay.resources.length > 0 && (
            <div className="pt-4 border-t border-emerald-800/50 text-xs space-y-2.5">
              <div className="font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 text-[10px]">
                <BookOpen className="w-3.5 h-3.5 text-lime-400" />
                <span>// LITERATURE CITATIONS & REFERENCES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeReaderDay.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url || '#'}
                    target={res.url ? '_blank' : '_self'}
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#092d20] hover:bg-[#0e3b2b] border border-emerald-700/60 hover:border-lime-400/50 text-slate-200 hover:text-white transition-colors font-mono text-xs"
                  >
                    <span>{res.title}</span>
                    {res.url && <ExternalLink className="w-3 h-3 text-slate-400" />}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Status & Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-emerald-800/70 bg-[#041912] font-mono text-xs">
          {/* Quick Status Setter */}
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>Status:</span>
            <button
              type="button"
              onClick={() => handleSetStatus('completed')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 font-semibold ${
                activeReaderDay.status === 'completed'
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-500'
                  : 'bg-[#092d20] hover:bg-[#0e3b2b] text-slate-300 hover:text-white border border-emerald-700/60'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Done</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetStatus('in-progress')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 font-semibold ${
                activeReaderDay.status === 'in-progress'
                  ? 'bg-lime-400 text-slate-950 border border-lime-400'
                  : 'bg-[#092d20] hover:bg-[#0e3b2b] text-slate-300 hover:text-white border border-emerald-700/60'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Active</span>
            </button>
          </div>

          {/* Keyboard hints & Close */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-[10px] text-slate-400">
              [← / →] Navigate &nbsp;•&nbsp; [E] Edit &nbsp;•&nbsp; [ESC] Close
            </span>
            <button
              type="button"
              onClick={() => setActiveReaderDay(null)}
              className="px-4 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold border border-lime-400 transition-colors cursor-pointer text-xs"
            >
              Close Reader
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
