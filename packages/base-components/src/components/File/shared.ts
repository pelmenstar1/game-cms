import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  componentMeta,
} from '@game-cms/core';

const id = 'base::file';

type Id = typeof id;

export const meta = componentMeta({
  id,
  config: {
    ui: {
      compact: true,
    },
  },
});

export const defaultRawData: ComponentDefaultDataHandler<Id> = [];

export const validator: ComponentDataValidator<Id> = (data, options) => {
  if (options.minItems !== undefined && data.length < options.minItems) {
    return 'TOO_FEW_ITEMS';
  }

  if (options.maxItems !== undefined && data.length > options.maxItems) {
    return 'TOO_MANY_ITEMS';
  }
};
