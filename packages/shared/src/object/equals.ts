import type { PlainValue } from './types.js';

export function deepEquals(a: PlainValue, b: PlainValue): boolean {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  if (typeof a === 'object') {
    if (typeof b !== 'object') {
      return false;
    }

    if (a === null) {
      return b === null;
    }

    if (b === null) {
      return false;
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (const key of aKeys) {
      const aValue = a[key];
      const bValue = b[key];

      if (!deepEquals(aValue, bValue)) {
        return false;
      }
    }

    return true;
  }

  return a === b;
}
