export function filterOutNullable<T>(
  values: readonly (T | null | undefined)[]
): T[] {
  return values.filter((value) => value !== null && value !== undefined);
}
