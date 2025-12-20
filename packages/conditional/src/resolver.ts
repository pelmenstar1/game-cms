import type { EntityData } from '@game-cms/base-types';
import { mapObject } from '@game-cms/shared/object';

import { evaluateConditionalExpression } from './eval.js';
import type {
  ConditionalChoices,
  ConditionalValueInput,
  EntityConditionalData,
} from './types.js';

function resolveConditionalField<T>(
  choices: ConditionalChoices<T>,
  input: ConditionalValueInput
) {
  if (choices.alternative) {
    for (const { condition, value } of choices.alternative) {
      if (evaluateConditionalExpression(condition, input)) {
        return value;
      }
    }
  }

  return choices.default;
}

export function resolveConditionalEntity<T extends EntityData>(
  entity: EntityConditionalData<T>,
  input: ConditionalValueInput
) {
  return mapObject(entity, (value) =>
    resolveConditionalField(value, input)
  ) as T;
}
