import { eachDate, parseDate } from "./dates";

export const CALC_MODES = {
  all: "Calculate all possible leave days",
  exact: "Calculate the full number of leave days",
  block: "Calculate leave days as a block",
} as const;

export type CalcMode = keyof typeof CALC_MODES;
export type SortBy = "efficiency" | "leave" | "holiday";

export type Suggestion = {
  start: string;
  end: string;
  totalDays: number;
  leaveDays: number;
  offDays: number;
  efficiency: number;
};

type FindSuggestionsInput = {
  startDate: string;
  endDate: string;
  workDayNumbers: Set<number>;
  holidayDates: Set<string>;
  maxLeave: number;
  calcMode: CalcMode;
};

const MAX_WINDOW_DAYS = 30;
const MAX_RESULTS = 60;

function compareSuggestions(sortBy: SortBy) {
  return (a: Suggestion, b: Suggestion) => {
    if (sortBy === "leave") return a.leaveDays - b.leaveDays;
    if (sortBy === "holiday") return b.totalDays - a.totalDays;
    return b.efficiency - a.efficiency || b.totalDays - a.totalDays;
  };
}

export function findSuggestions({
  startDate,
  endDate,
  workDayNumbers,
  holidayDates,
  maxLeave,
  calcMode,
}: FindSuggestionsInput): Suggestion[] {
  const days = eachDate(startDate, endDate).map((date) => {
    const off = !workDayNumbers.has(parseDate(date).getDay()) || holidayDates.has(date);
    return { date, off, leave: !off };
  });

  const suggestions: Suggestion[] = [];

  for (let start = 0; start < days.length; start++) {
    for (let length = 2; length <= MAX_WINDOW_DAYS; length++) {
      if (start + length > days.length) break;

      const window = days.slice(start, start + length);
      const leaveDays = window.filter((day) => day.leave).length;
      if (leaveDays === 0) continue;

      if (calcMode === "all" && leaveDays > maxLeave) continue;
      if (calcMode !== "all" && leaveDays !== maxLeave) continue;

      if (calcMode === "block") {
        // A weekend between two leave days is allowed; anything longer is a separate block.
        const leaveIndexes = window.flatMap((day, index) => (day.leave ? [index] : []));
        const hasGap = leaveIndexes.some((index, i) => i > 0 && index - leaveIndexes[i - 1] > 3);
        if (hasGap) continue;
      }

      const offDays = window.filter((day) => day.off).length;
      if (offDays === 0) continue;

      suggestions.push({
        start: window[0].date,
        end: window[length - 1].date,
        totalDays: length,
        leaveDays,
        offDays,
        efficiency: Number((length / leaveDays).toFixed(2)),
      });
    }
  }

  const bestByStart = new Map<string, Suggestion>();
  for (const suggestion of suggestions) {
    const key = `${suggestion.start}-${suggestion.leaveDays}`;
    const current = bestByStart.get(key);
    if (!current || current.totalDays < suggestion.totalDays) {
      bestByStart.set(key, suggestion);
    }
  }

  return [...bestByStart.values()];
}

export function filterSuggestions(
  suggestions: Suggestion[],
  minDays: number,
  maxDays: number,
  sortBy: SortBy,
): Suggestion[] {
  return suggestions
    .filter((suggestion) => suggestion.totalDays >= minDays && suggestion.totalDays <= maxDays)
    .sort(compareSuggestions(sortBy))
    .slice(0, MAX_RESULTS);
}
