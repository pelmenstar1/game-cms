import {
  type ComponentDataValidator,
  type ComponentDefaultDataHandler,
  componentMeta,
} from '@game-cms/core';

const id = 'game::spritesheet-wrapper';

type Id = typeof id;

export const meta = componentMeta({ id });

export const defaultRawData: ComponentDefaultDataHandler<Id> = (
  options,
  context
) => {
  return context.getDefault(options.componentId, options.baseOptions);
};

export const validator: ComponentDataValidator<Id> = (
  data,
  options,
  context
) => {
  return context.validate(options.componentId, data, options.baseOptions);
};
