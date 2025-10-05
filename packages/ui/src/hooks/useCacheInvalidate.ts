import { useCallback, useState } from 'react';

type CacheInvalidateResult<T> = {
  src: T;
  reload: () => void;
};

export function useCacheInvalidate<T extends string | undefined>(
  value: T
): CacheInvalidateResult<T> {
  const [cacheInvalidate, setCacheInvalidate] = useState<number>();

  const reload = useCallback(() => {
    setCacheInvalidate(Date.now());
  }, []);

  return {
    src: (value === undefined ? undefined : `${value}?${cacheInvalidate}`) as T,
    reload,
  };
}
