import type {
  RequestContext,
  RequestOptions,
  RequestOptionsWithResult,
} from './types.js';

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

export function request<Args extends unknown[], R>(
  factory: (...args: Args) => RequestOptionsWithResult<R>
): (context: RequestContext, ...args: Args) => Promise<R>;

export function request<Args extends unknown[]>(
  factory: (...args: Args) => RequestOptions
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
