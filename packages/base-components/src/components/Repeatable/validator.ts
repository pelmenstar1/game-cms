import { ComponentDataValidator } from '@game-cms/core';

export const validator: ComponentDataValidator<'base::repeatable'> = (
  data,
  options,
  context
) => {
  const result = data.map((element) =>
    context.validate(options.componentId, element, options.baseOptions)
  );

  return result.every((element) => element === undefined) ? undefined : result;
};
