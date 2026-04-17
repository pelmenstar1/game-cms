import { formatSearchParams, SearchParams } from '@game-cms/shared';

import { HttpMethod } from '../route.js';
import {
  MaybeSearch,
  RequestContext,
  RequestOptions,
  RequestOptionsWithResult,
  RequestUrl,
} from './types.js';

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

export function request<
  R,
  Url extends RequestUrl<Method>,
  Method extends HttpMethod = 'GET',
>(
  context: RequestContext,
  options:
    | RequestOptions<Method, Url>
    | RequestOptionsWithResult<R, Method, Url>
) {
  const signal = context.abortSignal;
  if (signal) {
    options.signal = signal;
  }

  return context.client.makeRequest(options);
}

type ObjectRequestUrl<Path extends string> = {
  path: Path;
  search?: string | SearchParams;
};

export function url<Path extends string>(info: ObjectRequestUrl<Path>) {
  const { path, search = '' } = info;
  const searchString =
    typeof search === 'string' ? search : formatSearchParams(search);

  let result: MaybeSearch<Path> = path;
  if (searchString) {
    result = result + `?${searchString}`;
  }

  return result as MaybeSearch<Path>;
}
