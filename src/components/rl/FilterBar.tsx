"use client"
import { useJournal } from '@/context/JournalContextRL';
import { Phase, DayStatus } from '@/types/journal';
import { Search, X, ArrowUpDown, LayoutList, Grid } from 'lucide-react';

const PHASES: (Phase | 'All')[] = [
  'All',
  'Foundations & MDPs',
  'Tabular Methods & TD',
  'Value Function Approx & DQN',
  'Policy Gradients & REINFORCE',
  'Actor-Critic & Continuous Control',
  'Model-Based RL & Planning',
  'RLHF, Alignment & Frontiers'
];

export default function FilterBar() {
  const {
    searchQuery,
    setSearchQuery,
    selectedPhase,
    setSelectedPhase,
    selectedStatus,
    setSelectedStatus,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    filteredDays
  } = useJournal();

  return (
    <div className="space-y-4">
      {/* Search and Quick View Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries, algorithms, Bellman, TD error, GAE, PPO, PyTorch..."
            className="w-full pl-10 pr-9 py-2 bg-muted/40 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode & Sort toggles */}
        <div className="flex items-center gap-2">
          {/* Status quick select */}
          <div className="flex items-center p-1 bg-muted/40 border border-border rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === 'all'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('completed')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('in-progress')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === 'in-progress'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Active
            </button>
          </div>

          {/* Sort order toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-muted/40 hover:bg-muted border border-border text-muted-foreground hover:text-foreground rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title={sortOrder === 'asc' ? 'Oldest first (Day 1 -> 100)' : 'Newest first (Day 100 -> 1)'}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Day 1 → 100' : 'Latest First'}</span>
          </button>
        </div>
      </div>

      {/* Phase filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar font-mono">
        {PHASES.map((phase) => {
          const isSelected = selectedPhase === phase;
          return (
            <button
              key={phase}
              type="button"
              onClick={() => setSelectedPhase(phase)}
              className={`px-3 py-1.5 rounded border whitespace-nowrap transition-colors cursor-pointer shrink-0 text-xs ${
                isSelected
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-sm'
                  : 'bg-muted/20 text-muted-foreground hover:text-foreground border-border hover:border-foreground/30'
              }`}
            >
              {phase}
            </button>
          );
        })}
      </div>

      {/* Active filter count feedback */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <div>
          {selectedPhase !== 'All' && <span> in <span className="text-foreground">{selectedPhase}</span></span>}
          {searchQuery && <span> matching "<span className="text-emerald-500 dark:text-emerald-400">{searchQuery}</span>"</span>}
        </div>
        {(selectedPhase !== 'All' || selectedStatus !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedPhase('All');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};
