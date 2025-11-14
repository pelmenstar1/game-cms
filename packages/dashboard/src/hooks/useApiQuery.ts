import type { RequestContext, RequestFn } from '@game-cms/client';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { createAbortController } from '@/utils/abortController';
import { type ApiRedirectOptions, withApiErrorHandling } from '@/utils/api';

import { useApiClient } from './useApiClient';

export type ApiQueryResult<T> =
  | {
      status: 'pending';
    }
  | {
      status: 'error';
      error: unknown;
    }
  | {
      status: 'success';
      value: T;
    };

type ApiQueryOptions = ApiRedirectOptions;
type UseApiQueryResult<R> = [value: ApiQueryResult<R>, retry: () => void];

export function useApiQuery<R>(
  queryFn: RequestFn<[], R>,
  options?: ApiQueryOptions
): UseApiQueryResult<R>;

export function useApiQuery<Args extends unknown[], R>(
  queryFn: RequestFn<Args, R>,
  args: Args,
  options?: ApiQueryOptions
): UseApiQueryResult<R>;

export function useApiQuery<Args extends unknown[], R>(
  queryFn: RequestFn<Args, R>,
  args?: Args,
  options?: ApiQueryOptions
): UseApiQueryResult<R> {
  const client = useApiClient();
  const navigate = useNavigate();

  const [result, setResult] = useState<ApiQueryResult<R>>({
    status: 'pending',
  });

  const resolvedArgs = (args ?? []) as Args;

  const worker = useCallback(() => {
    const abortController = createAbortController();
    const context: RequestContext = { client, abortController };

    const doRequest = withApiErrorHandling(queryFn, navigate, options);

    doRequest(context, ...resolvedArgs)
      .then((value) => {
        setResult({ status: 'success', value });
      })
      .catch((error: unknown) => {
        setResult({ status: 'error', error });
      });

    return () => {
      abortController?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...resolvedArgs, client, queryFn, navigate]);

  useEffect(worker, [worker]);

  return [result, worker] as const;
}
