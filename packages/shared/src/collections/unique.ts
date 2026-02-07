export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}
