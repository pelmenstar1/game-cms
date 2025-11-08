import type { RoutesMeta } from '@game-cms/api/types';
import { formatSearchParams } from '@game-cms/shared';

import type {
  ObjectRequestUrl,
  RequestContext,
  RequestOptions,
  RequestOptionsWithResult,
} from '../types.js';

type BaseApiRoute = RoutesMeta[number];
type ApiRoutePath = BaseApiRoute['path'];

function constructRelativeUrl(url: string | ObjectRequestUrl): string {
  if (typeof url === 'string') {
    return url;
  }

  const { path, search = {} } = url;
  const searchString = formatSearchParams(search);

  let result = path;
  if (searchString) {
    result += `?${searchString}`;
  }

  return result;
}

function concatUrls(url: string, base: string | URL) {
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

export function createFullUrl(
  url: string | ObjectRequestUrl,
  base: string | URL
) {
  const stringUrl = constructRelativeUrl(url);

  return concatUrls(stringUrl, base);
}

export function request<Args extends unknown[], R>(
  factory: (...args: Args) => RequestOptionsWithResult<R, ApiRoutePath>
): (context: RequestContext, ...args: Args) => Promise<R>;

export function request<Args extends unknown[]>(
  factory: (...args: Args) => RequestOptions<ApiRoutePath>
): (context: RequestContext, ...args: Args) => Promise<Response>;

export function request<Args extends unknown[], R>(
  factory: (...args: Args) => RequestOptions | RequestOptionsWithResult<R>
) {
  return (context: RequestContext, ...args: Args) => {
    const signal = context.abortController?.signal;
    const init = factory(...args);
    if (signal) {
      init.signal = signal;
    }

    return context.client.makeRequest(init);
  };
}
