const MONTHS: Record<string, number> = {
  ene: 0, jan: 0, feb: 1, mar: 2, abr: 3, apr: 3, may: 4, jun: 5, jul: 6,
  ago: 7, aug: 7, sep: 8, oct: 9, oct_: 9, nov: 10, dic: 11, dec: 11,
};

/** Parse a `"Mar 2025"` / `"Ene 2022"` label into a Date. */
export function parseMonthYear(label?: string | null): Date | null {
  if (!label) return null;
  const [rawMonth, rawYear] = String(label).trim().split(/\s+/);
  const month = MONTHS[rawMonth?.slice(0, 3).toLowerCase()];
  const year = Number(rawYear);
  if (month === undefined || !Number.isFinite(year)) return null;
  return new Date(year, month, 1);
}

/**
 * Human duration between two `"Mon YYYY"` labels, e.g. `"2yrs 3 mos"`.
 * `end` may be null/undefined to mean "today".
 *
 * The previous implementation did `new Date('1 ' + str)`, which only parses in
 * some locales and returned "Invalid Date" for the Spanish month names on the
 * ES CV.
 */
export function formatDuration(start?: string | null, end?: string | null): string {
  const from = parseMonthYear(start);
  if (!from) return '';
  const to = end ? parseMonthYear(end) : new Date();
  if (!to) return '';

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) return '';

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}${years === 1 ? 'yr' : 'yrs'}`);
  if (months > 0) parts.push(`${months} mos`);
  return parts.join(' ');
}
