import type {
  EntityId,
  EntityMap,
  EntityRawDataById,
  EntitySchemaById,
} from '@game-cms/base-types';
import type { ComponentApi } from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentOptionsById,
  ComponentRawDataById,
} from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

export type EntityComposeData<Id extends EntityId> = ComponentClientDataById<
  'base::compose',
  EntityMap[Id]
>;

export type EntityComposeOptions<Id extends EntityId> = ComponentOptionsById<
  'base::compose',
  EntityMap[Id]
>;

export function transformDataToClientData<Id extends EntityId>(
  api: ComponentApi,
  schema: EntitySchemaById<Id>,
  data: EntityRawDataById<Id> | undefined,
  options: EntityComposeOptions<Id>
) {
  const dataOrDefault = (data ??
    mapObject(schema.components, (propSchema) =>
      api.getDefaultData(propSchema.componentId, propSchema.options)
    )) as ComponentRawDataById<Id, EntityMap[Id]>;

  return api.clientTransformerContext.toClient<'base::compose', EntityMap[Id]>(
    'base::compose',
    dataOrDefault as never,
    options
  );
}

export function transformClientDataToData<Id extends EntityId>(
  api: ComponentApi,
  clientData: EntityComposeData<Id>,
  options: EntityComposeOptions<Id>
) {
  return api.clientTransformerContext.fromClient<
    'base::compose',
    EntityMap[Id]
  >('base::compose', clientData, options);
}
