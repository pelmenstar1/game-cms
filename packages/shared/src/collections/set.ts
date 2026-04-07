import type { SizedIterable } from './types.js';

export function setAddMany<T>(target: Set<T>, values: readonly T[]) {
  for (const value of values) {
    target.add(value);
  }
}

export function setDeleteMany<T>(target: Set<T>, values: readonly T[]) {
  for (const value of values) {
    target.delete(value);
  }
}

export function setEquals<T>(
  current: ReadonlySet<T>,
  other: SizedIterable<T>
): boolean {
  if (current.size !== (other.size ?? other.length)) {
    return false;
  }

  for (const item of other) {
    if (!current.has(item)) {
      return false;
    }
  }

  return true;
}
