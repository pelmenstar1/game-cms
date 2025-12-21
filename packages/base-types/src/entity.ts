import type {
  ClientComponentSchema,
  ComponentData,
  DefaultExport,
  FromEntries,
  ServerComponentSchema,
} from '@game-cms/types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityMap extends Record<string, EntityData> {}

export type EntityId = keyof EntityMap;

export type GetEntityById<Id extends EntityId> = EntityMap[Id];

export interface EntitySchemaMeta<Id extends string = string> {
  id: Id;
  title: string;
}

export interface BaseEntitySchema<
  Id extends string,
  Components,
> extends EntitySchemaMeta<Id> {
  components: Components;
}

export type EntityData = Record<string, ComponentData>;

export type ServerEntitySchema<
  T extends EntityData = EntityData,
  Id extends string = string,
> = BaseEntitySchema<
  Id,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: ServerComponentSchema<any, T[K], any>;
  }
>;

export type ClientEntitySchemaComponents<T extends EntityData> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: ClientComponentSchema<any, T[K]>;
};

export type ClientEntitySchema<
  T extends EntityData = EntityData,
  Id extends string = string,
> = BaseEntitySchema<Id, ClientEntitySchemaComponents<T>>;

export type InferDataFromServerEntitySchema<T> =
  T extends ServerEntitySchema<infer Data> ? Data : never;

type EntityToEntry<T extends { id: string }> = [
  T['id'],
  InferDataFromServerEntitySchema<T>,
];

export type EntitiesToEntries<T extends DefaultExport<{ id: string }>[]> = {
  [K in keyof T]: EntityToEntry<T[K]['default']>;
}[number];

export type ResolveEntities<T extends DefaultExport<{ id: string }>[]> =
  FromEntries<EntitiesToEntries<T>>;
