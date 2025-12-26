import type {
  ConditionalChoices,
  EntityConditionalData,
} from '@game-cms/conditional';
import { conditionalAstExpression } from '@game-cms/conditional/schema';
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
): ZodType<ConditionalChoices<Data>> {
  const { foreignComponentContext } = cms().service('base::component');

  const { validation } = component.controller;

  const dataValidator = z.custom<Data>((data) => {
    const error = validation.data(
      data as Data,
      component.options,
      foreignComponentContext.validation
    );

    return error === undefined;
  });

  return z.object({
    default: dataValidator,
    alternative: z
      .array(
        z.object({
          condition: conditionalAstExpression,
          value: dataValidator,
        })
      )
      .optional(),
  });
}

export function getEntityValidationType<T extends EntityConditionalData>(
  id: string
) {
  const schema = cms().service('base::entitySchema').getById(id);

  if (schema === null) {
    throw new Error(`Unknown schema: ${id}`);
  }

  return z.strictObject(
    mapObject(schema.components, getValidatorForComponent)
  ) as unknown as ZodType<T>;
}
