import { removeValueInPlace } from '@game-cms/shared/collections';
import { useCallback, useEffect, useRef } from 'react';

export function useCancellableTimeout() {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      for (const id of timeoutsRef.current) {
        clearTimeout(id);
      }
    };
  }, []);

  return useCallback((callback: () => void, delay?: number) => {
    const timeouts = timeoutsRef.current;

    const id = setTimeout(() => {
      removeValueInPlace(timeouts, id);

      callback();
    }, delay);

    timeouts.push(id);
  }, []);
}
