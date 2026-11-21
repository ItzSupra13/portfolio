const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function parseDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function eachDate(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const last = parseDate(endDate);

  for (let current = parseDate(startDate); current <= last; current = addDays(current, 1)) {
    dates.push(toISODate(current));
  }

  return dates;
}

export function formatShort(isoDate: string): string {
  const date = parseDate(isoDate);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatFull(isoDate: string): string {
  const date = parseDate(isoDate);
  return `${formatShort(isoDate)} ${DAYS[date.getDay()]}`;
}
