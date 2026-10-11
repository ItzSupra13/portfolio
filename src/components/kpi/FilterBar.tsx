import React from 'react';
import { useJournal } from '@/context/JournalContextKPI';
import { Phase, DayStatus } from '@/types/journal';
import { Search, X, ArrowUpDown } from 'lucide-react';

const PHASES: (Phase | 'All')[] = [
  'All',
  'C++ & CUDA Foundations',
  'Performance Engineering',
  'Frontier Kernel Engineering',
  'Distributed Training',
  'Inference & Serving',
  'Portfolio & Job Search'
];

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedPhase,
    setSelectedPhase,
    selectedStatus,
    setSelectedStatus,
    sortOrder,
    setSortOrder,
    filteredDays
  } = useJournal();

  return (
    <div className="space-y-4">
      {/* Search and Quick View Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with lemongrass glow focus */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-lime-400/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search kernels, CUDA, Nsight roofline, Triton, FlashAttention, CuTe, vLLM, DeepGEMM..."
            className="w-full pl-10 pr-9 py-2.5 bg-card/85 border border-border/80 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-400/70 focus:ring-2 focus:ring-lime-400/20 transition-all font-sans shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-lime-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode & Sort toggles */}
        <div className="flex items-center gap-2">
          {/* Status quick select */}
          <div className="flex items-center p-1 bg-card/85 border border-border/80 rounded-xl text-xs font-medium font-mono shadow-sm">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatus === 'all'
                  ? 'bg-lime-400 text-slate-950 font-bold border border-lime-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatus === 'completed'
                  ? 'bg-emerald-500 text-slate-950 font-bold border border-emerald-500'
                  : 'text-muted-foreground hover:text-lime-400'
              }`}
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('in-progress')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedStatus === 'in-progress'
                  ? 'bg-lime-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(190,242,100,0.3)]'
                  : 'text-muted-foreground hover:text-lime-400'
              }`}
            >
              Active
            </button>
          </div>

          {/* Sort order toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1.5 px-3 py-2 bg-card/85 border border-border/80 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground hover:border-lime-400/40 transition-all cursor-pointer shadow-sm"
            title={`Sort ${sortOrder === 'asc' ? 'Newest first' : 'Oldest first'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline font-medium">{sortOrder === 'asc' ? 'Day 1→250' : 'Day 250→1'}</span>
          </button>
        </div>
      </div>

      {/* Phase filter tabs with emerald & lemongrass tactile glow */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar font-mono">
        {PHASES.map((phase) => {
          const isSelected = selectedPhase === phase;
          return (
            <button
              key={phase}
              type="button"
              onClick={() => setSelectedPhase(phase)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950/60 text-lime-300 font-semibold border border-lime-400/50 shadow-[0_0_14px_rgba(190,242,100,0.22)]'
                  : 'bg-card/70 text-muted-foreground hover:text-foreground hover:bg-card hover:border-lime-400/25 border border-border/70'
              }`}
            >
              {phase}
            </button>
          );
        })}
      </div>

      {/* Active filters notice if any */}
      {(selectedPhase !== 'All' || selectedStatus !== 'all' || searchQuery) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-mono">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_6px_#bef264]" />
            <span>
              Showing {filteredDays.length} of 250 logbook entries
              {selectedPhase !== 'All' && ` in "${selectedPhase}"`}
              {selectedStatus !== 'all' && ` (${selectedStatus})`}
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedPhase('All');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="text-muted-foreground hover:text-lime-400 underline underline-offset-2 cursor-pointer transition-colors"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};
