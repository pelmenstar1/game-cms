import { handleResponseError } from './internal/errors.js';
import { createFullUrl } from './internal/utils.js';
import { RequestInitWithHeaders } from './requestInitializer.js';
import { ResponseParser } from './responseParser.js';
import { ApiClient, RequestOptions } from './types.js';

export type StandardClientOptions = {
  baseUrl: string | URL;
};

export function createStandardClient({
  baseUrl,
}: StandardClientOptions): ApiClient {
  let authorizationHeader: string | undefined;

  function createStandardRequestInit(options: RequestOptions) {
    const { body, headers, ...rest } = options;

    const headersObject = new Headers(headers);
    const result: RequestInit = { ...rest, headers: headersObject };

    if (authorizationHeader !== undefined) {
      headersObject.set('Authorization', authorizationHeader);
    }

    if (typeof body === 'function') {
      body(result as RequestInitWithHeaders);
    } else {
      result.body = body;
    }

    return result;
  }

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

  function setAuthorizationHeader(header: string) {
    authorizationHeader = header;
  }

  return {
    baseUrl,
    makeRequest,
    setAuthorizationHeader,
  };
}
