import type {
  HttpMethod,
  RequestContext,
  RequestOptions,
  RequestOptionsWithResult,
  RequestUrl,
} from '@game-cms/core/api';

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
