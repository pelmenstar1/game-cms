export function cycleArray<T>(array: readonly T[], current: T): T {
  const idx = array.indexOf(current);

  if (idx === -1) {
    throw new Error('Current value not found in the array');
  }

  return array[(idx + 1) % array.length];
}
