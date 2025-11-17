export interface RequestInitWithHeaders extends RequestInit {
  headers: Headers;
}

export type MaybeSearch<T extends string> = T | `${T}?${string}`;
