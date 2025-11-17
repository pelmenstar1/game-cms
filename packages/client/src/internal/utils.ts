import type { RoutesMeta } from '@game-cms/api/types';
import { formatSearchParams, type SearchParams } from '@game-cms/shared';

import type {
  RequestContext,
  RequestOptions,
  RequestOptionsWithResult,
} from '../types.js';

type BaseApiRoute = RoutesMeta[number];
type ApiRoutePath = BaseApiRoute['path'];

type ObjectRequestUrl = {
  path: ApiRoutePath;
  search?: string | SearchParams;
};

export function url(info: ObjectRequestUrl) {
  const { path, search = '' } = info;
  const searchString =
    typeof search === 'string' ? search : formatSearchParams(search);

  let result = path;
  if (searchString) {
    result += `?${searchString}`;
  }

  return result as ApiRoutePath;
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

export function request<R>(
  context: RequestContext,
  options: RequestOptionsWithResult<R, ApiRoutePath>
): Promise<R>;

export function request(
  context: RequestContext,
  options: RequestOptions<ApiRoutePath>
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
