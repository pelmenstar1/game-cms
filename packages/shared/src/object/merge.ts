export function mergeObjects<T extends object>(values: T[]): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.assign({} as T, ...values);
}
