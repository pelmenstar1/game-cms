import { ComponentDataValidator } from '@game-cms/core';

export const validator: ComponentDataValidator<'base::file'> = (
  data,
  options
) => {
  if (options.minItems !== undefined && data.length < options.minItems) {
    return 'TOO_FEW_ITEMS';
  }

  if (options.maxItems !== undefined && data.length > options.maxItems) {
    return 'TOO_MANY_ITEMS';
  }
};
