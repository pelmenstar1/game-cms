export function mergeArrays<T>(...inputs: (T[] | undefined)[]): T[] {
  return inputs.flatMap((input) => input ?? []);
}
