export function removeIndex<T>(values: readonly T[], targetIndex: number) {
  const result = [...values];
  result.splice(targetIndex, 1);

  return result;
}

export function removeValueInPlace<T>(values: T[], value: T) {
  const index = values.indexOf(value);

  if (index !== -1) {
    values.splice(index, 1);
  }
}
