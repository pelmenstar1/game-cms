import { ComponentDataValidator, ComponentErrorById } from '@game-cms/types';

export const validator: ComponentDataValidator<'base::alternative'> = (
  data,
  options,
  context
) => {
  const { componentId, baseOptions } = options;

  const result: ComponentErrorById<'base::alternative'> = {
    default: context.data(componentId, data.default, baseOptions),
    alternative: data.alternative.map((item) => ({
      condition: undefined,
      data: context.data(componentId, item, baseOptions),
    })),
  };

  if (
    result.default !== undefined ||
    result.alternative.some((item) => item.data !== undefined)
  ) {
    return result;
  }
};
