export type MaybeFactory<T, Args extends unknown[]> =
  | T
  | ((...args: Args) => T);

export function resolveMaybeFactory<T extends object, Args extends unknown[]>(
  factory: MaybeFactory<T, Args>,
  ...args: Args
): T {
  return typeof factory === 'function' ? factory(...args) : factory;
}
