import type { ResponseParser } from './responseParser.js';
import type {
  GameCmsClient,
  GameCmsClientOptions,
  RequestOptions,
} from './types.js';
import type { RequestInitWithHeaders } from './utilTypes.js';

export function createStandardRequestInit(options: RequestOptions) {
  const headers = new Headers(options.headers);

  const init: RequestInitWithHeaders = {
    ...options,
    headers,
  };

  if ('body' in options && typeof options.body === 'function') {
    options.body(init);
  }

  return init;
}

export function createStandardClient({
  baseUrl,
}: GameCmsClientOptions): GameCmsClient {
  async function makeRequest<T>(
    options: RequestOptions & { response?: ResponseParser<T> }
  ) {
    const url = new URL(options.path, baseUrl);
    const init = createStandardRequestInit(options);

    const response = await fetch(url, init);

    return options.response ? options.response(response) : response;
  }

  return {
    baseUrl,
    makeRequest,
  };
}
