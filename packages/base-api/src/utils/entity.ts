import type { EntityId, EntityInDataById } from '@game-cms/base-core';
import type {
  ComponentDataValidatorParams,
  ComponentId,
  ComponentSchema,
} from '@game-cms/core';
import { cms } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import { z, type ZodType } from 'zod';

function getValidatorForComponent<Id extends ComponentId, Args>(
  component: ComponentSchema<Id, Args>,
  params?: ComponentDataValidatorParams
) {
  const { foreignValidationContext, getController } =
    cms().service('base::component');

  const { validator } = getController(component.componentId).core;

  return z.custom().superRefine((data, ctx) => {
    const error = validator(
      data,
      component.options,
      foreignValidationContext,
      params
    );

    if (error !== undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Component data validation failed',
        params: {
          error,
        },
      });
    }
  });
}

export function getEntityValidationType<Id extends EntityId>(id: Id) {
  const schema = cms().service('base::entitySchema').getSchemaById(id);

  if (schema === null) {
    throw new Error(`Unknown schema: ${id}`);
  }

  return z.strictObject(
    mapObject(schema.components, (value) => getValidatorForComponent(value))
  ) as ZodType<EntityInDataById<Id>>;
}

export function getEntityValidationPartialType<Id extends EntityId>(id: Id) {
  const schema = cms().service('base::entitySchema').getSchemaById(id);

  if (schema === null) {
    throw new Error(`Unknown schema: ${id}`);
  }

  return z.object(
    mapObject(schema.components, (value) =>
      getValidatorForComponent(value).optional()
    )
  ) as ZodType<EntityInDataById<Id>>;
}
