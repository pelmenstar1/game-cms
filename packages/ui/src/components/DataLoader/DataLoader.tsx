import type { QueryResult } from '@game-cms/shared';
import type { ReactNode } from 'react';

import { ErrorMessage } from '../ErrorMessage';
import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';

export interface DataLoaderProps<T> {
  className?: string;
  result: QueryResult<T>;
  onRetry?: () => void;
  children: (value: T) => ReactNode;
}

export function DataLoader<T>({
  className,
  result,
  onRetry,
  children,
}: DataLoaderProps<T>) {
  return (
    <div className={className}>
      {result.status === 'pending' ? (
        <IndeterminateCircularProgress />
      ) : result.status === 'error' ? (
        <ErrorMessage onRetry={onRetry}>Cannot load the data</ErrorMessage>
      ) : (
        children(result.value)
      )}
    </div>
  );
}
