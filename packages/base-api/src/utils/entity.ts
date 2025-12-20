import type {
  ConditionalChoices,
  EntityConditionalData,
} from '@game-cms/conditional';
import { conditionalAstExpression } from '@game-cms/conditional/schema';
import { cms } from '@game-cms/global';
import { resolveMaybeFactory } from '@game-cms/shared';
import { mapObject } from '@game-cms/shared/object';
import type { ComponentData, ServerComponentSchema } from '@game-cms/types';
import { z, type ZodType } from 'zod';

function getValidatorForComponent<Data extends ComponentData>(
  component: ServerComponentSchema<ComponentData, Data>
): ZodType<ConditionalChoices<Data>> {
  const { validation } = component.controller;

  const dataValidator = resolveMaybeFactory(validation.data, component.options);

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
