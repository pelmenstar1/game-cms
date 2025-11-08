import { handleResponseError } from './errors.js';
import type { ResponseParser } from './responseParser.js';
import type {
  GameCmsClient,
  GameCmsClientOptions,
  InitBodyRequestOptions,
  RequestOptions,
} from './types.js';
import { createFullUrl } from './utils.js';

function isBodyOptions(
  options: RequestOptions
): options is InitBodyRequestOptions {
  return 'body' in options && typeof options.body === 'function';
}

export function createStandardRequestInit(
  options: RequestOptions
): RequestInit {
  if (isBodyOptions(options)) {
    const { body, headers, ...rest } = options;

    const init = { ...rest, headers: new Headers(headers) };
    body(init);

    return init;
  }

  return options;
}

export function createStandardClient({
  baseUrl,
}: GameCmsClientOptions): GameCmsClient {
  async function makeRequest<T>(
    options: RequestOptions & { response?: ResponseParser<T> }
  ) {
    const { url: relativeUrl, response: responseParser } = options;

    const url = createFullUrl(relativeUrl, baseUrl);
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
