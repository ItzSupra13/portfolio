"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatFull } from "../lib/dates";
import type { WorkDay } from "../lib/holidays";
import {
  CALC_MODES,
  filterSuggestions,
  type CalcMode,
  type SortBy,
  type Suggestion,
} from "../lib/optimizer";

type ResultsStepProps = {
  results: Suggestion[];
  startDate: string;
  endDate: string;
  workDays: WorkDay[];
  maxLeave: number;
  calcMode: CalcMode;
  holidayCount: number;
  sortBy: SortBy;
  filterMin: number;
  filterMax: number;
  onSortByChange: (value: SortBy) => void;
  onFilterMinChange: (value: number) => void;
  onFilterMaxChange: (value: number) => void;
  onRecalculate: () => void;
};

const labelClass = "mb-2.5 block text-[11px] uppercase tracking-[0.12em] text-white/30";

export function ResultsStep({
  results,
  startDate,
  endDate,
  workDays,
  maxLeave,
  calcMode,
  holidayCount,
  sortBy,
  filterMin,
  filterMax,
  onSortByChange,
  onFilterMinChange,
  onFilterMaxChange,
  onRecalculate,
}: ResultsStepProps) {
  const filtered = useMemo(
    () => filterSuggestions(results, filterMin, filterMax, sortBy),
    [results, filterMin, filterMax, sortBy],
  );

  const stats = [
    { value: results.length, label: "combinations" },
    { value: maxLeave, label: "max leave days" },
    { value: holidayCount, label: "holidays" },
  ];

  const queryDetails = [
    ["Date range", `${formatFull(startDate)} → ${formatFull(endDate)}`],
    ["Working days", workDays.join(", ")],
    ["Calculation mode", CALC_MODES[calcMode]],
    ["Max leave", `${maxLeave} days`],
  ];

  return (
    <>
      <div className="mb-10 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-white/[0.07]">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0e0e11] px-3 py-5 text-center">
            <span className="block text-[28px] font-semibold tracking-[-0.03em]">{stat.value}</span>
            <span className="mt-0.5 text-[10px] tracking-[0.1em] text-white/30 uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-9 rounded-lg border-[0.5px] border-white/[0.07] bg-white/[0.02] px-5 py-4 text-xs">
        <div className="mb-2 text-[11px] tracking-[0.1em] text-white/30 uppercase">
          Query details
        </div>
        {queryDetails.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 border-b-[0.5px] border-white/[0.04] py-1.5 last:border-0"
          >
            <span className="text-white/30">{label}</span>
            <span className="max-w-[340px] text-right text-white/65">{value}</span>
          </div>
        ))}
      </div>

      <div className="mb-6 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <RangeFilter
          id="filter-min"
          label="Min total days"
          value={filterMin}
          onChange={onFilterMinChange}
        />
        <RangeFilter
          id="filter-max"
          label="Max total days"
          value={filterMax}
          onChange={onFilterMaxChange}
        />
        <div>
          <label htmlFor="sort-by" className={labelClass}>
            Sort
          </label>
          <div className="relative">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(event) => onSortByChange(event.target.value as SortBy)}
              className="w-full appearance-none rounded-md border-[0.5px] border-white/10 bg-white/[0.04] px-3.5 py-2.5 pr-8 text-[13px] text-white [color-scheme:dark] outline-none focus:border-white/25"
            >
              <option value="efficiency">Best ratio</option>
              <option value="leave">Fewest leave</option>
              <option value="holiday">Most days off</option>
            </select>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[10px] text-white/30">
              ▼
            </span>
          </div>
        </div>
      </div>

      <div className="my-8 border-t-[0.5px] border-white/[0.07]" />

      <div className="mb-4 text-[11px] tracking-[0.1em] text-white/25 uppercase">
        Showing {filtered.length} suggestions
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-[13px] text-white/30">
          No suggestions match these filters. Try adjusting the range or mode.
        </div>
      ) : (
        filtered.map((suggestion, index) => (
          <SuggestionCard
            key={`${suggestion.start}-${suggestion.end}-${index}`}
            suggestion={suggestion}
            highlighted={index < 3}
          />
        ))
      )}

      <div className="my-8 border-t-[0.5px] border-white/[0.07]" />

      <button
        type="button"
        onClick={onRecalculate}
        className="inline-flex items-center gap-2 rounded-md border-[0.5px] border-white/25 px-7 py-3.5 text-xs tracking-[0.1em] uppercase transition-colors hover:border-white/50"
      >
        ↩ Recalculate
      </button>
    </>
  );
}

function RangeFilter({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={1}
        max={30}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-white"
      />
      <div className="mt-0.5 text-[11px] text-white/40">{value}</div>
    </div>
  );
}

function SuggestionCard({
  suggestion,
  highlighted,
}: {
  suggestion: Suggestion;
  highlighted: boolean;
}) {
  const pills = [
    { label: `${suggestion.leaveDays} leave`, green: true },
    { label: `${suggestion.totalDays} total days`, green: false },
    { label: `${suggestion.offDays} off days`, green: false },
  ];

  return (
    <div
      className={cn(
        "mb-2.5 flex items-center justify-between gap-4 rounded-lg border-[0.5px] px-5 py-4.5",
        highlighted ? "border-white/[0.14] bg-white/[0.06]" : "border-white/[0.08] bg-white/[0.03]",
      )}
    >
      <div>
        <div className="mb-1 text-[13px] text-white/70">
          {formatFull(suggestion.start)}
          <span className="mx-2 text-white/20">→</span>
          {formatFull(suggestion.end)}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {pills.map((pill) => (
            <span
              key={pill.label}
              className={cn(
                "inline-block rounded-full border-[0.5px] px-2.5 py-0.5 text-[11px] tracking-[0.06em]",
                pill.green
                  ? "border-[rgba(80,220,130,0.2)] bg-[rgba(50,200,100,0.1)] text-[rgba(80,220,130,0.9)]"
                  : "border-white/10 bg-white/[0.06] text-white/40",
              )}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div
          className={cn(
            "text-[22px] font-semibold tracking-[-0.04em]",
            highlighted ? "text-white" : "text-white/60",
          )}
        >
          {suggestion.efficiency.toFixed(1)}×
        </div>
        <div className="mt-0.5 text-[10px] tracking-[0.08em] text-white/25 uppercase">ratio</div>
      </div>
    </div>
  );
}
