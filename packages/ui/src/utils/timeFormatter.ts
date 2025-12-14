import type { RelativeTimeUnit, TimeSpec } from '@game-cms/shared/chrono';

const unitNames: Record<RelativeTimeUnit, [number, string] | undefined> = {
  s: [0, 'second'],
  m: [1, 'minute'],
  h: [2, 'hour'],
  d: [3, 'day'],
  w: [4, 'week'],
};

export function formatTimeSpec(spec: TimeSpec) {
  const parts = spec.split(' ');
  const result: [number, string][] = [];

  for (const part of parts) {
    const unit = part[part.length - 1];
    const unitInfo = unitNames[unit as RelativeTimeUnit];
    if (unitInfo === undefined) {
      return null;
    }

    const [index, unitName] = unitInfo;

    const amount = Number.parseInt(part.slice(0, -1));
    if (Number.isNaN(amount) || amount <= 0) {
      return null;
    }

    const finalUnitName = amount > 1 ? `${unitName}s` : unitName;

    result.push([index, `${amount} ${finalUnitName}`]);
  }

  result.sort(([a], [b]) => b - a);

  return result.map(([, text]) => text).join(', ');
}
