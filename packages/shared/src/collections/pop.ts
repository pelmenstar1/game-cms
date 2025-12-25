export function checkedPop<T>(values: T[]): T {
  const result = values.pop();
  if (result === undefined) {
    throw new Error('Array is empty');
  }

  return result;
}
