import { RequestFn } from '@game-cms/core/api/client';
import React from 'react';

export interface ApiRequestOptions {
  redirectOnUnauthorized?: boolean;
  redirectOnNotFound?: boolean;
  nullIfNotFound?: boolean;
}

export type ApiActionOptions = ApiRequestOptions;

export type ResolveApiRequestResult<
  T,
  Options extends ApiActionOptions,
> = Options['nullIfNotFound'] extends true ? T | null : T;

export type ApiClientContextType = {
  makeApiRequest: <
    Args extends unknown[],
    T,
    Options extends ApiRequestOptions,
  >(
    fn: RequestFn<Args, T>,
    args: Args,
    options?: ApiRequestOptions
  ) => {
    promise: Promise<ResolveApiRequestResult<T, Options>>;
    abort: () => void;
  };
};

export const ApiClientContext =
  /*@__PURE__*/ React.createContext<ApiClientContextType | null>(null);
