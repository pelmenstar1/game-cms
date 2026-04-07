export function uniqueArray<T>(array: readonly T[]): T[] {
  return [...new Set(array)];
}
