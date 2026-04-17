import { Replace } from '@game-cms/shared';

import { ApiRouteMap, HttpMethod, HttpMethodWithBody } from '../route.js';
import { RequestInitializer } from './requestInitializer.js';
import { ResponseParser } from './responseParser.js';

export type MaybeSearch<T extends string> = T | `${T}?${string}`;

export type RequestContext = {
  client: ApiClient;
  abortSignal?: AbortSignal;
};

export type RequestFn<Args extends unknown[], R> = (
  context: RequestContext,
  ...args: Args
) => Promise<R>;

export interface ApiClient {
  setAuthorizationHeader(header: string): void;
  makeRequest(options: RequestOptions): Promise<Response>;
  makeRequest<T>(options: RequestOptionsWithResult<T>): Promise<T>;
}

type ProcessParameter<T> = T extends `:${string}` ? string : T;

type ReplaceParametersToTemplate<T extends string> =
  T extends `${infer Part}/${infer Rest}`
    ? `${ProcessParameter<Part>}/${ReplaceParametersToTemplate<Rest>}`
    : ProcessParameter<T>;

export type RequestUrl<Method extends HttpMethod = HttpMethod> = {
  [K in keyof ApiRouteMap]: K extends `${Method} ${infer Url}`
    ? MaybeSearch<ReplaceParametersToTemplate<Url>>
    : never;
}[keyof ApiRouteMap];

interface BaseRequestOptions<
  Method extends HttpMethod,
  Url extends RequestUrl<Method>,
> extends RequestInit {
  url: Url;
  method?: Method;
}

interface BodyRequestOptions<
  Method extends HttpMethod,
  Url extends RequestUrl<Method>,
> extends BaseRequestOptions<Method, Url> {
  body?: BodyInit;
  method: Method;
}

export type InitBodyRequestOptions<
  Method extends HttpMethod = HttpMethod,
  Url extends RequestUrl<Method> = RequestUrl<Method>,
> = Replace<
  BaseRequestOptions<Method, Url>,
  {
    body: RequestInitializer;
    method: HttpMethodWithBody;
  }
>;

export type RequestOptions<
  Method extends HttpMethod = HttpMethod,
  Url extends RequestUrl<Method> = RequestUrl<Method>,
> =
  | BaseRequestOptions<Method, Url>
  | BodyRequestOptions<Method, Url>
  | InitBodyRequestOptions<Method, Url>;

export type RequestOptionsWithResult<
  R,
  Method extends HttpMethod = HttpMethod,
  Url extends RequestUrl<Method> = RequestUrl<Method>,
> = RequestOptions<Method, Url> & {
  response: ResponseParser<R>;
};
