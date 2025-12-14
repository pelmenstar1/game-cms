const relativeUnits = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
  w: 7 * 24 * 60 * 60,
};

export type RelativeTimeUnit = keyof typeof relativeUnits;
export type RelativeTime = `${number}${RelativeTimeUnit}`;

export type TimeSpec = string;

function getUnitSeconds(time: string) {
  const unit = time.slice(-1);
  const unitSeconds = relativeUnits[unit as RelativeTimeUnit];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return unitSeconds ?? Number.NaN;
}

function baseParseRelativeTimeToTotalSeconds(time: string) {
  const unitSeconds = getUnitSeconds(time);

  const rawValue = time.slice(0, -1);
  const value = Number.parseInt(rawValue);

  return value * unitSeconds;
}

export function parseRelativeTimeToTotalSeconds(time: string) {
  const result = baseParseRelativeTimeToTotalSeconds(time);

  if (Number.isNaN(result)) {
    throw new TypeError(`Invalid time value: ${time}`);
  }

  return result;
}

export function parseTimeSpec(time: TimeSpec) {
  let totalSeconds = 0;
  const parts = time.split(' ');
  const seenUnits = new Set<number>();

  for (const part of parts) {
    const unit = getUnitSeconds(part);
    if (Number.isNaN(unit) || seenUnits.has(unit)) {
      return Number.NaN;
    }

    totalSeconds += baseParseRelativeTimeToTotalSeconds(part as RelativeTime);

    seenUnits.add(unit);
  }

  return totalSeconds;
}
