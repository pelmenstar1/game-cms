import type {
  ComponentClientDataById,
  ComponentClientDataByIdPathExtends,
  ComponentClientSchema,
  ComponentData,
  ComponentId,
  ComponentSchema,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import { ObjectId } from 'mongodb';
import type z from 'zod';

import type { entityVariant } from '../schema/entity.js';
import type {
  EntityCheckClientDataMap,
  EntityCheckStorageDataMap,
} from './check.js';
import { AnyEntityPreviewController } from './preview.js';

export type ComponentTypeDataRegistryEntry<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  id: Id;
  args: Args;
};

export type EntityTypeDataRegistryEntry = Record<
  string,
  ComponentTypeDataRegistryEntry
>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityTypeRegistry {
  // Expected user-set properties:
  // ids: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityTypeDataRegistry {
  // Expected key to be id of the entity, value - components of the entity
}

export type EntityId = EntityTypeRegistry extends { ids: string }
  ? EntityTypeRegistry['ids']
  : string;

export type EntitySchemaComponents = Record<string, ComponentSchema>;

export type EntityComponentsTypes<Id extends EntityId> =
  EntityTypeDataRegistry extends Record<Id, EntityTypeDataRegistryEntry>
    ? EntityTypeDataRegistry[Id]
    : EntityTypeDataRegistryEntry;

type BaseEntitySchemaComponents<Entry extends EntityTypeDataRegistryEntry> = {
  [K in keyof Entry]: ComponentSchema<Entry[K]['id'], Entry[K]['args']>;
};

export type EntityComponents<Id extends EntityId> = BaseEntitySchemaComponents<
  EntityComponentsTypes<Id>
>;

type BaseEntityClientSchemaComponents<
  Entry extends EntityTypeDataRegistryEntry,
> = {
  [K in keyof Entry]: ComponentClientSchema<Entry[K]['id'], Entry[K]['args']>;
};

export type EntityClientComponents<Id extends EntityId> =
  BaseEntityClientSchemaComponents<EntityComponentsTypes<Id>>;

export type EntityMeta = {
  lastUpdatedTime: number;
};

export type EntityVariant = z.infer<typeof entityVariant>;

export type EntityInstanceComponents = Record<string, ComponentData>;

export type EntityVariantData<
  Components = EntityInstanceComponents,
  Search = unknown,
> = {
  components: Components;
  meta: EntityMeta;
  search: Search;
  checks?: Partial<EntityCheckStorageDataMap>;
};

export type EntityPersistentDocument<T = EntityVariantData> = {
  draft: T;
  published?: T;
};

export type EntityPersistentDocumentById<Id extends EntityId> =
  EntityPersistentDocument<EntityStorageDataById<Id>>;

type ComponentsToData<T, DataKey extends keyof GetComponentSchemaTypes> = {
  [K in keyof T]: GetComponentSchemaTypes<T[K]>[DataKey];
};

export type EntityOutDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'outData'
>;

export type EntityOutDataWithChecksById<Id extends EntityId> =
  EntityVariantData<EntityOutDataById<Id>, EntitySearchIndexDataById<Id>> & {
    checks: Partial<EntityCheckStorageDataMap>;
  };

export type EntityInDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'inData'
>;

export type EntityPartialInDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'partialInData'
>;

export type EntityResolvedDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'resolvedData'
>;

export type EntityClientDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'clientData'
>;

export type BaseEntityStorageDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'storageData'
>;

export type EntityStorageDataById<Id extends EntityId> = EntityVariantData<
  BaseEntityStorageDataById<Id>,
  EntitySearchIndexDataById<Id>
>;

export type EntitySearchIndexDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'searchIndexData'
>;

export type EntityErrorById<Id extends EntityId> = {
  ownError?: 'INVALID_TYPE';
  properties?: ComponentsToData<EntityComponents<Id>, 'error'>;
};

export type EntityInternalOutDataById<T extends EntityId, Id = ObjectId> = Omit<
  EntityOutDataWithChecksById<T>,
  'search' | 'checks'
> & {
  id: Id;
  checks: EntityCheckClientDataMap;
};

export type EntityInDataByIdWithId<
  T extends EntityId,
  Id = ObjectId,
> = EntityInDataById<T> & {
  id: Id;
};

export type EntityResolvedDataByIdWithId<
  T extends EntityId,
  Id = ObjectId,
> = EntityResolvedDataById<T> & {
  id: Id;
};

type BaseEntityDisplayKey<Components, U> = {
  [K in keyof Components & string]: Components[K] extends ComponentSchema<
    infer CId,
    infer Args
  >
    ?
        | (ComponentClientDataById<CId, Args> extends U ? K : never)
        | `${K}.${ComponentClientDataByIdPathExtends<U, CId, Args>}`
    : never;
}[keyof Components & string];

type EntityDisplayKey<Components> =
  | 'id'
  | BaseEntityDisplayKey<Components, string | number>;

export type EntityDisplayKeyById<Id extends EntityId> = EntityDisplayKey<
  EntityComponents<Id>
>;

export interface EntitySchema<Components = EntitySchemaComponents> {
  title: string;
  displayKeys?: EntityDisplayKey<Components>[];
  preview?: AnyEntityPreviewController;
  components: Components;
}

export interface EntityClientSchema<Components = EntitySchemaComponents> {
  title: string;
  displayKeys?: EntityDisplayKey<Components>[];
  components: Components;
}

export type EntitySchemaById<Id extends EntityId> = EntitySchema<
  EntityComponents<Id>
>;

export type EntityClientSchemaById<Id extends EntityId> = EntityClientSchema<
  EntityComponents<Id>
>;

export type EntityClientSchemaMap = {
  [Id in EntityId]: EntityClientSchemaById<Id>;
};

export type EntitySchemaRegistry = {
  [K in EntityId]: EntitySchemaById<K>;
};

/*@__NO_SIDE_EFFECTS__*/
export function entity<const Components extends EntitySchemaComponents>(
  value: EntitySchema<Components>
) {
  return value;
}
