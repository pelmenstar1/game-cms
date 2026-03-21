import {
  EntityComponents,
  EntityId,
  EntityOutDataById,
} from '@game-cms/base-core';
import {
  ComponentClientDataById,
  ComponentClientOptionsById,
  ComponentErrorById,
  ForeignComponentClientDataTransformerContext,
} from '@game-cms/core';

export type EntityComposeData<Id extends EntityId> = ComponentClientDataById<
  'base::compose',
  EntityComponents<Id>
>;

export type EntityComposeOptions<Id extends EntityId> =
  ComponentClientOptionsById<'base::compose', EntityComponents<Id>>;

export type EntityComposeError<Id extends EntityId> = ComponentErrorById<
  'base::compose',
  EntityComponents<Id>
>;

export function transformDataToClientData<Id extends EntityId>(
  clientTransformerContext: ForeignComponentClientDataTransformerContext,
  data: EntityOutDataById<Id> | undefined,
  options: EntityComposeOptions<Id>
) {
  const result =
    data !== undefined
      ? clientTransformerContext.toClient(
          'base::compose',
          data as never,
          options
        )
      : clientTransformerContext.getDefaultData('base::compose', options);

  return result as EntityComposeData<Id>;
}
