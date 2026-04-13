import { filterOutNullable } from '../collections/filter.js';

export function fromEntriesNullable<K extends PropertyKey, T>(
  entries: readonly (readonly [K, T] | null | undefined)[]
) {
  return Object.fromEntries(filterOutNullable(entries)) as Record<K, T>;
}
