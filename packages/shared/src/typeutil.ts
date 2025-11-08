export type Replace<T, U> = Omit<T, keyof U> & U;
export type MaybePromise<T> = T | Promise<T>;
export type RequiredProperty<T, K extends keyof T> = Replace<
  T,
  Required<Record<K, T[K]>>
>;
