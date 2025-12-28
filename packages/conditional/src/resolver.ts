import { evaluateConditionalExpression } from './eval.js';
import type { ConditionalData, ConditionalValueInput } from './types.js';

export function resolveConditionalData<T>(
  data: ConditionalData<T>,
  input: ConditionalValueInput
) {
  for (const { condition, value } of data.alternative) {
    if (evaluateConditionalExpression(condition, input)) {
      return value;
    }
  }

  return data.default;
}
