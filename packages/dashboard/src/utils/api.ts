import type { ApiErrorCode, ApiErrorCodeTypeMap } from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import {
  refreshUserSession,
  type RequestContext,
  type RequestFn,
} from '@game-cms/client';
import type { PageUrl } from '@game-cms/ui';

import type { TypedNavigateFunction } from '@/hooks/useTypedNavigate';

export interface ApiRedirectOptions {
  redirectOnUnauthorized?: boolean;
  redirectOnNotFound?: boolean;
}

export type MakeApiRequestContext = {
  requestContext: RequestContext;

  navigate: TypedNavigateFunction;
};

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
  context: MakeApiRequestContext,
  options?: ApiRedirectOptions
) {
  const config = redirectConfigMap[error.code as ApiErrorCode];

  if (config && (options?.[config.key] ?? config.defaultValue)) {
    await context.navigate(config.route);
  }
}

export async function makeApiRequest<Args extends unknown[], T>(
  fn: RequestFn<Args, T>,
  args: Args,
  context: MakeApiRequestContext,
  redirectOptions?: ApiRedirectOptions
) {
  try {
    return await fn(context.requestContext, ...args);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      if (error.code === 'base::access/expired') {
        await makeApiRequest(refreshUserSession, [], context, redirectOptions);

        return makeApiRequest(fn, args, context, redirectOptions);
      } else {
        await handleRedirects(error, context, redirectOptions);
      }
    }

    throw error;
  }
}
