import type {
  InferQueryResult,
  QueryResult,
  QueryStatus,
  SuccessQueryResult,
} from '@game-cms/shared';
import { ErrorMessage, IndeterminateCircularProgress } from '@game-cms/ui';
import type { ReactNode } from 'react';

type InferValues<T extends QueryResult[]> = {
  [K in keyof T]: InferQueryResult<T[K]>;
};
type RenderFn<T extends QueryResult[]> = (value: InferValues<T>) => ReactNode;

export interface MultipleDataLoaderProps<T extends QueryResult[]> {
  className?: string;
  result: T;
  onRetry?: () => void;
  children: RenderFn<T>;
}

function isAnyHaveStatus<T extends QueryStatus>(
  result: QueryResult[],
  status: T
): result is Extract<QueryResult, { status: T }>[] {
  return result.some((value) => value.status === status);
}

function renderSuccess<T extends QueryResult[]>(
  result: T,
  render: RenderFn<T>
) {
  return render(
    (result as SuccessQueryResult[]).map(({ value }) => value) as InferValues<T>
  );
}

export function MultipleDataLoader<T extends QueryResult[]>({
  className,
  result,
  onRetry,
  children,
}: MultipleDataLoaderProps<T>) {
  return (
    <div className={className}>
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
