import type { ApiErrorCode } from '@game-cms/types';
import { ApiError } from '@game-cms/utils';
import type { NavigateFunction } from 'react-router';

export interface ApiRedirectOptions {
  redirectOnUnauthorized?: boolean;
  redirectOnNotFound?: boolean;
}

type RedirectConfig = {
  key: keyof ApiRedirectOptions;
  defaultValue?: boolean;
  route: string;
};

const redirectConfigMap: Partial<Record<ApiErrorCode, RedirectConfig>> = {
  'base::access/unauthorized': {
    key: 'redirectOnUnauthorized',
    defaultValue: true,
    route: '/signin',
  },
  'base::entity/notFound': {
    key: 'redirectOnNotFound',
    route: '/404',
  },
};

export function withApiErrorHandling<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  navigate: NavigateFunction,
  options?: ApiRedirectOptions
) {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const config = redirectConfigMap[error.code as ApiErrorCode];

        if (config && (options?.[config.key] ?? config.defaultValue)) {
          await navigate(config.route);
        }
      }

      throw error;
    }
  };
}
