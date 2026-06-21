import { RequestFn } from '@game-cms/core/api/client';
import { QueryResult } from '@game-cms/shared';
import { useCallback, useEffect, useState } from 'react';

import {
  ApiRequestOptions,
  ResolveApiRequestResult,
} from '../context/ApiClientContext.js';
import { useApiClient } from './useApiClient.js';

interface ApiQueryOptions<T> extends ApiRequestOptions {
  isEnabled?: boolean;
  disabledData?: NoInfer<T>;
}

type QueryResultWithOptions<
  T,
  Options extends ApiQueryOptions<T>,
> = QueryResult<ResolveApiRequestResult<T, Options>>;

type UseApiQueryResult<R, Options extends ApiQueryOptions<R>> = [
  value: QueryResultWithOptions<R, Options>,
  retry: () => void,
];

export function useApiQuery<
  Args extends unknown[],
  R,
  Options extends ApiQueryOptions<R>,
>(
  queryFn: RequestFn<Args, R>,
  args?: Args,
  options?: Options
): UseApiQueryResult<R, Options> {
  const isEnabled = options?.isEnabled ?? true;

  const client = useApiClient();

  const [result, setResult] = useState<QueryResultWithOptions<R, Options>>({
    status: 'pending',
  });

  const resolvedArgs = (args ?? []) as Args;

  const worker = useCallback(() => {
    if (!isEnabled) {
      const disabledData = options?.disabledData;

      if (disabledData !== undefined) {
        setResult({ status: 'success', value: disabledData });
      }

      return;
    }

    const { promise, abort } = client.makeApiRequest<Args, R, Options>(
      queryFn,
      resolvedArgs,
      options
    );

    promise
      .then((value) => {
        setResult({ status: 'success', value });
      })
      .catch((error: unknown) => {
        console.error(error);

        setResult({ status: 'error', error });
      });

    return abort;
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, [...resolvedArgs, client, isEnabled]);

  useEffect(worker, [worker]);

  return [result, worker];
}
