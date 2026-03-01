import { HttpMethodWithBody } from '@game-cms/core/api';
import {
  fetchWithJsonBody,
  handleResponseError,
  MaybePromise,
} from '@game-cms/shared';
import { MaybeArray } from '@game-cms/shared/collections';
import { ObjectId } from 'mongodb';

import { EntityId, EntityVariant, EntityVariantData } from './core.js';

type EventHookTarget = MaybeArray<EntityId>;

type IdBasedPayload<Target> = {
  entityId: Target;
  id: ObjectId;
};

interface CreatedOrUpdatedPayload<Target> extends IdBasedPayload<Target> {
  variant: EntityVariant;
}

type EntityHookEventMap<Target extends EventHookTarget = EventHookTarget> = {
  deleted: IdBasedPayload<Target>;
  updated: CreatedOrUpdatedPayload<Target> & {
    newData: EntityVariantData;
  };
  created: CreatedOrUpdatedPayload<Target> & {
    data: EntityVariantData;
  };
  unpublished: IdBasedPayload<Target>;
};

export type EntityHookEventName = keyof EntityHookEventMap;
export type EntityHookEventPayload<T extends EntityHookEventName> =
  EntityHookEventMap[T];

export type EntityHookHandler<
  Target extends EntityId,
  On extends EntityHookEventName,
> = (payload: EntityHookEventMap<Target>[On]) => MaybePromise<void>;

export type EntityHook<
  Target extends EntityId,
  On extends EntityHookEventName,
> = {
  id?: string;
  target: MaybeArray<Target>;
  on: MaybeArray<On>;
  handler: EntityHookHandler<Target, On>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyEntityHook = EntityHook<any, any>;

export const entityHook = <
  Target extends EntityId,
  const On extends EntityHookEventName,
>(
  value: EntityHook<Target, On>
) => value;

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
