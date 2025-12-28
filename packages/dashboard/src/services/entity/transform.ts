import type {
  EntityDataById,
  EntityId,
  EntitySchemaById,
} from '@game-cms/base-types';
import type { ComponentApi } from '@game-cms/component-api';
import { mapObject } from '@game-cms/shared/object';
import type {
  ComponentClientDataById,
  ComponentOptionsById,
} from '@game-cms/types';

type ComposeOptions = ComponentOptionsById<'base::compose'>;

export function transformDataToClientData<Id extends EntityId>(
  api: ComponentApi,
  schema: EntitySchemaById<Id>,
  data: EntityDataById<Id> | undefined,
  options: ComposeOptions
): ComponentClientDataById<'base::compose'> {
  const dataOrDefault =
    data ??
    mapObject(schema.components, (propSchema) =>
      api.getDefaultData(propSchema.componentId, propSchema.options)
    );

  return api.clientResolverContext.toClient(
    'base::compose',
    dataOrDefault,
    options
  );
}

export function transformClientDataToData(
  api: ComponentApi,
  clientData: ComponentClientDataById<'base::compose'>,
  options: ComposeOptions
) {
  return api.clientResolverContext.fromClient(
    'base::compose',
    clientData,
    options
  );
}
