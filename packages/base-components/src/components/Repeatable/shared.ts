import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  componentMeta,
} from '@game-cms/core';

const id = 'base::repeatable';

type Id = typeof id;

export const meta = componentMeta({ id });

export const defaultRawData: ComponentDefaultDataHandler<Id> = [];

export const validator: ComponentDataValidator<Id> = (
  data,
  options,
  context
) => {
  const result = data.map((element) =>
    context.validate(options.componentId, element, options.baseOptions)
  );

  return result.every((element) => element === undefined) ? undefined : result;
};
