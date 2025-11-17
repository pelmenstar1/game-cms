import type {
  ApiRouteMap,
  HttpMethod,
  HttpMethodWithBody,
} from '@game-cms/types';

import type { Replace } from '../../shared/dist/typeutil.js';
import type { MaybeSearch } from './internal/utilTypes.js';
import type { RequestInitializer } from './requestInitializer.js';
import type { ResponseParser } from './responseParser.js';

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

export type RequestContext = {
  client: GameCmsClient;
  abortController?: AbortController;
};

export type RequestFn<Args extends unknown[], R> = (
  context: RequestContext,
  ...args: Args
) => Promise<R>;

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

export type GameCmsClientOptions = {
  baseUrl: string | URL;
};

export interface GameCmsClient {
  readonly baseUrl: string | URL;

  makeRequest(options: RequestOptions): Promise<Response>;
  makeRequest<T>(options: RequestOptionsWithResult<T>): Promise<T>;
}
