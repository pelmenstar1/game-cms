import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  componentMeta,
} from '@game-cms/core';

const id = 'base::repeatable';

type Id = typeof id;

export const meta = componentMeta({ id });

export const defaultRawData: ComponentDefaultDataHandler<Id> = () => [];

export const validator: ComponentDataValidator<Id> = (
  data,
  options,
  context
) => {
  if (!Array.isArray(data)) {
    return { ownError: 'INVALID_TYPE' };
  }

  const result = data.map((element) =>
    context.validate(options.componentId, element, options.baseOptions)
  );

  if (result.some((item) => item !== undefined)) {
    return { items: result };
  }
};
