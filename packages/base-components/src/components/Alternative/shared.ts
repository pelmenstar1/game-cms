import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  ComponentErrorById,
  componentMeta,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

const id = 'base::alternative';

type Id = typeof id;

export const meta = componentMeta({
  id,
});

export const defaultRawData: ComponentDefaultDataHandler<Id> = (
  options,
  context
) => ({
  default: context.getDefaultData(options.componentId, options.baseOptions),
  alternative: [],
});

export const validator: ComponentDataValidator<Id> = (
  data,
  options,
  context
) => {
  if (
    !(
      isNonNullObject(data) &&
      'default' in data &&
      'alternative' in data &&
      Array.isArray(data.alternative)
    )
  ) {
    return { ownError: 'INVALID_TYPE' };
  }

  const { componentId, baseOptions } = options;

  const result: ComponentErrorById<Id> = {
    default: context.validate(componentId, data.default, baseOptions),
    alternative: data.alternative.map((item) => ({
      condition: undefined,
      data: context.validate(componentId, item, baseOptions),
    })),
  };

  if (
    result.default !== undefined ||
    result.alternative?.some((item) => item.data !== undefined)
  ) {
    return result;
  }
};
