import { formatSearchParams, type SearchParams } from '@game-cms/shared';
import type { HttpMethod } from '@game-cms/types';

import type {
  RequestContext,
  RequestOptions,
  RequestOptionsWithResult,
  RequestUrl,
} from '../types.js';
import type { MaybeSearch } from './utilTypes.js';

type ObjectRequestUrl<Path extends string> = {
  path: Path;
  search?: string | SearchParams;
};

export function url<Path extends string>(
  info: ObjectRequestUrl<Path>
): MaybeSearch<Path> {
  const { path, search = '' } = info;
  const searchString =
    typeof search === 'string' ? search : formatSearchParams(search);

  let result: MaybeSearch<Path> = path;
  if (searchString) {
    result = result + `?${searchString}`;
  }

  return result as MaybeSearch<Path>;
}

export function createFullUrl(url: string, base: string | URL) {
  if (typeof base === 'string' && base.startsWith('/')) {
    if (url.startsWith('/') && base.endsWith('/')) {
      return `${base.slice(0, -1)}${url}`;
    }

    if (url.startsWith('/') || base.endsWith('/')) {
      return `${base}${url}`;
    }

    return `${base}/${url}`;
  }

  return new URL(url, base);
}

export function request<
  R,
  Url extends RequestUrl<Method>,
  Method extends HttpMethod = 'GET',
>(
  context: RequestContext,
  options: RequestOptionsWithResult<R, Method, Url>
): Promise<R>;

export function request<
  Url extends RequestUrl<Method>,
  Method extends HttpMethod = 'GET',
>(
  context: RequestContext,
  options: RequestOptions<Method, Url>
): Promise<Response>;

export function request<R>(
  context: RequestContext,
  options: RequestOptions | RequestOptionsWithResult<R>
) {
  const signal = context.abortController?.signal;
  if (signal) {
    options.signal = signal;
  }

  return context.client.makeRequest(options);
}
