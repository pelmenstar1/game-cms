import { HttpMethodWithBody } from '@game-cms/core/api';
import { fetchWithJsonBody, handleResponseError } from '@game-cms/shared';

import { EntityId } from '../core.js';
import { EntityHookEventName, EntityHookHandler } from './types.js';

export type EntityWebhookHandlerOptionsInit = Omit<
  RequestInit,
  'body' | 'method'
> & {
  method?: HttpMethodWithBody;
};

export type EntityWebhookHandlerOptions = {
  url: string | URL;
  init?: EntityWebhookHandlerOptionsInit;
};

export function entityWebhookHandler<
  Target extends EntityId,
  On extends EntityHookEventName,
>({ url, init }: EntityWebhookHandlerOptions): EntityHookHandler<Target, On> {
  return async (payload) => {
    const response = await fetchWithJsonBody(url, {
      body: payload,
      method: init?.method ?? 'POST',
      ...init,
    });

    if (!response.ok) {
      await handleResponseError(response, 'Failed to call webhook');
    }
  };
}
