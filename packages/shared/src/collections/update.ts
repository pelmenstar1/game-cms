export function withUpdatedItem<T>(array: T[], index: number, newItem: T): T[] {
  const result = [...array];
  result[index] = newItem;

  return result;
}
