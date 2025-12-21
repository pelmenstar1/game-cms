import type { RequestFn } from '@game-cms/client';
import { useMemo } from 'react';

import {
  type ApiRedirectOptions,
  makeApiRequest,
  type MakeApiRequestContext,
} from '@/utils/api';

import { useApiClient } from './useApiClient';
import { useTypedNavigate } from './useTypedNavigate';

type ApiActionOptions = ApiRedirectOptions;

export function useApiAction<Args extends unknown[], R>(
  queryFn: RequestFn<Args, R>,
  redirectOptions?: ApiActionOptions
) {
  const client = useApiClient();
  const navigate = useTypedNavigate();

  const makeAction = useMemo(() => {
    const context: MakeApiRequestContext = {
      navigate,
      requestContext: { client },
    };

    return (...args: Args) =>
      makeApiRequest(queryFn, args, context, redirectOptions);
  }, [client, redirectOptions, navigate, queryFn]);

  return makeAction;
}
