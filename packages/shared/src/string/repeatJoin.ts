export function repeatJoin(
  value: string,
  delimiter: string,
  n: number
): string {
  let result = '';

  for (let i = 0; i < n; i++) {
    result += value;

    if (i < n - 1) {
      result += delimiter;
    }
  }

  return result;
}
