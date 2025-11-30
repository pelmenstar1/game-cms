export function filterOutNullable<T>(values: (T | null | undefined)[]): T[] {
  return values.filter((value) => value !== null && value !== undefined);
}
