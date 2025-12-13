import { useCallback } from 'react';

export function useAsyncCallback<Args extends unknown[]>(
  callback: (...args: Args) => Promise<unknown>,
  deps: unknown[]
) {
  return useCallback((...args: Args) => {
    void callback(...args);
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  }, deps);
}
