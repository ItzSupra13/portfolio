"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatShort } from "../lib/dates";
import { WORK_DAYS, type Holiday, type WorkDay } from "../lib/holidays";
import { CALC_MODES, type CalcMode } from "../lib/optimizer";

type InputStepProps = {
  startDate: string;
  endDate: string;
  workDays: WorkDay[];
  maxLeave: number;
  calcMode: CalcMode;
  holidays: Holiday[];
  canCompute: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onToggleWorkDay: (day: WorkDay) => void;
  onMaxLeaveChange: (value: number) => void;
  onCalcModeChange: (mode: CalcMode) => void;
  onToggleHoliday: (index: number) => void;
  onCompute: () => void;
};

const inputClass =
  "w-full rounded-md border-[0.5px] border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white outline-none [color-scheme:dark] focus:border-white/25";

const labelClass = "mb-2.5 block text-[11px] uppercase tracking-[0.12em] text-white/30";

export function InputStep({
  startDate,
  endDate,
  workDays,
  maxLeave,
  calcMode,
  holidays,
  canCompute,
  onStartDateChange,
  onEndDateChange,
  onToggleWorkDay,
  onMaxLeaveChange,
  onCalcModeChange,
  onToggleHoliday,
  onCompute,
}: InputStepProps) {
  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className={labelClass}>
            From
          </label>
          <input
            id="start-date"
            type="date"
            className={inputClass}
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end-date" className={labelClass}>
            To
          </label>
          <input
            id="end-date"
            type="date"
            className={inputClass}
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
        </div>
      </div>

      <div className="mb-9">
        <span className={labelClass}>Which days do you work?</span>
        <div className="flex flex-wrap gap-2">
          {WORK_DAYS.map((day) => {
            const active = workDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleWorkDay(day)}
                className={cn(
                  "rounded border-[0.5px] px-3.5 py-2 text-xs tracking-[0.06em] transition-colors",
                  active
                    ? "border-white/40 bg-white/[0.07] text-white"
                    : "border-white/10 text-white/30 hover:text-white/60",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-9">
        <label htmlFor="max-leave" className={labelClass}>
          Max leave days at once — <span className="text-white/70">{maxLeave} days</span>
        </label>
        <input
          id="max-leave"
          type="range"
          min={1}
          max={20}
          step={1}
          value={maxLeave}
          onChange={(event) => onMaxLeaveChange(Number(event.target.value))}
          className="w-full cursor-pointer accent-white"
        />
        <div className="mt-1 flex justify-between text-[11px] text-white/20">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      <div className="mb-9">
        <span className={labelClass}>Calculation mode</span>
        <div className="flex flex-col gap-2">
          {(Object.keys(CALC_MODES) as CalcMode[]).map((mode) => {
            const active = calcMode === mode;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={active}
                onClick={() => onCalcModeChange(mode)}
                className={cn(
                  "rounded-md border-[0.5px] px-4 py-3 text-left text-xs leading-snug transition-colors",
                  active
                    ? "border-white/40 bg-white/[0.07] text-white"
                    : "border-white/10 text-white/30 hover:text-white/60",
                )}
              >
                <span className="mr-2.5">{active ? "●" : "○"}</span>
                {CALC_MODES[mode]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="my-8 border-t-[0.5px] border-white/[0.07]" />

      <HolidayList holidays={holidays} onToggleHoliday={onToggleHoliday} />

      <div className="mt-10">
        <button
          type="button"
          onClick={onCompute}
          disabled={!canCompute}
          className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-xs font-semibold tracking-[0.1em] text-[#0e0e11] uppercase transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Get suggestions →
        </button>
      </div>
    </>
  );
}

function HolidayList({
  holidays,
  onToggleHoliday,
}: {
  holidays: Holiday[];
  onToggleHoliday: (index: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = holidays.filter((holiday) => holiday.enabled).length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] tracking-[0.12em] text-white/30 uppercase">
          Public holidays — <span className="text-white/60">{activeCount} active</span>
        </span>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="text-[11px] tracking-[0.05em] text-white/35 transition-colors hover:text-white/70"
        >
          {isOpen ? "Collapse ↑" : "Customize →"}
        </button>
      </div>

      {isOpen && (
        <div className="max-h-80 overflow-y-auto rounded-lg border-[0.5px] border-white/[0.07] bg-white/[0.02] px-4 py-2">
          {holidays.map((holiday, index) => (
            <div
              key={holiday.date}
              className="flex items-center gap-3 border-b-[0.5px] border-white/[0.05] py-2 text-xs last:border-0"
            >
              <button
                type="button"
                role="switch"
                aria-checked={holiday.enabled}
                aria-label={`Toggle ${holiday.name}`}
                onClick={() => onToggleHoliday(index)}
                className={cn(
                  "relative h-[18px] w-8 shrink-0 rounded-full transition-colors",
                  holiday.enabled ? "bg-white/70" : "bg-white/10",
                )}
              >
                <span
                  className={cn(
                    "absolute top-[3px] size-3 rounded-full transition-all",
                    holiday.enabled ? "left-[17px] bg-[#0e0e11]" : "left-[3px] bg-white/40",
                  )}
                />
              </button>
              <span className="min-w-20 text-white/30">{formatShort(holiday.date)}</span>
              <span className={holiday.enabled ? "text-white/70" : "text-white/20"}>
                {holiday.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
