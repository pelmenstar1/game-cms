export type Replace<T, U> = Omit<T, keyof U> & U;
export type MaybePromise<T> = T | Promise<T>;
export type RequiredProperty<T, K extends keyof T> = Replace<
  T,
  Required<Record<K, NonNullable<T[K]>>>
>;

export type MaybeConcat<T extends string, U extends string> = T | `${T}${U}`;

type OrVariant<T, U> = T & { [K in keyof U]?: undefined };

export type Or<T, U> = OrVariant<T, U> | OrVariant<U, T>;

export type IsAllOptional<T> = Partial<T> extends T ? true : false;
