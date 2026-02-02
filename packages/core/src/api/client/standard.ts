import { handleResponseError } from './internal/errors.js';
import { createFullUrl } from './internal/utils.js';
import { ResponseParser } from './responseParser.js';
import { ApiClient, InitBodyRequestOptions, RequestOptions } from './types.js';

export type StandardClientOptions = {
  baseUrl: string | URL;
};

function isBodyOptions(
  options: RequestOptions
): options is InitBodyRequestOptions {
  return 'body' in options && typeof options.body === 'function';
}

function createStandardRequestInit(options: RequestOptions): RequestInit {
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
}: StandardClientOptions): ApiClient {
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
