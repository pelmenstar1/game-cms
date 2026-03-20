// Contains values/functions that can be read/executed only on server-side.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentBackContext {}

export type ComponentBackContextMap = Record<
  string,
  ComponentBackContext | undefined
>;
