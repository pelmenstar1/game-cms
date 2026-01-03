import type {
  ComponentData,
  ComponentRawDataById,
  ComponentResolvedDataById,
  ComponentSchema,
  ComponentStorageDataById,
  DefaultExport,
  FromEntries,
} from '@game-cms/core';

export type EntitySchemaComponents = Record<string, ComponentSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityMap extends Record<string, EntitySchemaComponents> {}

export type EntityId = keyof EntityMap;

export type EntityData = Record<string, ComponentData>;

type GetEntityDataVariants<T = unknown> =
  T extends ComponentSchema<infer Id, infer Args>
    ? {
        rawData: ComponentRawDataById<Id, Args>;
        resolvedData: ComponentResolvedDataById<Id, Args>;
        storageData: ComponentStorageDataById<Id, Args>;
      }
    : {
        rawData: ComponentData;
        resolvedData: ComponentData;
        storageData: ComponentData;
      };

type ComponentsToData<T, DataKey extends keyof GetEntityDataVariants> = {
  [K in keyof T]: GetEntityDataVariants<T[K]>[DataKey];
};

export type EntityRawDataById<Id extends EntityId> = ComponentsToData<
  EntityMap[Id],
  'rawData'
>;

export type EntityResolvedDataById<Id extends EntityId> = ComponentsToData<
  EntityMap[Id],
  'resolvedData'
>;

export type EntityStorageDataById<Id extends EntityId> = ComponentsToData<
  EntityMap[Id],
  'storageData'
>;

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

export type EntityConnector = {
  getEntitySchemas: () => EntitySchema[];
  getEntitySchemaById: <Id extends EntityId>(id: Id) => EntitySchemaById<Id>;
};

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
