import type {
  EntityId,
  EntityMap,
  EntityRawDataById,
} from '@game-cms/base-core';
import type { ComponentApi } from '@game-cms/component-api';
import type {
  ComponentClientDataById,
  ComponentErrorById,
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

export type EntityComposeError<Id extends EntityId> = ComponentErrorById<
  'base::compose',
  EntityMap[Id]
>;

export function transformDataToClientData<Id extends EntityId>(
  api: ComponentApi,
  data: EntityRawDataById<Id> | undefined,
  options: EntityComposeOptions<Id>
) {
  if (data) {
    return api.clientTransformerContext.toClient<
      'base::compose',
      EntityMap[Id]
    >('base::compose', data as never, options);
  }

  return api.getDefaultData('base::compose', options) as EntityComposeData<Id>;
}
