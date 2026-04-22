import {
  DAY_MS,
  isSameUTCDay,
  isSameUTCWeek,
  isValidDate,
  MONTH_NAMES,
} from '@game-cms/shared/chrono';

const MAX_PROXIMITY_MS = 3 * DAY_MS;

export function createDateIndex(data: Date): string[] {
  const year = data.getUTCFullYear().toString();
  const monthIndex = data.getUTCMonth();
  const monthNum = monthIndex + 1;
  const month = monthNum.toString();

  const monthName = MONTH_NAMES[monthIndex];
  const monthShort = monthName.slice(0, 3);

  const day = data.getUTCDate().toString();

  const monthPadded = month.padStart(2, '0');
  const dayPadded = day.padStart(2, '0');

  return [
    year,
    month,
    monthPadded,
    monthName,
    monthShort,
    day,
    dayPadded,
    `${year}-${month}`,
    `${year}-${monthPadded}`,
    `${year}-${monthPadded}-${dayPadded}`,
  ];
}

export function computeDateScore(
  query: string,
  storage: Date,
  searchIndex: string[]
): number {
  const lowerQuery = query.toLowerCase().trim();
  const now = new Date();

  if (lowerQuery === 'today') {
    return isSameUTCDay(storage, now) ? 1 : 0;
  }

  if (lowerQuery === 'yesterday') {
    return isSameUTCDay(storage, new Date(now.getTime() - DAY_MS)) ? 1 : 0;
  }

  if (lowerQuery === 'this week') {
    return isSameUTCWeek(storage, now) ? 1 : 0;
  }

  if (lowerQuery === 'this month') {
    return storage.getUTCMonth() === now.getUTCMonth() &&
      storage.getUTCFullYear() === now.getUTCFullYear()
      ? 1
      : 0;
  }

  if (lowerQuery === 'this year') {
    return storage.getUTCFullYear() === now.getUTCFullYear() ? 1 : 0;
  }

  if (searchIndex.some((token) => token.startsWith(lowerQuery))) {
    return 1;
  }

  const parsedQuery = new Date(lowerQuery);

  if (isValidDate(parsedQuery)) {
    const distance = Math.abs(storage.getTime() - parsedQuery.getTime());

    if (distance <= MAX_PROXIMITY_MS) {
      return 1 - distance / MAX_PROXIMITY_MS;
    }
  }

  return 0;
}
