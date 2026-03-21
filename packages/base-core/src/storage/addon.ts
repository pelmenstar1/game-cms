import {
  ConditionalPartial,
  MaybePromise,
  UndefinedIf,
} from '@game-cms/shared';

import { StorageProvider, UploadFilePayload } from './provider.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface StorageAddonTypeMap<Extra> {}

export type StorageAddonId = keyof StorageAddonTypeMap<unknown>;

type StorageAddonPersistentData<
  T extends StorageAddonId,
  Extra,
> = StorageAddonTypeMap<Extra>[T]['persistent'];

type StorageAddonHydratedData<
  T extends StorageAddonId,
  Extra,
> = StorageAddonTypeMap<Extra>[T]['hydrated'];

type IsAddonDataOptional<
  T extends StorageAddonId,
  Extra,
> = StorageAddonTypeMap<Extra>[T]['optional'] extends true ? true : false;

export type StorageAddonContext<Extra = unknown> = {
  provider: StorageProvider<Extra>;
};

export type StorageAddon<Id extends StorageAddonId = StorageAddonId> = {
  id: Id;

  getData: <Extra>(
    item: UploadFilePayload<Uint8Array>,
    context: StorageAddonContext<Extra>
  ) => MaybePromise<
    | StorageAddonPersistentData<Id, Extra>
    | UndefinedIf<IsAddonDataOptional<Id, Extra>>
  >;

  hydrateData: <Extra>(
    data: StorageAddonPersistentData<Id, Extra>,
    context: StorageAddonContext<Extra>
  ) => MaybePromise<StorageAddonHydratedData<Id, Extra>>;
};

export type AnyStorageAddon = {
  [Id in StorageAddonId]: StorageAddon<Id>;
}[StorageAddonId];

type BaseAddonDataMap<K extends string, Extra> = ConditionalPartial<{
  [K2 in keyof StorageAddonTypeMap<Extra>]: {
    optional: StorageAddonTypeMap<Extra>[K2]['optional'];
    value: StorageAddonTypeMap<Extra>[K2][K];
  };
}>;

export type StorageAddonPersistentDataMap<Extra = unknown> = BaseAddonDataMap<
  'persistent',
  Extra
>;

export type StorageAddonHydratedDataMap<Extra = unknown> = BaseAddonDataMap<
  'hydrated',
  Extra
>;

export function storageAddon<Id extends StorageAddonId>(
  value: StorageAddon<Id>
) {
  return value;
}
