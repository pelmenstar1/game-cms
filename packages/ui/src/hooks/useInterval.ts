import { useEffect } from 'react';

export function useInterval(delay: number, callback: () => void) {
  useEffect(() => {
    const id = setInterval(callback, delay);

    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);
}
