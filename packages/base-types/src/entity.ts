import type {
  ComponentData,
  ComponentDataById,
  ComponentSchema,
  DefaultExport,
  FromEntries,
} from '@game-cms/types';

export type EntitySchemaComponents = Record<string, ComponentSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityMap extends Record<string, EntitySchemaComponents> {}

export type EntityId = keyof EntityMap;

export type EntityData = Record<string, ComponentData>;

type ComponentsToData<T> = {
  [K in keyof T]: T[K] extends ComponentSchema<infer Id, infer Args>
    ? ComponentDataById<Id, Args>
    : never;
};

export type EntityDataById<Id extends EntityId> = ComponentsToData<
  EntityMap[Id]
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
