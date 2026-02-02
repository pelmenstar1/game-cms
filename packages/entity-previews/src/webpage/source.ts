import { EntityClientDataById, EntityId } from '@game-cms/base-core';
import { isNonNullObject, MaybePromise, safeGetText } from '@game-cms/shared';

export type WebpageEntityPreviewUrlSourcePayload<
  Id extends EntityId = EntityId,
> = {
  entityId: Id;
  objectId?: string;
  data: EntityClientDataById<Id>;
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
    const response = await fetch(url, {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await safeGetText(response);

      throw new Error(
        `Cannot fetch ${url} (${response.status}): ${errorText ?? ''}`
      );
    }

    const body: unknown = await response.json();

    return parseResponseBody(body);
  };
}
