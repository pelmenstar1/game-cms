import type { EntityId, EntityRawDataById } from '@game-cms/base-core';
import type {
  ComponentId,
  ComponentRawInDataById,
  ComponentSchema,
} from '@game-cms/core';
import { cms } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import { z, type ZodType } from 'zod';

function getValidatorForComponent<Id extends ComponentId, Args>(
  component: ComponentSchema<Id, Args>
) {
  const { foreignValidationContext, getController } =
    cms().service('base::component');

  const { validator } = getController(component.componentId);

  return z.custom<ComponentRawInDataById<Id, Args>>((data) => {
    const error = validator(data, component.options, foreignValidationContext);

    return error === undefined;
  });
}

export function getEntityValidationType<Id extends EntityId>(id: Id) {
  const schema = cms().service('base::entitySchema').getById(id);

  if (schema === null) {
    throw new Error(`Unknown schema: ${id}`);
  }

  return z.strictObject(
    mapObject(schema.components, getValidatorForComponent)
  ) as ZodType<EntityRawDataById<Id>>;
}
