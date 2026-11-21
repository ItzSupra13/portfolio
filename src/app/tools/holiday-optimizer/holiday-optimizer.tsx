"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { InputStep } from "./components/input-step";
import { ResultsStep } from "./components/results-step";
import { DAY_NUMBER, HOLIDAYS_2026, type Holiday, type WorkDay } from "./lib/holidays";
import { findSuggestions, type CalcMode, type SortBy, type Suggestion } from "./lib/optimizer";

export function HolidayOptimizer() {
  const [startDate, setStartDate] = useState("2026-05-16");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [workDays, setWorkDays] = useState<WorkDay[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [maxLeave, setMaxLeave] = useState(6);
  const [calcMode, setCalcMode] = useState<CalcMode>("all");
  const [holidays, setHolidays] = useState<Holiday[]>(HOLIDAYS_2026);
  const [results, setResults] = useState<Suggestion[] | null>(null);

  const [filterMin, setFilterMin] = useState(1);
  const [filterMax, setFilterMax] = useState(30);
  const [sortBy, setSortBy] = useState<SortBy>("efficiency");

  const holidayDates = useMemo(
    () => new Set(holidays.filter((holiday) => holiday.enabled).map((holiday) => holiday.date)),
    [holidays],
  );

  const workDayNumbers = useMemo(() => new Set(workDays.map((day) => DAY_NUMBER[day])), [workDays]);

  const canCompute = Boolean(startDate && endDate && startDate <= endDate);

  const toggleHoliday = (index: number) => {
    setHolidays((current) =>
      current.map((holiday, i) =>
        i === index ? { ...holiday, enabled: !holiday.enabled } : holiday,
      ),
    );
  };

  const toggleWorkDay = (day: WorkDay) => {
    setWorkDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day],
    );
  };

  const computeSuggestions = () => {
    if (!canCompute) return;

    setResults(
      findSuggestions({
        startDate,
        endDate,
        workDayNumbers,
        holidayDates,
        maxLeave,
        calcMode,
      }),
    );
  };

  const activeHolidayCount = holidayDates.size;

  return (
    <main className="min-h-screen bg-[#0e0e11] font-mono text-white">
      <div className="mx-auto max-w-3xl px-6 pt-16 pb-24">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-[13px] tracking-[0.05em] text-white/35 transition-colors hover:text-white/70"
        >
          ↩︎ BACK
        </Link>

        <div className="mb-5 flex items-center justify-between text-xs tracking-[0.08em] text-white/35 uppercase">
          <span>Leave Optimizer</span>
          <span className="flex items-center gap-4">
            <span>Tool</span>
            <span className="opacity-40">·</span>
            <span>v1.0</span>
          </span>
        </div>

        <h1 className="mb-3 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
          {results === null ? (
            <>
              Plan smarter.
              <br />
              Leave less.
            </>
          ) : (
            "Your leave plan."
          )}
        </h1>
        <p className="mb-12 max-w-[520px] font-sans text-[15px] leading-relaxed text-white/40">
          {results === null
            ? "Optimize your paid leave days around weekends and public holidays. Get the longest breaks for the fewest days off."
            : `We found ${results.length} combinations. Here are the best ones.`}
        </p>

        {results === null ? (
          <InputStep
            startDate={startDate}
            endDate={endDate}
            workDays={workDays}
            maxLeave={maxLeave}
            calcMode={calcMode}
            holidays={holidays}
            canCompute={canCompute}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onToggleWorkDay={toggleWorkDay}
            onMaxLeaveChange={setMaxLeave}
            onCalcModeChange={setCalcMode}
            onToggleHoliday={toggleHoliday}
            onCompute={computeSuggestions}
          />
        ) : (
          <ResultsStep
            results={results}
            startDate={startDate}
            endDate={endDate}
            workDays={workDays}
            maxLeave={maxLeave}
            calcMode={calcMode}
            holidayCount={activeHolidayCount}
            sortBy={sortBy}
            filterMin={filterMin}
            filterMax={filterMax}
            onSortByChange={setSortBy}
            onFilterMinChange={setFilterMin}
            onFilterMaxChange={setFilterMax}
            onRecalculate={() => setResults(null)}
          />
        )}
      </div>
    </main>
  );
}
