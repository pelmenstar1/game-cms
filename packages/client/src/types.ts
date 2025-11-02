import type { HttpMethodWithBody } from '@game-cms/types';

import type { RequestInitializer } from './requestInitializer.js';
import type { ResponseParser } from './responseParser.js';

interface BaseRequestOptions extends RequestInit {
  path: string;
}

interface BodyRequestOptions extends BaseRequestOptions {
  body?: BodyInit;
  method: HttpMethodWithBody;
}

type InitBodyRequestOptions = BaseRequestOptions & {
  body: RequestInitializer;
  method: HttpMethodWithBody;
};

export type RequestContext = {
  client: GameCmsClient;
  abortController?: AbortController;
};

export type RequestOptions =
  | BaseRequestOptions
  | BodyRequestOptions
  | InitBodyRequestOptions;

export type RequestOptionsWithResult<R> = RequestOptions & {
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
