declare global {
  interface Array<T> {
    includes(value: unknown): value is T;
  }

  interface ReadonlyArray<T> {
    includes(value: unknown): value is T;
  }

  interface Set<T> {
    has(value: unknown): value is T;
  }
}
