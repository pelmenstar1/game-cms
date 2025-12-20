import type { PagingOptions } from '@game-cms/shared';
import { useMemo } from 'react';

export const usePagingOptions = (page: number, size: number): PagingOptions => {
  return useMemo(() => ({ size, offset: (page - 1) * size }), [page, size]);
};
