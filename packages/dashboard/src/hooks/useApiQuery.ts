import type { RequestFn } from '@game-cms/client';
import { useCallback, useEffect, useState } from 'react';

import { createAbortController } from '@/utils/abortController';
import {
  type ApiRedirectOptions,
  makeApiRequest,
  type MakeApiRequestContext,
} from '@/utils/api';

import { useApiClient } from './useApiClient';
import { useTypedNavigate } from './useTypedNavigate';

export type SuccessApiQueryResult<T = unknown> = {
  status: 'success';
  value: T;
};

export type ApiQueryResult<T = unknown> =
  | {
      status: 'pending';
    }
  | {
      status: 'error';
      error: unknown;
    }
  | SuccessApiQueryResult<T>;

export type ApiQueryStatus = ApiQueryResult['status'];

export type InferApiQueryResult<T> =
  T extends SuccessApiQueryResult<infer R> ? R : never;

type ApiQueryOptions = ApiRedirectOptions;
type UseApiQueryResult<R> = [value: ApiQueryResult<R>, retry: () => void];

export function useApiQuery<Args extends unknown[], R>(
  queryFn: RequestFn<Args, R>,
  args?: Args,
  redirectOptions?: ApiQueryOptions
): UseApiQueryResult<R> {
  const client = useApiClient();
  const navigate = useTypedNavigate();

  const [result, setResult] = useState<ApiQueryResult<R>>({
    status: 'pending',
  });

  const resolvedArgs = (args ?? []) as Args;

  const worker = useCallback(() => {
    const abortController = createAbortController();
    const context: MakeApiRequestContext = {
      requestContext: { client, abortController },
      navigate,
    };

    makeApiRequest(queryFn, resolvedArgs, context, redirectOptions)
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
  }, [...resolvedArgs, client, navigate]);

  useEffect(worker, [worker]);

  return [result, worker] as const;
}
