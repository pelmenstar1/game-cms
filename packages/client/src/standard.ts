import type { RequestInitializer } from './requestInitializer.js';
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

  const { body } = options as { body?: RequestInitializer };

  if (typeof body === 'function') {
    body(init);
  }

  return init;
}

function createFullUrl(url: string, base: string | URL) {
  if (typeof base === 'string' && base.startsWith('/')) {
    return `${base}${url}`;
  }

  return new URL(url, base);
}

export function createStandardClient({
  baseUrl,
}: GameCmsClientOptions): GameCmsClient {
  async function makeRequest<T>(
    options: RequestOptions & { response?: ResponseParser<T> }
  ) {
    const { path, response: responseParser } = options;

    const url = createFullUrl(path, baseUrl);
    const init = createStandardRequestInit(options);

    const response = await fetch(url, init);

    return responseParser ? responseParser(response) : response;
  }

  return {
    baseUrl,
    makeRequest,
  };
}
