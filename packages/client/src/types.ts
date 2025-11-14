import type { SearchParams } from '@game-cms/shared';
import type { HttpMethodWithBody } from '@game-cms/types';

import type { Replace } from '../../shared/dist/typeutil.js';
import type { RequestInitializer } from './requestInitializer.js';
import type { ResponseParser } from './responseParser.js';

export type ObjectRequestUrl<Path extends string = string> = {
  path: Path;
  search?: SearchParams;
};

interface BaseRequestOptions<Path extends string = string> extends RequestInit {
  url: Path | ObjectRequestUrl<Path>;
}

interface BodyRequestOptions<Path extends string>
  extends BaseRequestOptions<Path> {
  body?: BodyInit;
  method: HttpMethodWithBody;
}

export type InitBodyRequestOptions<Path extends string = string> = Replace<
  BaseRequestOptions<Path>,
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

export type RequestOptions<Path extends string = string> =
  | BaseRequestOptions<Path>
  | BodyRequestOptions<Path>
  | InitBodyRequestOptions<Path>;

export type RequestOptionsWithResult<
  R,
  Path extends string = string,
> = RequestOptions<Path> & {
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
