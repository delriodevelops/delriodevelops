import { describe, expect, it, vi, afterEach } from 'vitest';
import { formatDuration, parseMonthYear } from '../dates';

describe('parseMonthYear', () => {
  it('parses English month labels', () => {
    expect(parseMonthYear('Mar 2025')?.getMonth()).toBe(2);
  });

  it('parses Spanish month labels, which the old Date() parsing could not', () => {
    const parsed = parseMonthYear('Ene 2022');
    expect(parsed?.getMonth()).toBe(0);
    expect(parsed?.getFullYear()).toBe(2022);
  });

  it('returns null for junk', () => {
    expect(parseMonthYear('not a date')).toBeNull();
    expect(parseMonthYear('')).toBeNull();
  });
});

describe('formatDuration', () => {
  afterEach(() => vi.useRealTimers());

  it('formats a span in years and months', () => {
    expect(formatDuration('Feb 2023', 'Feb 2024')).toBe('1yr');
    expect(formatDuration('Jan 2022', 'Feb 2023')).toBe('1yr 1 mos');
  });

  it('formats a sub-year span', () => {
    expect(formatDuration('Jan 2024', 'Apr 2024')).toBe('3 mos');
  });

  it('measures an open-ended role against today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 1));
    expect(formatDuration('Mar 2025', null)).toBe('1yr');
  });

  it('returns an empty string when the input is unparseable', () => {
    expect(formatDuration('nonsense', 'Feb 2024')).toBe('');
  });
});
