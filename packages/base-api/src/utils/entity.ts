import {
  conditionalAstExpression,
  type ConditionalChoices,
  type EntityConditionalData,
} from '@game-cms/conditional';
import { cms } from '@game-cms/global';
import { resolveMaybeFactory } from '@game-cms/shared';
import type { ComponentData, ServerComponentSchema } from '@game-cms/types';
import { z, ZodType } from 'zod';

function getValidatorForComponent<Data extends ComponentData>(
  component: ServerComponentSchema<ComponentData, Data>
): ZodType<ConditionalChoices<Data>> {
  const { validation } = component.controller;

  const dataValidator = resolveMaybeFactory(validation.data, component.options);

  return z.object({
    default: dataValidator,
    alternative: z
      .array(z.tuple([conditionalAstExpression, dataValidator]))
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
    Object.fromEntries(
      Object.entries(schema.components).map(([key, component]) => {
        return [key, getValidatorForComponent(component)];
      })
    )
  ) as unknown as ZodType<T>;
}
