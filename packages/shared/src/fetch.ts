import type { Replace } from './typeutil.js';

export type RequestInitWithBody = Replace<RequestInit, { body: unknown }>;

export function safeGetText(response: Response) {
  return response.text().catch(() => null);
}

export function fetchWithJsonBody(
  url: string | URL,
  { body, headers, ...init }: RequestInitWithBody
) {
  const headersObject = new Headers(headers);
  headersObject.set('Content-Type', 'application/json');

  return fetch(url, {
    body: JSON.stringify(body),
    headers,
    ...init,
  });
}

export async function handleResponseError(response: Response, action: string) {
  const errorText = await safeGetText(response);

  throw new Error(
    `${action} ${response.url} (${response.status}): ${errorText ?? '<cannot fetch response>'}`
  );
}
