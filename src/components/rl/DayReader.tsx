"use client"
import React, { useEffect } from 'react';
import { useJournal } from '@/context/JournalContextRL';
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
  AlertTriangle
} from 'lucide-react';

export default function DayReaderModal(){
  const { 
    activeReaderDay, 
    setActiveReaderDay, 
    days, 
    toggleStar, 
    setEditingDay, 
    setActiveLab 
  } = useJournal();

  const [copied, setCopied] = React.useState(false);

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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReaderDay, days, setActiveReaderDay]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl text-foreground overflow-hidden my-auto">
        {/* Reader Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/90">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!prevDay}
              onClick={() => prevDay && setActiveReaderDay(prevDay)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Day (←)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs font-bold text-foreground">
              Day {String(activeReaderDay.dayNumber).padStart(2, '0')} of 100
            </span>
            <button
              type="button"
              disabled={!nextDay}
              onClick={() => nextDay && setActiveReaderDay(nextDay)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next Day (→)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleStar(activeReaderDay.id)}
              className="p-2 text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer"
              title="Bookmark"
            >
              <Star className={`w-4 h-4 ${activeReaderDay.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                const dayToEdit = activeReaderDay;
                setActiveReaderDay(null);
                setEditingDay(dayToEdit);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveReaderDay(null)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Prose Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
          <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
            <span>{activeReaderDay.date}</span>
            <span>·</span>
            <span className="text-emerald-400">{activeReaderDay.phase}</span>
            <span>·</span>
            <span className="capitalize">{activeReaderDay.status}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-neutral-100 leading-tight">
            {activeReaderDay.title}
          </h1>

          <div className="border-l-2 border-emerald-500 pl-4 py-1 text-base text-neutral-300 italic font-serif">
            {activeReaderDay.summary}
          </div>

          <div className="prose prose-invert max-w-none text-base text-neutral-300/90 leading-relaxed font-light whitespace-pre-line space-y-4">
            {activeReaderDay.explanation}
          </div>

          {activeReaderDay.formula && (
            <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs">
              <div className="text-emerald-400 font-semibold uppercase mb-2">{activeReaderDay.formula.name}</div>
              <div className="p-3 bg-neutral-900 rounded text-emerald-300 text-sm overflow-x-auto">
                <code>{activeReaderDay.formula.latex}</code>
              </div>
              {activeReaderDay.formula.description && (
                <p className="mt-2 text-neutral-400 italic font-sans">{activeReaderDay.formula.description}</p>
              )}
            </div>
          )}

          {activeReaderDay.codeSnippet && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  <span className="text-neutral-200 font-medium">{activeReaderDay.codeSnippet.title}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-neutral-300 leading-relaxed max-h-96">
                <code>{activeReaderDay.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {activeReaderDay.interactiveLabId && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-neutral-200 font-medium">Interactive RL Lab ready for this algorithm</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const lab = activeReaderDay.interactiveLabId!;
                  setActiveReaderDay(null);
                  setActiveLab(lab);
                }}
                className="px-3 py-1.5 rounded bg-emerald-400 text-neutral-950 text-xs font-semibold cursor-pointer"
              >
                Launch Simulation &rarr;
              </button>
            </div>
          )}

          {/* Key takeaways */}
          {activeReaderDay.keyInsights && activeReaderDay.keyInsights.length > 0 && (
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-neutral-200 font-mono">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Key Takeaways</span>
              </div>
              <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
                {activeReaderDay.keyInsights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Gotchas */}
          {activeReaderDay.gotchas && activeReaderDay.gotchas.length > 0 && (
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-amber-900/30 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Gotchas & Debugging Realities</span>
              </div>
              <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
                {activeReaderDay.gotchas.map((gotcha, idx) => (
                  <li key={idx}>{gotcha}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {activeReaderDay.resources && activeReaderDay.resources.length > 0 && (
            <div className="pt-4 border-t border-neutral-800 text-xs space-y-2">
              <div className="font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Literature & References</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeReaderDay.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url || '#'}
                    target={res.url ? '_blank' : '_self'}
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-emerald-400 transition-colors"
                  >
                    <span>{res.title}</span>
                    {res.url && <ExternalLink className="w-3 h-3 opacity-60" />}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
