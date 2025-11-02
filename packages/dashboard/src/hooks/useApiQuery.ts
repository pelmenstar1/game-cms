import type { RequestContext } from '@game-cms/client';
import { useCallback, useEffect, useState } from 'react';

import { createAbortController } from '@/utils/abortController';

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

export function useApiQuery<Args extends unknown[], R>(
  queryFn: (context: RequestContext, ...args: Args) => Promise<R>,
  args: Args
) {
  const client = useApiClient();

  const [result, setResult] = useState<ApiQueryResult<R>>({
    status: 'pending',
  });

  const worker = useCallback(() => {
    const abortController = createAbortController();
    const context: RequestContext = { client, abortController };

    queryFn(context, ...args)
      .then((value) => {
        setResult({ status: 'success', value });
      })
      .catch((error: unknown) => {
        setResult({ status: 'error', error });
      });

    return () => {
      abortController?.abort();
    };
  }, [args, client, queryFn]);

  useEffect(worker, [worker]);

  return [result, worker] as const;
}
