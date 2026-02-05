import { EntityClientDataById, EntityId } from '@game-cms/base-core';
import {
  fetchWithJsonBody,
  handleResponseError,
  isNonNullObject,
  MaybePromise,
} from '@game-cms/shared';

export type WebpageEntityPreviewUrlSourcePayload<
  Id extends EntityId = EntityId,
> = {
  entityId: Id;
  objectId?: string;
  data: EntityClientDataById<Id>;
  abortSignal?: AbortSignal;
};

export type WebpageEntityPreviewUrlSource = (
  payload: WebpageEntityPreviewUrlSourcePayload
) => MaybePromise<string>;

function invalidResponse(reason: string): never {
  throw new Error(`Invalid response: ${reason}`);
}

function parseResponseBody(body: unknown) {
  if (isNonNullObject(body)) {
    const { url } = body;

    if (typeof url === 'string') {
      return url;
    }

    invalidResponse('expected a string field "url"');
  }

  invalidResponse('not an object');
}

export function postRequestUrlSource(
  url: string
): WebpageEntityPreviewUrlSource {
  return async (payload) => {
    const response = await fetchWithJsonBody(url, {
      method: 'POST',
      body: payload,
      signal: payload.abortSignal,
    });

    if (!response.ok) {
      await handleResponseError(response, 'Cannot fetch');
    }

    const body: unknown = await response.json();

    return parseResponseBody(body);
  };
}
