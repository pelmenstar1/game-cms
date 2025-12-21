import type { ClientEntitySchema, EntityData } from '@game-cms/base-types';
import {
  conditionalAstExpressionToString,
  type EntityConditionalData,
} from '@game-cms/conditional';
import { mapObject } from '@game-cms/shared/object';

import type { RawEntityConditionalData } from '@/types/conditional';

import { ComponentErrorPending } from './error';

export function transformEntityConditionalDataToRaw<T extends EntityData>(
  schema: ClientEntitySchema<T>,
  data: EntityConditionalData<T> | undefined
) {
  const result = data
    ? mapObject(data, (value) => ({
        default: { value: value.default, error: ComponentErrorPending },
        alternative:
          value.alternative?.map((choice) => ({
            condition: conditionalAstExpressionToString(choice.condition),
            error: ComponentErrorPending,
            value: choice.value,
          })) ?? [],
      }))
    : mapObject(schema.components, (propSchema) => ({
        default: {
          value: propSchema.defaultData,
          error: ComponentErrorPending,
        },
        alternative: [],
      }));

  return result as RawEntityConditionalData<T>;
}

export function transformEntityConditionalDataFromRaw<T extends EntityData>(
  data: RawEntityConditionalData<T>
) {
  return mapObject(data, (value) => ({
    default: value.default.value,
    alternative: value.alternative.map((choice) => ({
      condition: choice.condition,
      value: choice.value,
    })),
  })) as unknown as EntityConditionalData<T>;
}
