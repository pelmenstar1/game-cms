import { formatTwoDigit } from '../string/formatter.js';

type DateLike = Date | string | number;

export const MINUTE_MS = 60 * 1000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;
export const WEEK_MS = 7 * DAY_MS;

function parseDate(date: DateLike): Date {
  return date instanceof Date ? date : new Date(date);
}

export function formatDate(date: DateLike) {
  return parseDate(date).toLocaleDateString('uk-UA', { dateStyle: 'long' });
}

export function formatDateTime(date: DateLike) {
  return parseDate(date).toLocaleString('uk-UA', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export function toLocalISOString(date: Date): string {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000
  ).toISOString();
}

export function formatDateOnly(date: Date): string {
  return `${date.getUTCFullYear()}-${formatTwoDigit(date.getUTCMonth() + 1)}-${formatTwoDigit(date.getUTCDate())}`;
}

// Gets normal people's week day. 1 - Monday, 7 - Sunday
export function getWeekday(date: Date): number {
  const value = date.getUTCDay();

  return value === 0 ? 7 : value;
}

export function alignDateByWeek(date: Date): number {
  const weekday = getWeekday(date);
  let time = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ).getTime();
  time -= (weekday - 1) * DAY_MS;

  return time;
}
