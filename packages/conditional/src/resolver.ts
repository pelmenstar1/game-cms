import type { EntityData } from '@game-cms/base-types';

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
    for (const [condition, value] of choices.alternative) {
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
): T {
  return Object.fromEntries(
    Object.entries(entity).map(([key, value]) => [
      key,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      resolveConditionalField(value, input),
    ])
  ) as T;
}
