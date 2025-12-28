import type { EntityData } from '@game-cms/base-types';
import { cms } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import type {
  ComponentData,
  ComponentOptions,
  ServerComponentSchema,
} from '@game-cms/types';
import { z, type ZodType } from 'zod';

function getValidatorForComponent<Data extends ComponentData>(
  component: ServerComponentSchema<ComponentOptions, Data>
): ZodType<Data> {
  const { foreignComponentContext } = cms().service('base::component');

  const { validator } = component.controller;

  return z.custom<Data>((data) => {
    const error = validator(
      data as Data,
      component.options,
      foreignComponentContext.validation
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
