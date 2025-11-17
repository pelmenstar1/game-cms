import type {
  ClientComponentSchema,
  ComponentData,
  ServerComponentSchema,
} from './component.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityMap extends Record<string, EntityData> {}

export type EntityId = keyof EntityMap;

export type GetEntityById<Id extends EntityId> = EntityMap[Id];

export interface EntitySchemaMeta {
  id: string;
  title: string;
}

export interface BaseEntitySchema<Components> extends EntitySchemaMeta {
  components: Components;
}

export type EntityData = Record<string, ComponentData>;

export type ServerEntitySchema<T extends EntityData = EntityData> =
  BaseEntitySchema<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: ServerComponentSchema<any, T[K]>;
  }>;

export type ClientEntitySchema<T extends EntityData = EntityData> =
  BaseEntitySchema<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof T]: ClientComponentSchema<any, T[K]>;
  }>;
