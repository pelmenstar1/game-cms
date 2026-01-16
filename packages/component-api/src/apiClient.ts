import type { RequestFn } from '@game-cms/core/api';
import type { QueryResult } from '@game-cms/shared';
import { contextUseFactory } from '@game-cms/ui';
import React, { useCallback, useEffect, useState } from 'react';

export interface ApiRequestOptions {
  redirectOnUnauthorized?: boolean;
  redirectOnNotFound?: boolean;
  nullIfNotFound?: boolean;
}

export type ResolveApiRequestResult<
  T,
  Options extends ApiActionOptions,
> = Options['nullIfNotFound'] extends true ? T | null : T;

export type ApiClientContextType = {
  makeApiRequest: <
    Args extends unknown[],
    T,
    Options extends ApiRequestOptions,
  >(
    fn: RequestFn<Args, T>,
    args: Args,
    options?: ApiRequestOptions
  ) => {
    promise: Promise<ResolveApiRequestResult<T, Options>>;
    abort: () => void;
  };
};

export const ApiClientContext =
  /*@__PURE__*/ React.createContext<ApiClientContextType | null>(null);

export const useApiClient = contextUseFactory(
  ApiClientContext,
  'ApiClientContext'
);

type ApiActionOptions = ApiRequestOptions;

export function useApiAction<
  Args extends unknown[],
  R,
  Options extends ApiActionOptions,
>(queryFn: RequestFn<Args, R>, options?: Options) {
  const client = useApiClient();

  return useCallback(
    (...args: Args) => {
      const { promise } = client.makeApiRequest<Args, R, Options>(
        queryFn,
        args,
        options
      );

      return promise;
    },
    [client, queryFn, options]
  );
}

type ApiQueryOptions = ApiRequestOptions;
type QueryResultWithOptions<T, Options extends ApiQueryOptions> = QueryResult<
  ResolveApiRequestResult<T, Options>
>;

type UseApiQueryResult<R, Options extends ApiQueryOptions> = [
  value: QueryResultWithOptions<R, Options>,
  retry: () => void,
];

export function useApiQuery<
  Args extends unknown[],
  R,
  Options extends ApiQueryOptions,
>(
  queryFn: RequestFn<Args, R>,
  args?: Args,
  options?: Options
): UseApiQueryResult<R, Options> {
  const client = useApiClient();

  const [result, setResult] = useState<QueryResultWithOptions<R, Options>>({
    status: 'pending',
  });

  const resolvedArgs = (args ?? []) as Args;

  const worker = useCallback(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...resolvedArgs, client]);

  useEffect(worker, [worker]);

  return [result, worker];
}
