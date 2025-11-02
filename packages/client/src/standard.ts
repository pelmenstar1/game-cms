import { handleResponseError } from './errors.js';
import type { ResponseParser } from './responseParser.js';
import type {
  GameCmsClient,
  GameCmsClientOptions,
  InitBodyRequestOptions,
  RequestOptions,
} from './types.js';

function isBodyOptions(
  options: RequestOptions
): options is InitBodyRequestOptions {
  return 'body' in options && typeof options.body === 'function';
}

export function createStandardRequestInit(
  options: RequestOptions
): RequestInit {
  if (isBodyOptions(options)) {
    const { body, ...rest } = options;

    const init = { ...rest, headers: new Headers(options.headers) };
    body(init);

    return init;
  }

  return options;
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
    if (!response.ok) {
      await handleResponseError(response);
    }

    return responseParser ? responseParser(response) : response;
  }

  return {
    baseUrl,
    makeRequest,
  };
}
