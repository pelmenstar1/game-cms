import type { RequestFn } from '@game-cms/client';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { type ApiRedirectOptions, withApiErrorHandling } from '@/utils/api';

import { useApiClient } from './useApiClient';

type ApiActionOptions = ApiRedirectOptions;

export function useApiAction<Args extends unknown[], R>(
  queryFn: RequestFn<Args, R>,
  options?: ApiActionOptions
) {
  const client = useApiClient();
  const navigate = useNavigate();

  const makeAction = useMemo(() => {
    return withApiErrorHandling(
      (...args: Args) => queryFn({ client }, ...args),
      navigate,
      options
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, queryFn, navigate]);

  return makeAction;
}
