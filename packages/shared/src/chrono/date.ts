import { DAY_MS } from './constants.js';

export function isValidDate(date: Date) {
  return !Number.isNaN(date.getTime());
}

export function isSameUTCDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export function daysFromMonday(date: Date) {
  const day = date.getUTCDay();

  return day === 0 ? 6 : day - 1;
}

export function isSameUTCWeek(a: Date, b: Date): boolean {
  const mondayA = new Date(a.getTime() - daysFromMonday(a) * DAY_MS);
  const mondayB = new Date(b.getTime() - daysFromMonday(b) * DAY_MS);

  return isSameUTCDay(mondayA, mondayB);
}
