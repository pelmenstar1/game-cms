export function removeIndex<T>(values: readonly T[], targetIndex: number) {
  const result = [...values];
  result.splice(targetIndex, 1);

  return result;
}
