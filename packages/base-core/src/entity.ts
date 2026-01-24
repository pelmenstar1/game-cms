import type {
  ComponentData,
  ComponentSchema,
  DefaultExport,
  FromEntries,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import type z from 'zod';

import type { entityVariant } from './schema/entity.js';

export type EntitySchemaComponents = Record<string, ComponentSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityMap extends Record<string, EntitySchemaComponents> {}

export type EntityId = keyof EntityMap;

export type EntityVariant = z.infer<typeof entityVariant>;
export type EntityVariantData = Record<string, ComponentData>;
export type EntityData = Record<EntityVariant, EntityVariantData>;

export type EntityDataVariantsById<Id extends EntityId> = {
  draft: EntityStorageDataById<Id>;
  published?: EntityStorageDataById<Id>;
};

type ComponentsToData<T, DataKey extends keyof GetComponentSchemaTypes> = {
  [K in keyof T]: GetComponentSchemaTypes<T[K]>[DataKey];
};

export type EntityRawDataById<Id extends EntityId> = ComponentsToData<
  EntityMap[Id],
  'rawData'
>;

export type EntityRawInDataById<Id extends EntityId> = ComponentsToData<
  EntityMap[Id],
  'rawInData'
>;

export type EntityResolvedDataById<Id extends EntityId> = ComponentsToData<
  EntityMap[Id],
  'resolvedData'
>;

export type EntityStorageDataById<Id extends EntityId> = ComponentsToData<
  EntityMap[Id],
  'storageData'
>;

export type EntityErrorById<Id extends EntityId> = {
  ownError?: 'INVALID_TYPE';
  properties?: ComponentsToData<EntityMap[Id], 'error'>;
};

export interface EntitySchemaMeta<Id extends EntityId = EntityId> {
  id: Id;
  title: string;
}

export interface EntitySchema<
  Id extends EntityId = EntityId,
  Components extends EntitySchemaComponents = EntitySchemaComponents,
> extends EntitySchemaMeta<Id> {
  components: Components;
}

export type EntitySchemaById<Id extends EntityId> = EntitySchema<
  Id,
  EntityMap[Id]
>;

type EntityToEntry<T extends { id: string; components: unknown }> = [
  T['id'],
  T['components'],
];

export type EntitiesToEntries<
  T extends DefaultExport<{ id: string; components: unknown }>[],
> = {
  [K in keyof T]: EntityToEntry<T[K]['default']>;
}[number];

export type ResolveEntities<
  T extends DefaultExport<{ id: string; components: unknown }>[],
> = FromEntries<EntitiesToEntries<T>>;

/*@__NO_SIDE_EFFECTS__*/
export function entity<
  Id extends string,
  const Components extends EntitySchemaComponents,
>(value: EntitySchema<Id, Components>) {
  return value;
}
