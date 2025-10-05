export type Time = `${number}:${number}`;

// Returns distance (total minutes) between two time points.
function distanceBetween(a: Time, b: Time): number {
  const aColonIndex = a.indexOf(':');
  const bColonIndex = b.indexOf(':');

  const aHour = Number.parseInt(a.slice(0, aColonIndex));
  const aMinute = Number.parseInt(a.slice(aColonIndex + 1));

  const bHour = Number.parseInt(b.slice(0, bColonIndex));
  const bMinute = Number.parseInt(b.slice(bColonIndex + 1));

  return Math.abs((aHour - bHour) * 60 + (aMinute - bMinute));
}

export function findNearestTimePoint<T extends Time>(
  times: readonly T[],
  target: Time
): T | undefined {
  let minTime: T | undefined;
  let minDistance: number = Number.POSITIVE_INFINITY;

  for (const time of times) {
    const distance = distanceBetween(time, target);
    if (Number.isNaN(distance)) {
      throw new TypeError('Invalid time points');
    }

    if (distance < minDistance) {
      minDistance = distance;
      minTime = time;
    }
  }

  return minTime;
}

// Date is required to get timezone offset - it might be different in different points in time.
// Returns offset in seconds.
export function getTimeZoneOffset(date: Date, timeZone: string): number {
  const longOffsetFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  });

  const longOffsetString = longOffsetFormatter.format(date);

  const gmtIndex = longOffsetString.indexOf('GMT');
  const { hour, minute } = parseTime(longOffsetString.slice(gmtIndex + 3));

  return (hour * 3600 + minute * 60) * 1000;
}

export function getLocalDate(date: Date, timeZone: string): Date {
  const offset = getTimeZoneOffset(date, timeZone);

  return new Date(date.getTime() + offset);
}

export function getLocalNow(timeZone: string): Date {
  return getLocalDate(new Date(), timeZone);
}

export function parseTime(time: string): { hour: number; minute: number } {
  const colonIndex = time.indexOf(':');

  return {
    hour: Number.parseInt(time.slice(0, colonIndex)),
    minute: Number.parseInt(time.slice(colonIndex + 1)),
  };
}
