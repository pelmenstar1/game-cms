export function setAddMany<T>(target: Set<T>, values: T[]) {
  for (const value of values) {
    target.add(value);
  }
}
