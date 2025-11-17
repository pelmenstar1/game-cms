const relativeUnits = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
  w: 7 * 24 * 60 * 60,
};

export type RelativeTimeUnit = keyof typeof relativeUnits;
export type RelativeTime = `${number}${RelativeTimeUnit}`;

export function parseRelativeTimeToTotalSeconds(time: RelativeTime) {
  const unit = time.slice(-1);
  const unitSeconds = relativeUnits[unit as RelativeTimeUnit];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (unitSeconds === undefined) {
    throw new Error(`Invalid time unit: ${unit}`);
  }

  const rawValue = time.slice(0, -1);
  const value = Number.parseInt(rawValue);
  if (Number.isNaN(value)) {
    throw new TypeError(`Invalid time value: ${rawValue}`);
  }

  return value * unitSeconds;
}
