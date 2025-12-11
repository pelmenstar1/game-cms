import {
  classNames,
  ErrorMessage,
  IndeterminateCircularProgress,
} from '@game-cms/ui';
import type { ReactNode } from 'react';

import type {
  ApiQueryResult,
  ApiQueryStatus,
  InferApiQueryResult,
  SuccessApiQueryResult,
} from '@/hooks/useApiQuery';

import styles from './MultipleDataLoader.module.scss';

type InferValues<T extends ApiQueryResult[]> = {
  [K in keyof T]: InferApiQueryResult<T[K]>;
};
type RenderFn<T extends ApiQueryResult[]> = (
  value: InferValues<T>
) => ReactNode;

export interface MultipleDataLoaderProps<T extends ApiQueryResult[]> {
  className?: string;
  result: T;
  onRetry?: () => void;
  children: RenderFn<T>;
}

function isAnyHaveStatus<T extends ApiQueryStatus>(
  result: ApiQueryResult[],
  status: T
): result is Extract<ApiQueryResult, { status: T }>[] {
  return result.some((value) => value.status === status);
}

function renderSuccess<T extends ApiQueryResult[]>(
  result: T,
  render: RenderFn<T>
) {
  return render(
    (result as SuccessApiQueryResult[]).map(
      ({ value }) => value
    ) as InferValues<T>
  );
}

export function MultipleDataLoader<T extends ApiQueryResult[]>({
  className,
  result,
  onRetry,
  children,
}: MultipleDataLoaderProps<T>) {
  return (
    <div className={classNames(styles.root, className)}>
      {isAnyHaveStatus(result, 'pending') ? (
        <IndeterminateCircularProgress />
      ) : isAnyHaveStatus(result, 'error') ? (
        <ErrorMessage onRetry={onRetry}>Cannot load the data</ErrorMessage>
      ) : (
        renderSuccess(result, children)
      )}
    </div>
  );
}
