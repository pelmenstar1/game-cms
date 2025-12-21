import type { ClientEntitySchema, EntityData } from '@game-cms/base-types';
import {
  conditionalAstExpressionToString,
  type ConditionalChoices,
  type EntityConditionalData,
} from '@game-cms/conditional';
import { mapObject } from '@game-cms/shared/object';

import type { RawEntityConditionalData } from '@/types/conditional';

import { ComponentErrorPending } from './error';

export function transformEntityConditionalDataToRaw<T extends EntityData>(
  schema: ClientEntitySchema<T>,
  data: EntityConditionalData<T> | undefined
) {
  const result = mapObject(schema.components, (propSchema, key) => {
    if (data !== undefined) {
      const value = data[key];

      return {
        default: { value: value.default, error: ComponentErrorPending },
        alternative:
          value.alternative?.map(({ value, condition }) => ({
            condition: {
              raw: conditionalAstExpressionToString(condition),
              expression: condition,
            },
            data: {
              value,
              error: ComponentErrorPending,
            },
          })) ?? [],
      };
    }

    return {
      default: {
        value: propSchema.defaultData,
        error: ComponentErrorPending,
      },
      alternative: [],
    };
  });

  return result as RawEntityConditionalData<T>;
}

export function transformEntityConditionalDataFromRaw<T extends EntityData>(
  data: RawEntityConditionalData<T>
) {
  return mapObject(data, (value): ConditionalChoices<T[keyof T]> => {
    const alternative = value.alternative.map(({ condition, data }) => {
      if (condition.expression === null) {
        throw new Error('Condition expression is null');
      }

      return {
        condition: condition.expression,
        value: data.value,
      };
    });

    return {
      default: value.default.value,
      alternative: alternative.length > 0 ? alternative : undefined,
    };
  }) as EntityConditionalData<T>;
}
