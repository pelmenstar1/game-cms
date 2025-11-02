import {
  conditionalAstExpression,
  type EntityConditionalData,
} from '@game-cms/conditional';
import type {
  ComponentData,
  EntitySchema,
  MaybeOptions,
} from '@game-cms/types';
import { z } from 'zod';

function resolveValidator<T extends object, Options>(
  value: MaybeOptions<T, Options>,
  options: Options
) {
  if (typeof value === 'function') {
    return value(options);
  }

  return value;
}

function isValidChoices(
  input: unknown,
  fieldKey: string,
  schema: EntitySchema
): boolean {
  if (typeof input !== 'object' || input === null) {
    return false;
  }

  const componentInfo = schema.components[fieldKey];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (componentInfo === undefined) {
    return false;
  }

  const { componentId } = componentInfo;

  const { validation } = cms
    .service('base::component')
    .getController(componentId);

  const dataValidator = resolveValidator(
    validation.data,
    componentInfo.options as ComponentData
  );

  if (!('default' in input && 'alternative' in input)) {
    return false;
  }

  if (!Array.isArray(input.alternative)) {
    return false;
  }

  const defaultResult = dataValidator.safeParse(input.default);
  if (!defaultResult.success) {
    return false;
  }

  return input.alternative.every((choice) => {
    if (!Array.isArray(choice) || choice.length !== 2) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [condition, value] = choice;

    const conditionResult = conditionalAstExpression.safeParse(condition);
    const valueResult = dataValidator.safeParse(value);

    return conditionResult.success && valueResult.success;
  });
}

export function getEntityValidationType<T extends EntityConditionalData>(
  id: string
) {
  return z.custom<T>(async (input) => {
    if (typeof input !== 'object' || input === null) {
      return false;
    }

    const schema = await cms.service('base::entitySchema').get(id);
    if (schema === null) {
      return false;
    }

    return Object.entries(input).every(([key, choices]) =>
      isValidChoices(choices, key, schema)
    );
  });
}
