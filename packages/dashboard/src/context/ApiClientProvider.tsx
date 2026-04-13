import { refreshUserSession } from '@game-cms/base-api/client';
import {
  ApiClientContext,
  ApiClientContextType,
  ApiRequestOptions,
  MakeApiRequestResult,
  ResolveApiRequestResult,
} from '@game-cms/base-components/shared';
import {
  ApiError,
  ApiErrorCode,
  ApiErrorCodeTypeMap,
} from '@game-cms/core/api';
import {
  createStandardClient,
  RequestContext,
  RequestFn,
} from '@game-cms/core/api/client';
import {
  createAbortController,
  MaybeFactory,
  resolveMaybeFactory,
} from '@game-cms/shared';
import type { PageUrl, TypedNavigateFunction } from '@game-cms/ui';
import { type PropsWithChildren, useMemo } from 'react';
import { Location, useLocation, useNavigate } from 'react-router';

type RedirectConfig = {
  key: keyof ApiRequestOptions;
  defaultValue?: boolean;
  route: MaybeFactory<PageUrl, [location: Location]>;
};

const redirectConfigMap: ApiErrorCodeTypeMap<RedirectConfig> = {
  'base::access/unauthorized': {
    key: 'redirectOnUnauthorized',
    defaultValue: true,
    route: (location) => {
      const redirectUrl = encodeURIComponent(
        location.pathname + location.search
      );

      return `/signin?redirect=${redirectUrl}`;
    },
  },
  'base::entity/notFound': {
    key: 'redirectOnNotFound',
    // It can be any URL really
    route: '/404',
  },
};

type HandleRedirectsParams = {
  error: ApiError;
  navigate: TypedNavigateFunction;
  location: Location;
  options?: ApiRequestOptions;
};

async function handleRedirects({
  error,
  navigate,
  location,
  options,
}: HandleRedirectsParams) {
  const config = redirectConfigMap[error.code as ApiErrorCode];

  if (config && (options?.[config.key] ?? config.defaultValue)) {
    const to = resolveMaybeFactory(config.route, location);

    await navigate(to);
  }
}

export function ApiClientProvider({ children }: PropsWithChildren) {
  const client = useMemo(() => createStandardClient({ baseUrl: '/api' }), []);
  const navigate = useNavigate();
  const location = useLocation();

  const baseMakeApiRequest = <
    T,
    Args extends unknown[],
    Options extends ApiRequestOptions,
  >(
    fn: RequestFn<Args, T>,
    args: Args,
    options?: Options,
    checkExpired: boolean = true
  ): MakeApiRequestResult<T, Options> => {
    const abortController = createAbortController();
    const context: RequestContext = {
      client,
      abortController,
    };

    const worker = async (): Promise<ResolveApiRequestResult<T, Options>> => {
      try {
        return await fn(context, ...args);
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          if (
            checkExpired &&
            (error.code === 'base::access/expired' ||
              error.code === 'base::access/unauthorized')
          ) {
            await baseMakeApiRequest(refreshUserSession, [], options, false)
              .promise;

            return baseMakeApiRequest(fn, args, options, false).promise;
          } else if (
            error.code === 'base::entity/notFound' &&
            options?.nullIfNotFound
          ) {
            return null as ResolveApiRequestResult<T, Options>;
          } else {
            await handleRedirects({ error, navigate, options, location });
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
