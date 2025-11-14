import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import type { NavigateFunction } from 'react-router';

export interface ApiRedirectOptions {
  redirectOnUnauthorized?: boolean;
}

export function withApiErrorHandling<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  navigate: NavigateFunction,
  options?: ApiRedirectOptions
) {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
      const redirect = options?.redirectOnUnauthorized ?? true;

      if (
        redirect &&
        error instanceof ApiError &&
        error.code === ApiErrorCode.UNAUTHORIZED
      ) {
        await navigate('/signin');
      }

      throw error;
    }
  };
}
