export type Replace<T, U> = Omit<T, keyof U> & U;
export type MaybePromise<T> = T | Promise<T>;
