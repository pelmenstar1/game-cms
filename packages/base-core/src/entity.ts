import type {
  ComponentClientDataById,
  ComponentClientDataByIdPathExtends,
  ComponentData,
  ComponentSchema,
  DefaultExport,
  FromEntries,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import type z from 'zod';

import type { EntityCheckStorageDataMap } from './entityCheck.js';
import { AnyEntityPreviewController } from './entityPreview.js';
import type { entityVariant } from './schema/entity.js';

export type EntitySchemaComponents = Record<string, ComponentSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityMap {}

export type EntityId = keyof EntityMap extends never ? string : keyof EntityMap;

export type EntityComponents<Id extends EntityId> =
  EntityMap extends Record<Id, unknown>
    ? EntityMap[Id] & EntitySchemaComponents
    : EntitySchemaComponents;

export type EntityMeta = {
  lastUpdatedTime: number;
};

export type EntityVariant = z.infer<typeof entityVariant>;

export type EntityClientInstanceData = Record<string, ComponentData>;
export type EntityInstanceData<
  T = EntityClientInstanceData,
  Search = unknown,
> = T & {
  '#meta': EntityMeta;
  '#search': Search;
  '#checks'?: Partial<EntityCheckStorageDataMap>;
};

export type EntityData = Record<EntityVariant, EntityInstanceData>;

export type EntityDataVariantsById<Id extends EntityId> = {
  draft: EntityStorageDataById<Id>;
  published?: EntityStorageDataById<Id>;
};

type ComponentsToData<T, DataKey extends keyof GetComponentSchemaTypes> = {
  [K in keyof T]: GetComponentSchemaTypes<T[K]>[DataKey];
};

export type EntityRawDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'rawData'
>;

export type EntityRawDataWithChecksById<Id extends EntityId> =
  EntityInstanceData<EntityRawDataById<Id>, EntitySearchIndexDataById<Id>> & {
    '#checks': Partial<EntityCheckStorageDataMap>;
  };

export type EntityRawInDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'rawInData'
>;

export type EntityRawInPartialDataById<Id extends EntityId> = ComponentsToData<
  EntityComponents<Id>,
  'partialRawInData'
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

export type EntityStorageDataById<Id extends EntityId> = EntityInstanceData<
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

type BaseEntityDisplayKey<Components extends EntitySchemaComponents, U> = {
  [K in keyof Components & string]: Components[K] extends ComponentSchema<
    infer CId,
    infer Args
  >
    ?
        | (ComponentClientDataById<CId, Args> extends U ? K : never)
        | `${K}.${ComponentClientDataByIdPathExtends<U, CId, Args>}`
    : never;
}[keyof Components & string];

type EntityDisplayKey<Components extends EntitySchemaComponents> =
  | '_id'
  | BaseEntityDisplayKey<Components, string | number>;

export type EntityDisplayKeyById<Id extends EntityId> = EntityDisplayKey<
  EntityComponents<Id>
>;

export interface EntitySchema<
  Id extends EntityId = EntityId,
  Components extends EntitySchemaComponents = EntitySchemaComponents,
> {
  id: Id;
  title: string;
  displayKeys?: EntityDisplayKey<Components>[];
  preview?: AnyEntityPreviewController;
  components: Components;
}

export type EntitySchemaById<Id extends EntityId> = EntitySchema<
  Id,
  EntityComponents<Id>
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
