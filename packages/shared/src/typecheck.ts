import type { UnknownObject } from './object/types.js';

export function isNonNullObject(value: unknown): value is UnknownObject {
  return typeof value === 'object' && value !== null;
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return isNonNullObject(value) && 'then' in value;
}
