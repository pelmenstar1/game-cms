export function omit<T extends object, K extends keyof T>(
  value: T,
  key: K
): Omit<T, K> {
  const result = { ...value };
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete result[key];

  return result;
}
