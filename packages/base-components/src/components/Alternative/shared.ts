import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  ComponentErrorById,
  componentMeta,
} from '@game-cms/core';

const id = 'base::alternative';

type Id = typeof id;

export const meta = componentMeta({
  id,
});

export const defaultRawData: ComponentDefaultDataHandler<Id> = (
  options,
  context
) => ({
  default: context.getDefault(options.componentId, options.baseOptions),
  alternative: [],
});

export const validator: ComponentDataValidator<Id> = (
  data,
  options,
  context
) => {
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
    result.alternative.some((item) => item.data !== undefined)
  ) {
    return result;
  }
};
