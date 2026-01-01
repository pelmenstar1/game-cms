export function removeIndex<T>(values: T[], targetIndex: number) {
  const result = [...values];
  result.splice(targetIndex, 1);

  return result;
}
