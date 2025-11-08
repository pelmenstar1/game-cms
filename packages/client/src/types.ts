import type { SearchParams } from '@game-cms/shared';
import type { HttpMethodWithBody } from '@game-cms/types';

import type { Replace } from '../../shared/dist/typeutil.js';
import type { RequestInitializer } from './requestInitializer.js';
import type { ResponseParser } from './responseParser.js';

export type ObjectRequestUrl = {
  path: string;
  search?: SearchParams;
};

interface BaseRequestOptions extends RequestInit {
  url: string | ObjectRequestUrl;
}

interface BodyRequestOptions extends BaseRequestOptions {
  body?: BodyInit;
  method: HttpMethodWithBody;
}

export type InitBodyRequestOptions = Replace<
  BaseRequestOptions,
  {
    body: RequestInitializer;
    method: HttpMethodWithBody;
  }
>;

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
