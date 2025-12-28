import type { ComposeOptions } from '@game-cms/base-components';
import type { ClientEntitySchema, EntityData } from '@game-cms/base-types';
import type { ComponentApi } from '@game-cms/component-api';
import { mapObject } from '@game-cms/shared/object';
import type { ComponentClientDataById } from '@game-cms/types';

export function transformDataToClientData<T extends EntityData>(
  api: ComponentApi,
  schema: ClientEntitySchema<T>,
  data: T | undefined,
  options: ComposeOptions
): ComponentClientDataById<'base::compose'> {
  const dataOrDefault =
    data ??
    (mapObject(schema.components, (propSchema) =>
      api.getDefaultData(propSchema.controller, propSchema.options)
    ) as T);

  return api.clientResolverContext.toClient(
    'base::compose',
    dataOrDefault,
    options
  );
}

export function transformClientDataToData<T extends EntityData>(
  api: ComponentApi,
  schema: ClientEntitySchema<T>,
  clientData: ComponentClientDataById<'base::compose'>,
  options: ComposeOptions
) {
  return api.clientResolverContext.fromClient(
    'base::compose',
    clientData,
    options
  );
}
