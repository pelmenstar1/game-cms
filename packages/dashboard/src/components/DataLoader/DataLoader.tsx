import {
  classNames,
  ErrorMessage,
  IndeterminateCircularProgress,
} from '@game-cms/ui';
import type { ReactNode } from 'react';

import type { ApiQueryResult } from '@/hooks/useApiQuery';

import styles from './DataLoader.module.scss';

export interface DataLoaderProps<T> {
  className?: string;
  result: ApiQueryResult<T>;
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
    <div className={classNames(styles.root, className)}>
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
