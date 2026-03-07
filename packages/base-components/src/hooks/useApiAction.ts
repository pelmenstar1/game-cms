import { RequestFn } from '@game-cms/core/api/client';
import { useCallback } from 'react';

import { ApiActionOptions } from '../context/ApiClientContext.js';
import { useApiClient } from './useApiClient.js';

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
