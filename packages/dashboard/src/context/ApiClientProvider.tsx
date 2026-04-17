import { refreshUserSession } from '@game-cms/base-api/client';
import {
  ApiClientContext,
  ApiClientContextType,
  ApiRequestOptions,
  MakeApiRequestResult,
  ResolveApiRequestResult,
} from '@game-cms/base-components/shared';
import {
  ApiErrorCode,
  ApiErrorCodeTypeMap,
  isApiError,
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
  'base::access/invalidToken': {
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
  code?: ApiErrorCode;
  navigate: TypedNavigateFunction;
  location: Location;
  options?: ApiRequestOptions;
};

async function handleRedirects({
  code,
  navigate,
  location,
  options,
}: HandleRedirectsParams) {
  const config = redirectConfigMap[code as ApiErrorCode];

  if (config && (options?.[config.key] ?? config.defaultValue)) {
    const to = resolveMaybeFactory(config.route, location);

    await navigate(to);
  }
}

type BaseMakeApiRequestAdditionalOptions = {
  checkExpired?: boolean;
  signal?: AbortSignal;
};

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
    additionalOptions?: BaseMakeApiRequestAdditionalOptions
  ): MakeApiRequestResult<T, Options> => {
    let abortSignal: AbortSignal | undefined;
    let abortController: AbortController | undefined;

    if (additionalOptions?.signal) {
      abortSignal = additionalOptions.signal;
    } else {
      abortController = createAbortController();
      abortSignal = abortController?.signal;
    }

    const context: RequestContext = { client, abortSignal };

    const worker = async () => {
      try {
        return await fn(context, ...args);
      } catch (error: unknown) {
        if (isApiError(error)) {
          const checkExpired = additionalOptions?.checkExpired ?? true;

          if (checkExpired && error.code === 'base::access/invalidToken') {
            let tokenRefreshed = false;

            try {
              await baseMakeApiRequest(refreshUserSession, [], options, {
                checkExpired: false,
                // We don't want to pass the original signal here, we don't need refresh to be aborted.
              }).promise;

              tokenRefreshed = true;
            } catch {
              // Redirect is below, no need to do anything here
            }

            if (tokenRefreshed) {
              return await baseMakeApiRequest(fn, args, options, {
                checkExpired: false,
                signal: context.abortSignal,
              }).promise;
            }
          } else if (
            error.code === 'base::entity/notFound' &&
            options?.nullIfNotFound
          ) {
            return null as ResolveApiRequestResult<T, Options>;
          }

          await handleRedirects({
            code: error.code,
            navigate,
            options,
            location,
          });
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
