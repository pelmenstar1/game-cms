import { ComponentDataValidator } from '@game-cms/types';

export const validator: ComponentDataValidator<'base::repeatable'> = (
  data,
  options,
  context
) => {
  const result = data.map((element) =>
    context.data(options.componentId, element, options.baseOptions)
  );

  return result.every((element) => element === undefined) ? undefined : result;
};
