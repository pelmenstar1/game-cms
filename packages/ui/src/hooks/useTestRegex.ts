import { useMemo } from 'react';

export function useTestRegex(value: string, pattern: RegExp): boolean {
  return useMemo(() => pattern.test(value), [pattern, value]);
}
