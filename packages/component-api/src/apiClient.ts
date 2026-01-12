import type { RequestFn } from '@game-cms/core/api';
import type { QueryResult } from '@game-cms/shared';
import { contextUseFactory } from '@game-cms/ui';
import React, { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApiRedirectOptions {}

export type ApiClientContextType = {
  makeApiRequest: <Args extends unknown[], T>(
    fn: RequestFn<Args, T>,
    args: Args,
    redirectOptions?: ApiRedirectOptions
  ) => { promise: Promise<T>; abort: () => void };
};

export const ApiClientContext =
  /*@__PURE__*/ React.createContext<ApiClientContextType | null>(null);

export const useApiClient = contextUseFactory(
  ApiClientContext,
  'ApiClientContext'
);

type ApiActionOptions = ApiRedirectOptions;

export function useApiAction<Args extends unknown[], R>(
  queryFn: RequestFn<Args, R>,
  redirectOptions?: ApiActionOptions
) {
  const client = useApiClient();

  return useCallback(
    (...args: Args) => {
      const { promise } = client.makeApiRequest(queryFn, args, redirectOptions);

      return promise;
    },
    [client, queryFn, redirectOptions]
  );
}

type ApiQueryOptions = ApiRedirectOptions;
type UseApiQueryResult<R> = [value: QueryResult<R>, retry: () => void];

export function useApiQuery<Args extends unknown[], R>(
  queryFn: RequestFn<Args, R>,
  args?: Args,
  redirectOptions?: ApiQueryOptions
): UseApiQueryResult<R> {
  const client = useApiClient();

  const [result, setResult] = useState<QueryResult<R>>({
    status: 'pending',
  });

  const resolvedArgs = (args ?? []) as Args;

  const worker = useCallback(() => {
    const { promise, abort } = client.makeApiRequest(
      queryFn,
      resolvedArgs,
      redirectOptions
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...resolvedArgs, client]);

  useEffect(worker, [worker]);

  return [result, worker] as const;
}
