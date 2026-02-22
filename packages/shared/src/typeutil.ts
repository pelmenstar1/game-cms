export type Replace<T, U> = Omit<T, keyof U> & U;
export type RequiredProperty<T, K extends keyof T> = Replace<
  T,
  Required<Record<K, NonNullable<T[K]>>>
>;

export type MaybeConcat<T extends string, U extends string> = T | `${T}${U}`;

export type IsAllOptional<T> = Partial<T> extends T ? true : false;

export type RequiredIf<T, C> = C extends true ? Required<T> : T;
export type PartialIf<T, C> = C extends true ? Partial<T> : T;
export type PartialIfUndefined<T, U> = U extends undefined ? Partial<T> : T;
export type UndefinedIf<C> = C extends true ? undefined : never;

export type AnyKeyInObject<T, K extends PropertyKey> = [true] extends {
  [K2 in K]: T extends Record<K2, unknown> ? [true] : [false];
}[K]
  ? true
  : false;

export type ResultOrError<T, Error> =
  | { result: T; error?: undefined }
  | { result?: undefined; error: Error };

export type IfExtends<T, U> = T extends U ? T : U;

type ConditionalPartialArgs = Record<
  string,
  { optional: unknown; value: unknown }
>;

type ConditionalKeys<T extends ConditionalPartialArgs> = {
  [K in keyof T]: T[K]['optional'] extends true ? K : never;
}[keyof T];

export type BaseConditionalPartial<T extends ConditionalPartialArgs> = Replace<
  T,
  {
    [K in ConditionalKeys<T>]?: T[K];
  }
>;

type SelectValue<T extends ConditionalPartialArgs> = {
  [K in keyof T]: NonNullable<T[K]>['value'];
};

export type ConditionalPartial<T extends ConditionalPartialArgs> = SelectValue<
  BaseConditionalPartial<T>
>;

export type GetPropertyOr<T, K extends PropertyKey, F> =
  T extends Record<K, unknown> ? T[K] : F;

export type IfNever<T, F> = T extends never ? F : T;

export type DefaultExport<T = unknown> = { default: T };

type AllUndefined<K extends PropertyKey> = {
  [P in K]?: undefined;
};

export type Or<T, U> =
  | (T & AllUndefined<keyof U>)
  | (U & AllUndefined<keyof T>);

export type UnpackArray<T> = T extends unknown[] ? T[number] : T;

export type FromEntries<T extends [PropertyKey, unknown]> = {
  [K in T[0]]: Extract<T, [K, unknown]>[1];
};
