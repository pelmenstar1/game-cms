import type {
  EntityComponents,
  EntityId,
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
  EntityComponents<Id>
>;

export type EntityComposeOptions<Id extends EntityId> = ComponentOptionsById<
  'base::compose',
  EntityComponents<Id>
>;

export type EntityComposeError<Id extends EntityId> = ComponentErrorById<
  'base::compose',
  EntityComponents<Id>
>;

export function transformDataToClientData<Id extends EntityId>(
  api: ComponentApi,
  data: EntityRawDataById<Id> | undefined,
  options: EntityComposeOptions<Id>
) {
  if (data) {
    return api.clientTransformerContext.toClient<
      'base::compose',
      EntityComponents<Id>
    >('base::compose', data as never, options);
  }

  return api.getDefaultData('base::compose', options) as EntityComposeData<Id>;
}
