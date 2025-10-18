export function mergeObjects<T extends object>(values: T[]): T {
  const result = {} as T;

  for (const value of values) {
    Object.assign(result, value);
  }

  return result;
}
