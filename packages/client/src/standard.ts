import type {
  ApiClient,
  InitBodyRequestOptions,
  RequestOptions,
  ResponseParser,
} from '@game-cms/core/api';

import { handleResponseError } from './internal/errors.js';
import { createFullUrl } from './internal/utils.js';
import type { GameCmsClientOptions } from './types.js';

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
}: GameCmsClientOptions): ApiClient {
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
    makeRequest,
  };
}
