// Contains values/functions that can be read/executed only on both client-side and server-side.
export interface ComponentClientContext {}

export type ComponentClientContextMap<K extends PropertyKey = string> = Record<
  K,
  ComponentClientContext | undefined
>;
