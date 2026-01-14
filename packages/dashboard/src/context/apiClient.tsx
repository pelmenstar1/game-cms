import type { ApiErrorCode, ApiErrorCodeTypeMap } from '@game-cms/base-core';
import { ApiError } from '@game-cms/base-core';
import { createStandardClient, refreshUserSession } from '@game-cms/client';
import {
  ApiClientContext,
  type ApiClientContextType,
  type ApiRedirectOptions,
} from '@game-cms/component-api';
import type { RequestContext, RequestFn } from '@game-cms/core/api';
import { createAbortController } from '@game-cms/shared';
import type { PageUrl, TypedNavigateFunction } from '@game-cms/ui';
import { type PropsWithChildren, useMemo } from 'react';
import { useNavigate } from 'react-router';

declare module '@game-cms/component-api' {
  interface ApiRedirectOptions {
    redirectOnUnauthorized?: boolean;
    redirectOnNotFound?: boolean;
  }
}

type RedirectConfig = {
  key: keyof ApiRedirectOptions;
  defaultValue?: boolean;
  route: PageUrl;
};

const redirectConfigMap: ApiErrorCodeTypeMap<RedirectConfig> = {
  'base::access/unauthorized': {
    key: 'redirectOnUnauthorized',
    defaultValue: true,
    route: '/signin',
  },
  'base::entity/notFound': {
    key: 'redirectOnNotFound',
    // It can be any URL really
    route: '/404',
  },
};

async function handleRedirects(
  error: ApiError,
  navigate: TypedNavigateFunction,
  options?: ApiRedirectOptions
) {
  const config = redirectConfigMap[error.code as ApiErrorCode];

  if (config && (options?.[config.key] ?? config.defaultValue)) {
    await navigate(config.route);
  }
}

export function ApiClientProvider({ children }: PropsWithChildren) {
  const client = useMemo(() => createStandardClient({ baseUrl: `/api` }), []);
  const navigate = useNavigate();

  const baseMakeApiRequest = <T, Args extends unknown[]>(
    fn: RequestFn<Args, T>,
    args: Args,
    redirectOptions?: ApiRedirectOptions,
    checkExpired: boolean = true
  ): { promise: Promise<T>; abort: () => void } => {
    const abortController = createAbortController();
    const context: RequestContext = {
      client,
      abortController,
    };

    const worker = async () => {
      try {
        return await fn(context, ...args);
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          if (
            checkExpired &&
            (error.code === 'base::access/expired' ||
              error.code === 'base::access/unauthorized')
          ) {
            await baseMakeApiRequest(
              refreshUserSession,
              [],
              redirectOptions,
              false
            ).promise;

            return baseMakeApiRequest(fn, args, redirectOptions, false).promise;
          } else {
            await handleRedirects(error, navigate, redirectOptions);
          }
        }

        throw error;
      }
    };

    return {
      promise: worker(),
      abort: () => {
        abortController?.abort();
      },
    };
  };

  const value = useMemo(
    (): ApiClientContextType => ({
      makeApiRequest: baseMakeApiRequest,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, navigate]
  );

  return (
    <ApiClientContext.Provider value={value}>
      {children}
    </ApiClientContext.Provider>
  );
}
