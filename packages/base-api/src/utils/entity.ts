import type { EntityData } from '@game-cms/base-types';
import type {
  ComponentData,
  ComponentId,
  ComponentSchema,
} from '@game-cms/core';
import { cms } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import { z, type ZodType } from 'zod';

function getValidatorForComponent<Data extends ComponentData>(
  component: ComponentSchema<ComponentId, Data>
): ZodType<Data> {
  const { foreignValidationContext } = cms().service('base::component');

  const { validator } = cms()
    .service('base::component')
    .getController(component.componentId);

  return z.custom<Data>((data) => {
    const error = validator(
      data as Data,
      component.options,
      foreignValidationContext
    );

    return error === undefined;
  });
}

export function getEntityValidationType<T extends EntityData>(id: string) {
  const schema = cms().service('base::entitySchema').getById(id);

  if (schema === null) {
    throw new Error(`Unknown schema: ${id}`);
  }

  return z.strictObject(
    mapObject(schema.components, getValidatorForComponent)
  ) as unknown as ZodType<T>;
}
