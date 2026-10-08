"use client"
import React, { useState } from 'react';
import { JournalDay } from '@/types/rl-journal';
import { useJournal } from '@/context/JournalContextRL';
import { 
  Copy, 
  Check, 
  Star, 
  ExternalLink, 
  Edit3, 
  Maximize2, 
  FlaskConical, 
  Code2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DayCardProps {
  day: JournalDay;
}

export default function DayCard({ day } : DayCardProps) {
  const { toggleStar, setEditingDay, setActiveReaderDay, setActiveLab } = useJournal();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);

  const isCompleted = day.status === 'completed';
  const isInProgress = day.status === 'in-progress';

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!day.codeSnippet) return;
    try {
      await navigator.clipboard.writeText(day.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
    }
  };

  const handleCopyMarkdown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const md = `### Day ${day.dayNumber}: ${day.title}
*Date: ${day.date} | Phase: ${day.phase} | Status: ${day.status}*

${day.summary}

${day.explanation}

${day.formula ? `$$${day.formula.latex}$$\n*${day.formula.name}: ${day.formula.description || ''}*\n` : ''}

${day.codeSnippet ? `\`\`\`${day.codeSnippet.language}\n${day.codeSnippet.code}\n\`\`\`\n` : ''}

${day.keyInsights && day.keyInsights.length > 0 ? `**Key Insights:**\n${day.keyInsights.map(k => `- ${k}`).join('\n')}\n` : ''}

${day.gotchas && day.gotchas.length > 0 ? `**Gotchas:**\n${day.gotchas.map(g => `- ${g}`).join('\n')}\n` : ''}
`;
    try {
      await navigator.clipboard.writeText(md);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <article 
      id={`day-${day.dayNumber}`}
      className="group relative border-b border-border/80 pb-12 pt-4 transition-all"
    >
      {/* Editorial Header Line */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="font-bold text-foreground">
            DAY {String(day.dayNumber).padStart(2, '0')}
          </span>
          <span aria-hidden="true" className="opacity-40">/</span>
          <span>{day.date.toUpperCase()}</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span>{day.phase.toUpperCase()}</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className={isCompleted ? 'text-emerald-500 font-medium' : isInProgress ? 'text-amber-500 font-medium' : 'text-muted-foreground'}>
            {day.status.toUpperCase()}
          </span>
        </div>

        {/* Quiet Actions */}
        <div className="flex items-center gap-1">

          <button
            type="button"
            onClick={handleCopyMarkdown}
            title="Copy as Markdown for GitHub README"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveReaderDay(day)}
            title="Open in distraction-free reader"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setEditingDay(day)}
            title="Edit what you learned"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors ml-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h2 className="font-editorial text-2xl sm:text-3xl lg:text-[2rem] font-bold text-foreground tracking-tight leading-snug mb-3">
        {day.title}
      </h2>

      {/* Summary / Abstract (with subtle left border rule) */}
      <div className="text-sm sm:text-base text-foreground/90 leading-relaxed font-light mb-6 border-l-2 border-foreground/30 pl-4 py-0.5">
        {day.summary}
      </div>

      {/* Deep-dive Explanation Prose */}
      <div className="text-sm sm:text-[0.95rem] text-muted-foreground leading-relaxed space-y-4 mb-6 font-light whitespace-pre-line">
        {day.explanation}
      </div>

      {/* Mathematical Derivation Display (Academic Paper Style) */}
      {day.formula && (
        <div className="my-6 pl-4 border-l-2 border-emerald-500/60 font-mono text-xs">
          <div className="flex items-baseline justify-between text-muted-foreground mb-1.5">
            <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              {day.formula.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              (Eq. {day.dayNumber}.1)
            </span>
          </div>
          <div className="py-3 px-4 bg-muted/40 rounded-md border border-border text-foreground font-mono text-xs sm:text-sm overflow-x-auto">
            <code>{day.formula.latex}</code>
          </div>
          {day.formula.description && (
            <p className="mt-2 text-muted-foreground text-xs font-sans italic">
              {day.formula.description}
            </p>
          )}
        </div>
      )}

      {/* Interactive Simulation Launcher (if attached) */}
      {day.interactiveLabId && (
        <div className="my-6 p-3.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-background border border-border">
              <FlaskConical className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-foreground">Interactive Laboratory Ready</div>
              <div className="text-muted-foreground">
                Run Bellman updates and visualize policy convergence in real-time.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveLab(day.interactiveLabId!)}
            className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-mono font-medium hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
          >
            Launch Solver &rarr;
          </button>
        </div>
      )}

      {/* PyTorch / Python Implementation Block */}
      {day.codeSnippet && (
        <div className="my-6 rounded-lg border border-border overflow-hidden font-mono text-xs bg-muted/10">
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
            <div className="flex items-center gap-2 text-foreground font-mono text-[11px]">
              <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-semibold">{day.codeSnippet.title}</span>
              <span className="text-muted-foreground">({day.codeSnippet.language})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCodeCollapsed(!isCodeCollapsed)}
                className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
              >
                {isCodeCollapsed ? (
                  <><span>Show</span><ChevronDown className="w-3 h-3" /></>
                ) : (
                  <><span>Hide</span><ChevronUp className="w-3 h-3" /></>
                )}
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-[11px] cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {!isCodeCollapsed && (
            <div className="p-4 overflow-x-auto max-h-[400px] bg-background text-foreground/90 leading-relaxed font-mono text-xs">
              <pre>
                <code>{day.codeSnippet.code}</code>
              </pre>
              {day.codeSnippet.explanation && (
                <div className="mt-3 pt-3 border-t border-border/60 text-[11px] text-muted-foreground font-sans">
                  <strong>Implementation note:</strong> {day.codeSnippet.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Key Takeaways & Debugging Realities (Clean Two-Column Editorial Notes) */}
      {((day.keyInsights && day.keyInsights.length > 0) || (day.gotchas && day.gotchas.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs font-sans">
          {/* Key Principles */}
          {day.keyInsights && day.keyInsights.length > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-foreground font-bold">
                Theoretical Principles
              </div>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                {day.keyInsights.map((insight, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-foreground/90">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Gotchas */}
          {day.gotchas && day.gotchas.length > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-amber-500 font-bold">
                Empirical Pitfalls & Gotchas
              </div>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                {day.gotchas.map((gotcha, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-foreground/90">{gotcha}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Literature Citations */}
      {day.resources && day.resources.length > 0 && (
        <div className="pt-4 mt-6 border-t border-border/40 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono">
          <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
            Literature:
          </span>
          {day.resources.map((res, idx) => (
            <a
              key={idx}
              href={res.url || '#'}
              target={res.url ? '_blank' : '_self'}
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              <span>{res.title}</span>
              {res.url && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
            </a>
          ))}
        </div>
      )}
    </article>
  );
};
