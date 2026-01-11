export type Replace<T, U> = Omit<T, keyof U> & U;
export type MaybePromise<T> = T | Promise<T>;
export type RequiredProperty<T, K extends keyof T> = Replace<
  T,
  Required<Record<K, NonNullable<T[K]>>>
>;

export type MaybeConcat<T extends string, U extends string> = T | `${T}${U}`;

export type IsAllOptional<T> = Partial<T> extends T ? true : false;

export type RequiredIf<T, C> = C extends true ? Required<T> : T;

export type AnyKeyInObject<T, K extends PropertyKey> = [true] extends {
  [K2 in K]: T extends Record<K2, unknown> ? [true] : [false];
}[K]
  ? true
  : false;

export type ResultOrError<T, Error> =
  | { result: T; error?: undefined }
  | { result?: undefined; error: Error };
