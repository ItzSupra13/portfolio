"use client"
import { useState } from 'react';
import { useJournal } from '@/context/JournalContextRL';
import { RLPhase } from '@/types/rl-journal';
import { Check, Clock, ChevronDown, ChevronUp, Grid, ListOrdered } from 'lucide-react';

const PHASE_GROUPS: { name: RLPhase; range: [number, number]; description: string }[] = [
  { name: 'Foundations & MDPs', range: [1, 10], description: 'Markov decision processes, Bellman optimality, and dynamic programming' },
  { name: 'Tabular Methods & TD', range: [11, 20], description: 'Monte Carlo, SARSA, Q-Learning, and TD(λ) eligibility traces' },
  { name: 'Value Function Approx & DQN', range: [21, 40], description: 'DQN, Double DQN, Dueling, Prioritized Replay, Rainbow' },
  { name: 'Policy Gradients & REINFORCE', range: [41, 60], description: 'Policy gradient theorem, REINFORCE with baseline, PPO, SAC' },
  { name: 'Model-Based RL & Planning', range: [61, 80], description: 'Dyna-Q, MuZero, World Models, DreamerV3' },
  { name: 'RLHF, Alignment & Frontiers', range: [81, 100], description: 'Preference optimization, DPO, PPO-RLHF, Reasoning models' }
];

export default function DayMatrix() {
  const { days, setEditingDay, setActiveReaderDay, addNewDay, setActiveNavPage } = useJournal();
  const [matrixStyle, setMatrixStyle] = useState<'syllabus' | 'grid'>('syllabus');
  const [isExpanded, setIsExpanded] = useState(true);

  // Map of dayNumber -> day object
  const dayMap = new Map(days.map(d => [d.dayNumber, d]));
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

  const handleCellClick = (dayNumber: number) => {
    const existingDay = dayMap.get(dayNumber);
    if (existingDay) {
      setActiveNavPage('logbook');
      setTimeout(() => {
        const el = document.getElementById(`day-${dayNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          setActiveReaderDay(existingDay);
        }
      }, 50);
    } else {
      addNewDay();
    }
  };

  return (
    <section 
      aria-label="Curriculum Roadmap" 
      className="border border-border/80 rounded-lg p-5 sm:p-6 bg-card/60 backdrop-blur-sm"
    >
      {/* Header with View Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Curriculum Roadmap
            </span>
            <span aria-hidden="true" className="text-muted-foreground opacity-40">/</span>
            <span className="text-xs font-mono text-foreground">100-Day Progression</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-light">
            Click any module to jump to derivations, PyTorch scripts, and citations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-0.5 rounded border border-border bg-muted/40 text-xs font-mono">
            <button
              type="button"
              onClick={() => setMatrixStyle('syllabus')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                matrixStyle === 'syllabus'
                  ? 'bg-background text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Syllabus</span>
            </button>
            <button
              type="button"
              onClick={() => setMatrixStyle('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                matrixStyle === 'grid'
                  ? 'bg-background text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>100-Grid</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse roadmap' : 'Expand roadmap'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-5">
          {matrixStyle === 'syllabus' ? (
            /* Syllabus / Phase Index View (Authentic Academic Feel) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PHASE_GROUPS.map((phase) => {
                const phaseDays = numbers
                  .filter(num => num >= phase.range[0] && num <= phase.range[1])
                  .map(num => ({ num, day: dayMap.get(num) }));

                const completedCount = phaseDays.filter(p => p.day?.status === 'completed').length;
                const totalInPhase = phase.range[1] - phase.range[0] + 1;

                return (
                  <div 
                    key={phase.name} 
                    className="p-3.5 rounded-lg border border-border/70 bg-muted/10 space-y-3"
                  >
                    <div className="flex items-baseline justify-between gap-2 border-b border-border/50 pb-2">
                      <div className="font-editorial font-bold text-sm text-foreground">
                        {phase.name}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {completedCount}/{totalInPhase} done
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-1 italic font-sans">
                      {phase.description}
                    </p>

                    <div className="space-y-1.5">
                      {phaseDays.slice(0, 6).map(({ num, day }) => {
                        const isDone = day?.status === 'completed';
                        const isActive = day?.status === 'in-progress';

                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleCellClick(num)}
                            className="w-full flex items-center justify-between text-left text-xs font-mono py-1 px-1.5 rounded hover:bg-muted/60 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[10px] text-muted-foreground w-5 shrink-0">
                                {String(num).padStart(2, '0')}
                              </span>
                              <span className="truncate text-foreground/90 group-hover:text-foreground text-[11px]">
                                {day?.title || `Open Research Day ${num}`}
                              </span>
                            </div>

                            <div className="shrink-0 ml-2">
                              {isDone ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : isActive ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                              ) : (
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/40 inline-block" />
                              )}
                            </div>
                          </button>
                        );
                      })}

                      {totalInPhase > 6 && (
                        <div className="text-[10px] font-mono text-muted-foreground pt-1 pl-1">
                          + {totalInPhase - 6} more planned research modules
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Compact 100-Grid View */
            <div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                {numbers.map(num => {
                  const day = dayMap.get(num);
                  const isCompleted = day?.status === 'completed';
                  const isInProgress = day?.status === 'in-progress';
                  const isPlanned = day?.status === 'planned';

                  let cellBg = 'bg-muted/20 text-muted-foreground border-border hover:border-foreground/40';
                  if (isCompleted) {
                    cellBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:border-emerald-500';
                  } else if (isInProgress) {
                    cellBg = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 hover:border-amber-500 animate-pulse';
                  } else if (isPlanned) {
                    cellBg = 'bg-muted/40 text-foreground/80 border-border hover:bg-muted';
                  }

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleCellClick(num)}
                      className={`group relative flex flex-col items-center justify-center p-1.5 rounded border transition-all cursor-pointer aspect-square ${cellBg}`}
                      title={day ? `Day ${num}: ${day.title}` : `Day ${num}: Open slot`}
                    >
                      <span className="text-[11px] font-mono font-medium tabular-nums">
                        {String(num).padStart(2, '0')}
                      </span>
                      {isCompleted && <Check className="w-2.5 h-2.5 mt-0.5 text-emerald-500" />}
                      {isInProgress && <Clock className="w-2.5 h-2.5 mt-0.5 text-amber-500" />}

                      {/* Tooltip */}
                      <div className="pointer-events-none absolute bottom-full mb-1.5 hidden group-hover:block z-50 w-48 p-2 rounded bg-popover text-popover-foreground border border-border text-left shadow-lg">
                        <div className="text-[10px] font-mono text-muted-foreground flex justify-between">
                          <span>Day {String(num).padStart(2, '0')}</span>
                          <span className="capitalize text-emerald-500">{day?.status || 'Open slot'}</span>
                        </div>
                        <div className="text-xs font-semibold text-foreground mt-0.5 line-clamp-2">
                          {day?.title || 'Click to document this day'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-5 mt-4 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                  <span>Roadmap / Planned</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
