import type {
  EntityId,
  EntityMap,
  EntityRawDataById,
} from '@game-cms/base-types';
import type { ComponentApi } from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentOptionsById,
} from '@game-cms/core';

export type EntityComposeData<Id extends EntityId> = ComponentClientDataById<
  'base::compose',
  EntityMap[Id]
>;

export type EntityComposeOptions<Id extends EntityId> = ComponentOptionsById<
  'base::compose',
  EntityMap[Id]
>;

export async function transformDataToClientData<Id extends EntityId>(
  api: ComponentApi,
  data: EntityRawDataById<Id> | undefined,
  options: EntityComposeOptions<Id>
) {
  if (data) {
    return await api.clientTransformerContext.toClient<
      'base::compose',
      EntityMap[Id]
    >('base::compose', data as never, options);
  }

  return api.getDefaultData('base::compose', options) as EntityComposeData<Id>;
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
